import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/db/db';

export async function GET(
  request: Request,
  { params }: { params: { courseId: string; sectionId: string; lessonId: string } }
) {
  try {
    const courseId = parseInt(params.courseId);
    const sectionId = parseInt(params.sectionId);
    const lessonId = parseInt(params.lessonId);
    
    if (isNaN(courseId) || isNaN(sectionId) || isNaN(lessonId)) {
      return NextResponse.json(
        { error: 'Invalid course, section, or lesson ID' },
        { status: 400 }
      );
    }
    
    const db = getDatabase();
    
    // First check if the section exists and belongs to the course
    const section = db.prepare(
      'SELECT id FROM sections WHERE id = ? AND course_id = ?'
    ).get(sectionId, courseId);
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    // Get the lesson
    const lesson = db.prepare(
      'SELECT * FROM lessons WHERE id = ? AND section_id = ?'
    ).get(lessonId, sectionId);
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string; sectionId: string; lessonId: string } }
) {
  try {
    const courseId = parseInt(params.courseId);
    const sectionId = parseInt(params.sectionId);
    const lessonId = parseInt(params.lessonId);
    
    if (isNaN(courseId) || isNaN(sectionId) || isNaN(lessonId)) {
      return NextResponse.json(
        { error: 'Invalid course, section, or lesson ID' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
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
    ).get(sectionId, courseId);
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    // Update the lesson
    const result = db.prepare(
      `UPDATE lessons SET 
        title = ?,
        content = ?,
        is_free = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND section_id = ?`
    ).run(
      data.title,
      data.content || '',
      data.is_free || false,
      lessonId,
      sectionId
    );
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string; sectionId: string; lessonId: string } }
) {
  try {
    const courseId = parseInt(params.courseId);
    const sectionId = parseInt(params.sectionId);
    const lessonId = parseInt(params.lessonId);
    
    if (isNaN(courseId) || isNaN(sectionId) || isNaN(lessonId)) {
      return NextResponse.json(
        { error: 'Invalid course, section, or lesson ID' },
        { status: 400 }
      );
    }
    
    const db = getDatabase();
    
    // First check if the section exists and belongs to the course
    const section = db.prepare(
      'SELECT id FROM sections WHERE id = ? AND course_id = ?'
    ).get(sectionId, courseId);
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    // Delete the lesson
    const result = db.prepare(
      'DELETE FROM lessons WHERE id = ? AND section_id = ?'
    ).run(lessonId, sectionId);
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    // Update order numbers for remaining lessons
    db.prepare(
      `UPDATE lessons 
      SET order_num = order_num - 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE section_id = ? AND order_num > (
        SELECT order_num FROM lessons WHERE id = ?
      )`
    ).run(sectionId, lessonId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
} 