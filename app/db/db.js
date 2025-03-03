const Database = require('better-sqlite3');
const path = require('path');
const { initializeDatabase } = require('./schema');
require('./server-only');

// Create a singleton database connection
let db = null;

function getDatabase() {
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

module.exports = { getDatabase }; 