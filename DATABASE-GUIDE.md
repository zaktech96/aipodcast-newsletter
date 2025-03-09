# Comprehensive Database Guide

This guide covers everything you need to know about developing with a Supabase PostgreSQL database and Drizzle ORM with Titan in a team environment. You'll learn how to design schemas, implement security, manage migrations, and handle common development scenarios.

## Table of Contents
1. [Fundamentals](#fundamentals)
2. [Environment Setup](#environment-setup)
3. [Schema Design](#schema-design)
4. [Row Level Security (RLS)](#row-level-security-rls)
5. [Migration Workflows](#migration-workflows)
6. [Common Scenarios](#common-scenarios)
7. [Troubleshooting](#troubleshooting)
8. [Reference Commands](#reference-commands)

## Fundamentals

### Database Basics
- **PostgreSQL**: A powerful open-source relational database used by Supabase
- **Schema**: The structure that defines your database tables, relationships, and constraints
- **Migrations**: Version-controlled changes to your database schema
- **Indexes**: Improve query performance on frequently accessed columns
- **Foreign Keys**: Enforce relationships between tables
- **Row Level Security (RLS)**: PostgreSQL's built-in security feature that restricts which rows users can access

### The Technology Stack
- **Supabase**: PostgreSQL database provider with authentication and API features
- **Drizzle ORM**: Type-safe database client and migration tool
- **TypeScript**: Provides type safety with Drizzle's schema-based types

### Dev vs Production Environments

- **Dev Database**: Your development instance on Supabase
  - ✅ Safe to experiment with
  - ✅ Shared with your team
  - ✅ Can be reset if needed
  - ✅ Perfect for testing features
  - ❌ Not for real user data

- **Production Database**: Your live Supabase instance
  - ✅ Used by real users
  - ✅ Contains real data
  - ❌ Changes affect everyone so test in dev first
  - ❌ Mistakes can be costly
  - ❌ Can't easily be reset

### How the Parts Work Together

1. **Define schema in TypeScript**
   ```typescript
   import { pgTable, serial, text } from 'drizzle-orm/pg-core';
   
   export const users = pgTable('user', {
     id: serial('id').primaryKey(),
     email: text('email').notNull().unique()
     // fields, relations, etc.
   });
   ```

2. **Drizzle generates migrations from schema changes**
   ```bash
   bun run db:generate
   ```

3. **Drizzle applies migrations to the database**
   ```bash
   bun run db:migrate
   ```

4. **RLS policies secure the data**
   ```sql
   create policy "Users can only see their own data"
   on users for select
   using (auth.uid() = id);
   ```

5. **Drizzle or Supabase client provides access**
   ```typescript
   const user = await supabase.from('users').select().eq('id', userId);
   ```

## Environment Setup

### Initial Setup for New Developers

If you've just cloned the repository, follow these steps to set up your database environment:

1. **Configure Environment Variables**

   Copy `.env.template` to `.env` and fill in your Supabase database information:

   ```bash
   cp .env.template .env
   ```

   Then update these critical database variables:
   ```
   # For connection pooling (general app use)
   DATABASE_URL="postgres://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   
   # For direct connections (migrations)
   DIRECT_URL="postgres://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   
   # Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

2. **Run the Database Initialization Script**

   ```bash
   bun run db:init
   ```

   This script will:
   - Generate and apply migrations from the schema files
   - Set up Row Level Security (RLS) policies
   - Optionally add sample data if you choose to

3. **Verify the Setup**

   Start the database studio to verify your tables were created:
   ```bash
   bun run db:studio
   ```

   Or start the development server to test the application:
   ```bash
   bun run dev
   ```

### Access Patterns

The project provides three ways to access the database, each with different security implications:

#### Client Components
```typescript
import { createClientDrizzle } from '@/lib/drizzle';

// In a client component ('use client')
function MyComponent() {
  const supabase = createClientDrizzle();
  
  async function fetchData() {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', userId);
  }
}
```

#### Server Components
```typescript
import { createServerDrizzle } from '@/lib/drizzle';

// In a server component
async function MyServerComponent() {
  const supabase = await createServerDrizzle();
  
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', userId);
}
```

#### Direct Access (Server Actions)
```typescript
import { createDirectClient } from '@/lib/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// In a server action
export async function myServerAction() {
  const db = createDirectClient();
  
  const allUsers = await db.select().from(users).where(eq(users.id, userId));
}
```

## Schema Design

### Best Practices

1. **Use Serial or UUID for IDs**
   ```typescript
   import { pgTable, serial, uuid } from 'drizzle-orm/pg-core';
   
   // With serial (auto-increment)
   export const users = pgTable('users', {
     id: serial('id').primaryKey(),
     // other fields
   });
   
   // With UUID
   export const products = pgTable('products', {
     id: uuid('id').defaultRandom().primaryKey(),
     // other fields
   });
   ```

2. **Add Timestamps to All Tables**
   ```typescript
   import { pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
   
   export const users = pgTable('users', {
     // other fields
     createdAt: timestamp('created_at').defaultNow(),
     updatedAt: timestamp('updated_at').defaultNow()
   });
   ```

3. **Create Proper Indexes**
   ```typescript
   import { pgTable, serial, varchar, index } from 'drizzle-orm/pg-core';
   
   export const users = pgTable('users', {
     id: serial('id').primaryKey(),
     email: varchar('email').notNull(),
     teamId: varchar('team_id').notNull(),
   }, (table) => {
     return {
       emailIndex: index('email_idx').on(table.email),
       teamIndex: index('team_idx').on(table.teamId),
     }
   });
   ```

4. **Define Relationships Clearly**
   ```typescript
   import { pgTable, serial, varchar, foreignKey } from 'drizzle-orm/pg-core';
   import { users } from './users';
   
   export const posts = pgTable('posts', {
     id: serial('id').primaryKey(),
     title: varchar('title').notNull(),
     authorId: serial('author_id').notNull(),
   }, (table) => ({
     authorFk: foreignKey({
       columns: [table.authorId],
       foreignColumns: [users.id]
     })
   }));
   ```

5. **Use Enums for Fixed Values**
   ```typescript
   import { pgTable, serial, pgEnum } from 'drizzle-orm/pg-core';
   
   export const roleEnum = pgEnum('role', ['USER', 'ADMIN', 'MODERATOR']);
   
   export const users = pgTable('users', {
     id: serial('id').primaryKey(),
     role: roleEnum('role').default('USER'),
   });
   ```

6. **Add Constraints Where Appropriate**
   ```typescript
   import { pgTable, serial, varchar, unique } from 'drizzle-orm/pg-core';
   
   export const users = pgTable('users', {
     id: serial('id').primaryKey(),
     email: varchar('email').notNull(),
     username: varchar('username').notNull(),
   }, (table) => ({
     uniqEmail: unique().on(table.email),
     uniqUsername: unique().on(table.username),
   }));
   ```

## Row Level Security (RLS)

### What is RLS?

Row Level Security (RLS) is a PostgreSQL feature that restricts which database rows a user can access. It's like adding invisible WHERE clauses to every query based on the user's identity.

### Our RLS Approach with Drizzle

In this project, we use a combination of SQL scripts and TypeScript to manage RLS:

1. **RLS Policies Definition**: All RLS policies are defined in `db/rls.sql`
2. **Policy Application**: Policies are applied using the `db:rls` script
3. **Automatic Setup**: When you run `db:init`, RLS policies are automatically applied

Example of our RLS implementation:

```sql
-- Enable RLS on tables
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

-- Create a policy
CREATE POLICY "Users can view their own data" 
  ON "user" 
  FOR SELECT 
  USING (auth.uid()::text = user_id);
```

### RLS and Access Patterns

Our three database access patterns interact differently with RLS:

1. **`createClientDrizzle()`**: Used in client components, respects RLS policies
   - Users only see what RLS allows them to see
   - Safest to use in client code

2. **`createServerDrizzle()`**: Used in server components, can bypass RLS
   - Uses Supabase service role that can bypass RLS if needed
   - Can fetch data regardless of the current user
   - Should be used carefully and only in server contexts

3. **`createDirectClient()`**: Used in server actions, bypasses RLS entirely
   - Direct database access that ignores RLS
   - Highest privilege level
   - Only use in server actions with proper validation

### Enabling RLS

```sql
-- Always enable RLS on tables in public schema
ALTER TABLE "table_name" ENABLE ROW LEVEL SECURITY;
```

### Common RLS Patterns

1. **Users Can Access Their Own Data**
   ```sql
   CREATE POLICY "Users can access own data"
   ON users
   FOR ALL
   TO authenticated
   USING (auth.uid()::text = user_id);
   ```

2. **Public Read, Authenticated Write**
   ```sql
   CREATE POLICY "Public read access"
   ON posts
   FOR SELECT
   TO anon, authenticated
   USING (true);
   
   CREATE POLICY "Auth users can create"
   ON posts
   FOR INSERT
   TO authenticated
   WITH CHECK (auth.uid()::text = author_id);
   ```

3. **Role-Based Access**
   ```sql
   CREATE POLICY "Admins have full access"
   ON posts
   FOR ALL
   TO authenticated
   USING (
     EXISTS (
       SELECT 1 FROM users
       WHERE users.id = auth.uid()::text
       AND users.role = 'ADMIN'
     )
   );
   ```

### Adding RLS to New Tables

When you create a new table:

1. Add the table definition to the appropriate schema file
2. Update `db/rls.sql` to enable RLS and define policies:
   ```sql
   -- Enable RLS
   ALTER TABLE "new_table" ENABLE ROW LEVEL SECURITY;
   
   -- Drop any existing policies (for idempotent updates)
   DROP POLICY IF EXISTS "Policy name" ON "new_table";
   
   -- Add policies
   CREATE POLICY "Policy name" ON "new_table" FOR SELECT USING (...);
   ```
   
   > **Note:** We always drop policies before recreating them. This "drop-and-recreate" pattern ensures
   > that the script can be run multiple times without errors, even when policies already exist.
   > PostgreSQL doesn't support a `CREATE POLICY IF NOT EXISTS` syntax, so this approach
   > makes our RLS script idempotent.

3. Apply the RLS changes:
   ```bash
   bun run db:rls
   ```

## Migration Workflows

### Understanding Migrations

Migrations are version-controlled changes to your database schema. Drizzle-kit:
1. Detects changes in your schema files
2. Generates SQL migration files
3. Allows you to apply those changes to your database
4. Tracks which migrations have been applied

### Development Workflow

1. **Start with latest code**
   ```bash
   git pull origin main
   ```

2. **Create new migration after schema changes**
   ```bash
   # Edit your schema files in db/schema/
   bun run db:generate  # Generates migration files
   ```

3. **Push migrations to your Supabase dev database**
   ```bash
   bun run db:push  # Applies migrations to your Supabase dev instance
   ```

   > **Note:** Since we're using Supabase for both development and production, 
   > we use `db:push` to apply migrations to the remote database. The `db:migrate` 
   > command is generally used for local databases only.

4. **Apply RLS policies to your dev database**
   ```bash
   bun run db:rls
   ```

5. **Update type definitions**
   ```bash
   supabase gen types typescript --project-ref YOUR_DEV_REF > types/supabase.ts
   ```

6. **Test thoroughly in dev before proceeding to production**

### Production Deployment

1. **Always backup first**
   ```bash
   supabase db dump --project-ref YOUR_PROD_REF -f backup.sql
   ```

2. **Deploy migrations to production**
   ```bash
   bun run db:push  # Applies pending migrations to production
   ```

3. **Update production type definitions**
   ```bash
   supabase gen types typescript --project-ref YOUR_PROD_REF > types/supabase.ts
   ```

### Migration Best Practices

1. **Make small, focused changes** - Easier to understand and fix if needed
2. **Test migrations in dev first** - Never test in production
3. **Backup before deploying to production** - Always have a rollback plan
4. **Keep your schema files organized** - One file per logical group of tables
5. **Use transactions for data migrations** - Ensures atomicity

## Common Scenarios

### 1. Initial Setup

```bash
# Clone the repo
git clone <repository>
cd <project-dir>

# Create .env from template and add your connection strings
cp .env.template .env

# Install dependencies
bun install

# Generate migrations
bun run db:generate

# Apply migrations to your Supabase dev instance
bun run db:push

# Apply RLS policies
bun run db:rls

# Start the database studio to explore your data
bun run db:studio
```

### 2. Adding a New Table with RLS

1. Edit or create a schema file in `db/schema/`:
   ```typescript
   // db/schema/products.ts
   import { pgTable, serial, varchar, text, numeric, timestamp } from 'drizzle-orm/pg-core';
   
   export const products = pgTable('products', {
     id: serial('id').primaryKey(),
     name: varchar('name').notNull(),
     description: text('description'),
     price: numeric('price').notNull(),
     userId: varchar('user_id').notNull(), // For RLS user association
     createdAt: timestamp('created_at').defaultNow(),
     updatedAt: timestamp('updated_at').defaultNow()
   });
   ```

2. Export the table from the main schema file:
   ```typescript
   // db/schema/index.ts
   export * from './products';
   ```

3. Generate and apply migrations:
   ```bash
   bun run db:generate
   bun run db:migrate
   ```

4. Add RLS policies to `db/rls.sql`:
   ```sql
   -- Enable RLS on the new table
   ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
   
   -- Drop any existing policies first
   DROP POLICY IF EXISTS "Users can view their own products" ON "products";
   DROP POLICY IF EXISTS "Users can update their own products" ON "products";
   DROP POLICY IF EXISTS "Users can delete their own products" ON "products";
   DROP POLICY IF EXISTS "Users can insert their own products" ON "products";
   
   -- Only let users see their own products
   CREATE POLICY "Users can view their own products" 
     ON "products" 
     FOR SELECT 
     USING (auth.uid()::text = user_id);
   
   -- Only let users update their own products
   CREATE POLICY "Users can update their own products" 
     ON "products" 
     FOR UPDATE
     USING (auth.uid()::text = user_id);
   
   -- Only let users delete their own products
   CREATE POLICY "Users can delete their own products" 
     ON "products" 
     FOR DELETE
     USING (auth.uid()::text = user_id);
   
   -- Only let users insert products they own
   CREATE POLICY "Users can insert their own products" 
     ON "products" 
     FOR INSERT
     WITH CHECK (auth.uid()::text = user_id);
   ```

5. Apply RLS policies:
   ```bash
   bun run db:rls
   ```

6. Test the new table with different access patterns to verify RLS is working correctly:
   - Through a client component (should enforce RLS)
   - Through a server component (can bypass RLS if needed)
   - Through a server action (bypasses RLS)

### 3. Modifying an Existing Table

1. Edit the schema file to modify the table:
   ```typescript
   // db/schema/products.ts
   import { pgTable, serial, varchar, text, numeric, timestamp, boolean } from 'drizzle-orm/pg-core';
   
   export const products = pgTable('products', {
     id: serial('id').primaryKey(),
     name: varchar('name').notNull(),
     description: text('description'),
     price: numeric('price').notNull(),
     inStock: boolean('in_stock').default(true), // New field
     createdAt: timestamp('created_at').defaultNow(),
     updatedAt: timestamp('updated_at').defaultNow()
   });
   ```

2. Generate and apply migrations:
   ```bash
   bun run db:generate
   bun run db:migrate
   ```

3. Update type definitions:
   ```bash
   supabase gen types typescript --project-ref YOUR_DEV_REF > types/supabase.ts
   ```

### 4. Managing Relationships

1. Edit schema files to define the relation:
   ```typescript
   // db/schema/categories.ts
   import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
   
   export const categories = pgTable('categories', {
     id: serial('id').primaryKey(),
     name: varchar('name').notNull(),
   });
   
   // db/schema/products.ts
   import { pgTable, serial, varchar, text, numeric, timestamp, integer } from 'drizzle-orm/pg-core';
   import { categories } from './categories';
   
   export const products = pgTable('products', {
     id: serial('id').primaryKey(),
     // other fields
     categoryId: integer('category_id').references(() => categories.id),
   });
   ```

2. Export the new table from the main schema file:
   ```typescript
   // db/schema/index.ts
   export * from './categories';
   ```

3. Generate and apply migrations:
   ```bash
   bun run db:generate
   bun run db:migrate
   ```

4. Don't forget to update RLS policies for the new table:
   ```sql
   ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Public read for categories"
   ON "categories"
   FOR SELECT
   TO anon, authenticated
   USING (true);
   ```

### 5. Team Development

1. When a teammate has made schema changes:
   ```bash
   git pull origin main
   bun run db:migrate  # Apply their migrations to your dev database
   ```

2. When you have conflicts in schema changes:
   - Communicate with your team to coordinate changes
   - Pull their changes first
   - Rebase your changes on top
   - Test thoroughly on dev before proceeding

## Troubleshooting

### "I messed up my dev database!"

```bash
# Option 1: Reset the migrations in your Supabase dev database
bun run db:push  # Force push schema to the Supabase dev instance

# Option 2: Request a database reset from Supabase 
# This is needed if you encounter more serious issues
```

### "I made a bad migration!"

```bash
# 1. Don't push the bad migration
# 2. Delete the bad migration files from ./drizzle
# 3. Fix your schema files
# 4. Re-generate the migrations
bun run db:generate
# 5. Apply the corrected migrations to your Supabase dev instance
bun run db:push
# 6. Re-apply RLS policies
bun run db:rls
```

### "I need to fix a production migration!"

```bash
# 1. Always create a backup first
supabase db dump --project-ref YOUR_PROD_REF -f backup.sql

# 2. Create a new migration that fixes the issue
# 3. Test thoroughly in dev
bun run db:push --config=drizzle-dev.config.ts

# 4. If it looks good, apply to production
bun run db:push --config=drizzle-prod.config.ts
```

### Common Errors

1. **"Connection error"**
   - Check your connection strings
   - Make sure your IP is allowed in Supabase
   - Verify network connectivity

2. **"Unique constraint violated"**
   - Trying to insert a record with a duplicate value in a unique field
   
3. **"Permission denied"**
   - Check your Supabase permissions
   - Ensure you're using the correct service role key for migrations

4. **"Migration failed"**
   - Check the migration SQL for errors
   - Look for conflicting changes

5. **"Policy already exists" errors**
   - This happens if you try to create RLS policies that already exist
   - We avoid this by using the drop-and-recreate pattern in our `db/rls.sql` file
   - If you see this error, check that you're using `DROP POLICY IF EXISTS` before each `CREATE POLICY`

## Reference Commands

### Drizzle Commands

```bash
# Generate migrations from schema
bun run db:generate

# Apply migrations to your Supabase dev instance
bun run db:push

# Apply migrations to different environments
bun run db:push --config=drizzle-dev.config.ts    # Dev database
bun run db:push --config=drizzle-prod.config.ts   # Production database (careful!)

# Apply RLS policies
bun run db:rls

# Start Drizzle Studio (visual database explorer)
bun run db:studio

# Apply migrations to a local database (rarely used with Supabase)
bun run db:migrate
```

### Supabase Commands

```bash
# Generate TypeScript types
supabase gen types typescript --project-ref YOUR_DEV_REF > types/supabase.ts

# Backup database
supabase db dump --project-ref YOUR_DEV_REF -f dev_backup.sql    # Dev backup
supabase db dump --project-ref YOUR_PROD_REF -f prod_backup.sql  # Production backup
```

## Additional Resources

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/current/index.html)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)