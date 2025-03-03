import Database from 'better-sqlite3';
import path from 'path';
import { initializeDatabase } from './schema';
import './server-only';

// Create a singleton database connection
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'kitcourse.db');
    db = new Database(dbPath);
    
    // Initialize the database schema if needed
    initializeDatabase(db);
  }
  
  return db;
}

// Close the database connection when the app is shutting down
process.on('exit', () => {
  if (db) {
    db.close();
  }
}); 