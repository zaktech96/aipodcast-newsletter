// import type { Config } from 'drizzle-kit';

// /**
//  * Drizzle configuration file
//  * This replaces Prisma's schema configuration and migration system
//  */
// export default {
//   // Path to your schema definition
//   schema: './drizzle/schema.ts',
  
//   // Output directory for SQL migrations
//   out: './drizzle/migrations',
  
//   // Database driver (PostgreSQL for Supabase)
//   driver: 'pg',
  
//   // Database credentials 
//   // Using the same DATABASE_URL from your Prisma configuration
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL as string,
//   },
  
//   // Verbose logging during migrations
//   verbose: false,
  
//   // Don't print drizzle-kit banner
//   strict: true,
// } satisfies Config; 