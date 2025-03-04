import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/db/db';

interface Section {
  id: number;
  order_num: number;
}

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const courseIdNum = parseInt(courseId);
    
    if (isNaN(courseIdNum)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    if (!data.sectionId || typeof data.direction !== 'string') {
      return NextResponse.json(
        { error: 'Section ID and direction (up/down) are required' },
        { status: 400 }
      );
    }
    
    const db = getDatabase();
    
    // Start a transaction
    db.prepare('BEGIN').run();
    
    try {
      // Get current section and its order
      const currentSection = db.prepare(
        'SELECT id, order_num FROM sections WHERE id = ? AND course_id = ?'
      ).get(data.sectionId, courseIdNum) as Section | undefined;
      
      if (!currentSection) {
        throw new Error('Section not found');
      }
      
      // Get adjacent section based on direction
      const adjacentSection = db.prepare(
        `SELECT id, order_num FROM sections 
         WHERE course_id = ? AND order_num ${data.direction === 'up' ? '<' : '>'} ? 
         ORDER BY order_num ${data.direction === 'up' ? 'DESC' : 'ASC'} 
         LIMIT 1`
      ).get(courseIdNum, currentSection.order_num) as Section | undefined;
      
      if (!adjacentSection) {
        // No adjacent section, already at top/bottom
        db.prepare('ROLLBACK').run();
        return NextResponse.json({ success: false, message: 'Already at ' + (data.direction === 'up' ? 'top' : 'bottom') });
      }
      
      // Swap order numbers
      const updateStmt = db.prepare(
        'UPDATE sections SET order_num = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      );
      
      updateStmt.run(adjacentSection.order_num, currentSection.id);
      updateStmt.run(currentSection.order_num, adjacentSection.id);
      
      db.prepare('COMMIT').run();
      return NextResponse.json({ success: true });
    } catch (error) {
      db.prepare('ROLLBACK').run();
      throw error;
    }
  } catch (error) {
    console.error('Error reordering sections:', error);
    return NextResponse.json(
      { error: 'Failed to reorder sections' },
      { status: 500 }
    );
  }
} 