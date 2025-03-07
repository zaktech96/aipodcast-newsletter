// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg';
// import * as schema from './schema';

// /**
//  * Drizzle database client for server-side operations
//  * This replaces the Prisma client in the application
//  */

// // Create a connection pool for server environments (Node.js)
// // Using the same DATABASE_URL from your Prisma configuration
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   // You can optionally use the DIRECT_URL for direct connections
//   // which is valuable when working with connection poolers like PgBouncer
//   // connectionString: process.env.DIRECT_URL,
// });

// // Create and export the Drizzle database client with our schema
// export const db = drizzle(pool, { schema });

// /**
//  * Helper function to create a Drizzle instance for edge environments
//  * For use in edge functions (Vercel Edge, Cloudflare Workers, etc.)
//  */
// export async function createEdgeDb() {
//   const { Pool } = await import('pg');
  
//   const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });
  
//   return drizzle(pool, { schema });
// }

// /**
//  * Query Examples
//  * 
//  * // Select all users
//  * const allUsers = await db.select().from(schema.users);
//  * 
//  * // Find a user by ID
//  * import { eq } from 'drizzle-orm';
//  * const user = await db.select().from(schema.users).where(eq(schema.users.userId, 'user123'));
//  * 
//  * // Create a new user
//  * const newUser = await db.insert(schema.users).values({
//  *   email: 'test@example.com',
//  *   userId: 'user456',
//  * }).returning();
//  * 
//  * // Update a user
//  * const updatedUser = await db.update(schema.users)
//  *   .set({ firstName: 'Updated Name' })
//  *   .where(eq(schema.users.userId, 'user123'))
//  *   .returning();
//  * 
//  * // Delete a user
//  * await db.delete(schema.users).where(eq(schema.users.userId, 'user123'));
//  * 
//  * // Execute a complex query with relations
//  * const usersWithSubscriptions = await db.query.users.findMany({
//  *   with: {
//  *     subscriptions: true,
//  *   },
//  * });
//  */ 