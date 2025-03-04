import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/db/db';

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
    
    if (!Array.isArray(data.lessons)) {
      return NextResponse.json(
        { error: 'Lessons array is required' },
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
    
    // Start a transaction
    db.prepare('BEGIN').run();
    
    try {
      // Update each lesson's order
      const updateStmt = db.prepare(
        'UPDATE lessons SET order_num = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND section_id = ?'
      );
      
      for (const lesson of data.lessons) {
        const result = updateStmt.run(lesson.order_num, lesson.id, sectionId);
        
        if (result.changes === 0) {
          throw new Error(`Lesson ${lesson.id} not found`);
        }
      }
      
      db.prepare('COMMIT').run();
      return NextResponse.json({ success: true });
    } catch (error) {
      db.prepare('ROLLBACK').run();
      throw error;
    }
  } catch (error) {
    console.error('Error reordering lessons:', error);
    return NextResponse.json(
      { error: 'Failed to reorder lessons' },
      { status: 500 }
    );
  }
} 