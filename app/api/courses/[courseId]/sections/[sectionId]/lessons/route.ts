import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/db/db';

interface MaxOrderResult {
  max_order: number | null;
}

export async function GET(
  request: Request,
  { params }: { params: { courseId: string; sectionId: string } }
) {
  try {
    const courseId = await params.courseId;
    const sectionId = await params.sectionId;
    const courseIdNum = parseInt(courseId);
    const sectionIdNum = parseInt(sectionId);
    
    if (isNaN(courseIdNum) || isNaN(sectionIdNum)) {
      return NextResponse.json(
        { error: 'Invalid course or section ID' },
        { status: 400 }
      );
    }
    
    const db = getDatabase();
    
    // First check if the section exists and belongs to the course
    const section = db.prepare(
      'SELECT id FROM sections WHERE id = ? AND course_id = ?'
    ).get(sectionIdNum, courseIdNum);
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    // Get all lessons for the section
    const lessons = db.prepare(
      'SELECT * FROM lessons WHERE section_id = ? ORDER BY order_num ASC'
    ).all(sectionIdNum);
    
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { courseId: string; sectionId: string } }
) {
  let data;
  try {
    const courseId = await params.courseId;
    const sectionId = await params.sectionId;
    const courseIdNum = parseInt(courseId);
    const sectionIdNum = parseInt(sectionId);
    
    if (isNaN(courseIdNum) || isNaN(sectionIdNum)) {
      return NextResponse.json(
        { error: 'Invalid course or section ID' },
        { status: 400 }
      );
    }
    
    data = await request.json();
    
    if (!data.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const db = getDatabase();
    
    // First check if the section exists and belongs to the course
    const section = db.prepare(
      'SELECT id FROM sections WHERE id = ? AND course_id = ?'
    ).get(sectionIdNum, courseIdNum);
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    // Get the current highest order number
    const maxOrder = db.prepare(
      'SELECT MAX(order_num) as max_order FROM lessons WHERE section_id = ?'
    ).get(sectionIdNum) as MaxOrderResult;
    
    const orderNum = (maxOrder?.max_order || 0) + 1;
    
    // Convert boolean to number for SQLite
    const isFreeNum = data.is_free ? 1 : 0;
    
    // Create the new lesson
    const result = db.prepare(
      `INSERT INTO lessons (
        section_id,
        title,
        content,
        is_free,
        order_num,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).run(sectionIdNum, data.title, data.content || '', isFreeNum, orderNum);
    
    return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    console.error('Error details:', {
      courseId: params.courseId,
      sectionId: params.sectionId,
      requestData: data,
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
} 