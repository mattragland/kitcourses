import { Database } from 'better-sqlite3';

export interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  creator_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: number;
  course_id: number;
  title: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  section_id: number;
  title: string;
  content: string;
  is_free: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function initializeDatabase(db: Database) {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create courses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      creator_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE SET NULL
    )
  `);

  // Create sections table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      order_num INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
    )
  `);

  // Create lessons table
  db.exec(`
    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      is_free BOOLEAN DEFAULT 0,
      order_num INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (section_id) REFERENCES sections (id) ON DELETE CASCADE
    )
  `);
} 