import { getDatabase } from './db';
import { User } from './schema';

/**
 * Get a user by ID
 */
export function getUserById(id: number): User | null {
  const db = getDatabase();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | null;
  return user;
}

/**
 * Get a user by email
 */
export function getUserByEmail(email: string): User | null {
  const db = getDatabase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | null;
  return user;
}

/**
 * Create a new user
 */
export function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): number {
  const db = getDatabase();
  const result = db.prepare(
    'INSERT INTO users (email, name) VALUES (?, ?)'
  ).run(user.email, user.name);
  
  return result.lastInsertRowid as number;
}

/**
 * Update a user
 */
export function updateUser(id: number, user: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): boolean {
  const db = getDatabase();
  
  // Build the SET part of the query dynamically based on provided fields
  const updates: string[] = [];
  const values: any[] = [];
  
  if (user.email !== undefined) {
    updates.push('email = ?');
    values.push(user.email);
  }
  
  if (user.name !== undefined) {
    updates.push('name = ?');
    values.push(user.name);
  }
  
  if (updates.length === 0) {
    return false;
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  
  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  values.push(id);
  
  const result = db.prepare(query).run(...values);
  return result.changes > 0;
}

/**
 * Delete a user
 */
export function deleteUser(id: number): boolean {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return result.changes > 0;
}

/**
 * Get all users
 */
export function getAllUsers(): User[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM users ORDER BY name').all() as User[];
}

/**
 * Get a temporary mock user for development (before authentication is implemented)
 */
export function getMockCreator(): User {
  // Check if mock user exists, create if not
  const existingUser = getUserByEmail('creator@example.com');
  
  if (existingUser) {
    return existingUser;
  }
  
  // Create a mock user
  const userId = createUser({
    email: 'creator@example.com',
    name: 'Mock Creator'
  });
  
  return getUserById(userId) as User;
} 