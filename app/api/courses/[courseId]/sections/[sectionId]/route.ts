import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/db/db';

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
      'SELECT * FROM sections WHERE id = ? AND course_id = ?'
    ).get(sectionIdNum, courseIdNum);
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(section);
  } catch (error) {
    console.error('Error fetching section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string; sectionId: string } }
) {
  try {
    const courseId = parseInt(params.courseId);
    const sectionId = parseInt(params.sectionId);
    
    if (isNaN(courseId) || isNaN(sectionId)) {
      return NextResponse.json(
        { error: 'Invalid course or section ID' },
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
    const result = db.prepare(
      'UPDATE sections SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND course_id = ?'
    ).run(data.title, sectionId, courseId);
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string; sectionId: string } }
) {
  try {
    const courseId = parseInt(params.courseId);
    const sectionId = parseInt(params.sectionId);
    
    if (isNaN(courseId) || isNaN(sectionId)) {
      return NextResponse.json(
        { error: 'Invalid course or section ID' },
        { status: 400 }
      );
    }
    
    const db = getDatabase();
    
    // Start a transaction
    db.prepare('BEGIN').run();
    
    try {
      // Delete all lessons in the section
      db.prepare(
        'DELETE FROM lessons WHERE section_id = ?'
      ).run(sectionId);
      
      // Delete the section
      const result = db.prepare(
        'DELETE FROM sections WHERE id = ? AND course_id = ?'
      ).run(sectionId, courseId);
      
      if (result.changes === 0) {
        db.prepare('ROLLBACK').run();
        return NextResponse.json(
          { error: 'Section not found' },
          { status: 404 }
        );
      }
      
      db.prepare('COMMIT').run();
      return NextResponse.json({ success: true });
    } catch (error) {
      db.prepare('ROLLBACK').run();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
} 