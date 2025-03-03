const { getDatabase } = require('./db');
const { seedDatabase } = require('./seed');
const { initializeDatabase } = require('./schema');

// Get the database connection
const db = getDatabase();

// Check if creator_id column exists in courses table
const tableInfo = db.prepare("PRAGMA table_info(courses)").all();
const creatorIdExists = tableInfo.some(column => column.name === 'creator_id');

// Add creator_id column if it doesn't exist
if (!creatorIdExists) {
  console.log('Adding creator_id column to courses table...');
  db.exec('ALTER TABLE courses ADD COLUMN creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL');
}

// Initialize the database schema (creates tables if they don't exist)
initializeDatabase(db);

// Seed the database with initial data
seedDatabase();

console.log('Database setup complete!'); 