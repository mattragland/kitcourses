const { getDatabase } = require('./db');

function getAllCourses() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
}

function getCourseById(id) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
}

function createCourse(course) {
  const db = getDatabase();
  const { title, description, image_url } = course;
  
  const result = db.prepare(
    'INSERT INTO courses (title, description, image_url) VALUES (?, ?, ?)'
  ).run(title, description, image_url);
  
  return result.lastInsertRowid;
}

function updateCourse(id, course) {
  const db = getDatabase();
  const existingCourse = getCourseById(id);
  
  if (!existingCourse) {
    return false;
  }
  
  const { title, description, image_url } = course;
  const updates = [];
  const values = [];
  
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

function deleteCourse(id) {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM courses WHERE id = ?').run(id);
  return result.changes > 0;
}

// Section operations
function getSectionsByCourseId(courseId) {
  const db = getDatabase();
  return db.prepare(
    'SELECT * FROM sections WHERE course_id = ? ORDER BY order_num'
  ).all(courseId);
}

function createSection(section) {
  const db = getDatabase();
  const { course_id, title, order } = section;
  
  const result = db.prepare(
    'INSERT INTO sections (course_id, title, order_num) VALUES (?, ?, ?)'
  ).run(course_id, title, order);
  
  return result.lastInsertRowid;
}

// Lesson operations
function getLessonsBySectionId(sectionId) {
  const db = getDatabase();
  return db.prepare(
    'SELECT * FROM lessons WHERE section_id = ? ORDER BY order_num'
  ).all(sectionId);
}

function getLessonById(id) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM lessons WHERE id = ?').get(id);
}

function createLesson(lesson) {
  const db = getDatabase();
  const { section_id, title, content, is_free, order } = lesson;
  
  const result = db.prepare(
    'INSERT INTO lessons (section_id, title, content, is_free, order_num) VALUES (?, ?, ?, ?, ?)'
  ).run(section_id, title, content, is_free ? 1 : 0, order);
  
  return result.lastInsertRowid;
}

function updateLesson(id, lesson) {
  const db = getDatabase();
  const existingLesson = getLessonById(id);
  
  if (!existingLesson) {
    return false;
  }
  
  const { section_id, title, content, is_free, order } = lesson;
  const updates = [];
  const values = [];
  
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

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getSectionsByCourseId,
  createSection,
  getLessonsBySectionId,
  getLessonById,
  createLesson,
  updateLesson
}; 