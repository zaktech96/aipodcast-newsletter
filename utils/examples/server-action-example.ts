'use server';

import { createDirectClient } from '@/lib/drizzle';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

/**
 * This is an example server action that uses Drizzle ORM directly.
 * Server actions have full database access bypassing RLS.
 */
export async function getUserById(id: string) {
  try {
    // Get direct database client (bypasses RLS)
    const db = createDirectClient();
    
    // Query with Drizzle ORM syntax
    const user = await db.select().from(users).where(eq(users.userId, id));
    
    if (!user || user.length === 0) {
      return { error: 'User not found' };
    }
    
    return { data: user[0] };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { error: 'Failed to fetch user' };
  }
}

/**
 * Create a user example
 */
export async function createUser(email: string, firstName?: string, lastName?: string) {
  try {
    const db = createDirectClient();
    
    const newUser = await db.insert(users).values({
      email,
      firstName,
      lastName
    }).returning();
    
    return { data: newUser[0] };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: 'Failed to create user' };
  }
} 