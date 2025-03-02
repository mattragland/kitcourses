import { getDatabase } from './db';
import { Course, Section, Lesson } from './schema';

export function getAllCourses(): Course[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all() as Course[];
}

export function getCourseById(id: number): Course | undefined {
  const db = getDatabase();
  return db.prepare('SELECT * FROM courses WHERE id = ?').get(id) as Course | undefined;
}

export function createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): number {
  const db = getDatabase();
  const { title, description, image_url } = course;
  
  const result = db.prepare(
    'INSERT INTO courses (title, description, image_url) VALUES (?, ?, ?)'
  ).run(title, description, image_url);
  
  return result.lastInsertRowid as number;
}

export function updateCourse(id: number, course: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>): boolean {
  const db = getDatabase();
  const existingCourse = getCourseById(id);
  
  if (!existingCourse) {
    return false;
  }
  
  const { title, description, image_url } = course;
  const updates: string[] = [];
  const values: any[] = [];
  
  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title);
  }
  
  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description);
  }
  
  if (image_url !== undefined) {
    updates.push('image_url = ?');
    values.push(image_url);
  }
  
  if (updates.length === 0) {
    return true; // Nothing to update
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  
  const query = `UPDATE courses SET ${updates.join(', ')} WHERE id = ?`;
  values.push(id);
  
  const result = db.prepare(query).run(...values);
  return result.changes > 0;
}

export function deleteCourse(id: number): boolean {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM courses WHERE id = ?').run(id);
  return result.changes > 0;
}

// Section operations
export function getSectionsByCourseId(courseId: number): Section[] {
  const db = getDatabase();
  return db.prepare(
    'SELECT * FROM sections WHERE course_id = ? ORDER BY order_num'
  ).all(courseId) as Section[];
}

export function createSection(section: Omit<Section, 'id' | 'created_at' | 'updated_at'>): number {
  const db = getDatabase();
  const { course_id, title, order } = section;
  
  const result = db.prepare(
    'INSERT INTO sections (course_id, title, order_num) VALUES (?, ?, ?)'
  ).run(course_id, title, order);
  
  return result.lastInsertRowid as number;
}

// Lesson operations
export function getLessonsBySectionId(sectionId: number): Lesson[] {
  const db = getDatabase();
  return db.prepare(
    'SELECT * FROM lessons WHERE section_id = ? ORDER BY order_num'
  ).all(sectionId) as Lesson[];
}

export function getLessonById(id: number): Lesson | undefined {
  const db = getDatabase();
  return db.prepare('SELECT * FROM lessons WHERE id = ?').get(id) as Lesson | undefined;
}

export function createLesson(lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): number {
  const db = getDatabase();
  const { section_id, title, content, is_free, order } = lesson;
  
  const result = db.prepare(
    'INSERT INTO lessons (section_id, title, content, is_free, order_num) VALUES (?, ?, ?, ?, ?)'
  ).run(section_id, title, content, is_free ? 1 : 0, order);
  
  return result.lastInsertRowid as number;
}

export function updateLesson(id: number, lesson: Partial<Omit<Lesson, 'id' | 'created_at' | 'updated_at'>>): boolean {
  const db = getDatabase();
  const existingLesson = getLessonById(id);
  
  if (!existingLesson) {
    return false;
  }
  
  const { section_id, title, content, is_free, order } = lesson;
  const updates: string[] = [];
  const values: any[] = [];
  
  if (section_id !== undefined) {
    updates.push('section_id = ?');
    values.push(section_id);
  }
  
  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title);
  }
  
  if (content !== undefined) {
    updates.push('content = ?');
    values.push(content);
  }
  
  if (is_free !== undefined) {
    updates.push('is_free = ?');
    values.push(is_free ? 1 : 0);
  }
  
  if (order !== undefined) {
    updates.push('order_num = ?');
    values.push(order);
  }
  
  if (updates.length === 0) {
    return true; // Nothing to update
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  
  const query = `UPDATE lessons SET ${updates.join(', ')} WHERE id = ?`;
  values.push(id);
  
  const result = db.prepare(query).run(...values);
  return result.changes > 0;
}

/**
 * Updates all courses to use Unsplash images instead of local placeholders
 */
export function updateCoursesWithUnsplashImages(): boolean {
  const db = getDatabase();
  
  try {
    // Web Development image
    db.prepare(
      'UPDATE courses SET image_url = ? WHERE id = ?'
    ).run('https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80', 1);
    
    // React image
    db.prepare(
      'UPDATE courses SET image_url = ? WHERE id = ?'
    ).run('https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', 2);
    
    // Python image
    db.prepare(
      'UPDATE courses SET image_url = ? WHERE id = ?'
    ).run('https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80', 3);
    
    return true;
  } catch (error) {
    console.error('Error updating course images:', error);
    return false;
  }
} 