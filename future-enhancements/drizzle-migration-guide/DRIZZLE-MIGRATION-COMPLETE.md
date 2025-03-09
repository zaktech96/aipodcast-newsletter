# Prisma to Drizzle Migration Guide

This project has been migrated from Prisma to Drizzle ORM. This document explains the changes made and how to work with the new ORM.

## What Changed

1. **ORM Change**: Migrated from Prisma ORM to Drizzle ORM
2. **Schema Definition**: Changed from Prisma Schema Language (`.prisma`) to TypeScript-based schema with Drizzle
3. **Migration Workflow**: Updated to use Drizzle Kit for migrations
4. **Database Access**: Implemented three access patterns:
   - Client Components: `createClientDrizzle()` (respects RLS)
   - Server Components: `createServerDrizzle()` (can bypass RLS, with service role)
   - Server Actions: `createDirectClient()` (direct database access, bypasses RLS)

## Directory Structure

```
├── db/
│   ├── schema/              # Drizzle schema definitions
│   │   ├── index.ts         # Exports all table schemas
│   │   ├── users.ts         # User table schema
│   │   ├── payments.ts      # Payments table schema
│   │   └── ...              # Other table schemas
│   └── migrate.ts           # Migration utility script
├── drizzle/                 # Migration files (auto-generated)
│   ├── meta/                # Migration metadata
│   └── *.sql                # SQL migration files
├── lib/
│   └── drizzle/             # Drizzle client utilities
│       └── index.ts         # Client creation functions
└── drizzle.config.ts        # Drizzle configuration
```

## How to Use

### 1. Initial Setup for New Project Clone

If you just cloned the project:

1. Copy `.env.template` to `.env` and set your database URLs:
   ```
   # Connect to Supabase via connection pooling with Supavisor (port 6543)
   DATABASE_URL="postgres://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
   
   # Direct connection to the database (port 5432)
   DIRECT_URL="postgres://postgres:[PASSWORD]@[HOST]:5432/postgres"
   ```

2. Run the initialization script:
   ```bash
   bun run db:init
   ```
   
   This will:
   - Generate migrations from the schema
   - Apply migrations to your database
   - Apply Row Level Security (RLS) policies
   - Optionally add sample data

3. Start your development server:
   ```bash
   bun run dev
   ```

### 2. Database Schema Changes

When you need to change the database schema:

1. Edit the schema files in `db/schema/`
2. Generate migrations:
   ```bash
   bun run db:generate
   ```
3. Apply migrations to development database:
   ```bash
   bun run db:migrate
   ```
4. Deploy to production (after testing):
   ```bash
   # Backup first
   supabase db dump --project-ref YOUR_PROD_REF -f backup.sql
   
   # Deploy
   bun run db:push
   ```

### 3. Using in React Components

#### Client Components
```tsx
'use client';

import { createClientDrizzle } from '@/lib/drizzle';

export default function MyClientComponent() {
  const supabase = createClientDrizzle();
  
  async function fetchData() {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', userId);
    // Do something with the data
  }
  
  return <div>...</div>;
}
```

#### Server Components
```tsx
import { createServerDrizzle } from '@/lib/drizzle';

export default async function MyServerComponent() {
  const supabase = await createServerDrizzle();
  
  const { data, error } = await supabase
    .from('users')
    .select()
    .limit(10);
  
  return <div>...</div>;
}
```

#### Server Actions
```tsx
'use server';

import { createDirectClient } from '@/lib/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserById(id: string) {
  const db = createDirectClient();
  const user = await db.select().from(users).where(eq(users.userId, id));
  return { data: user[0] };
}
```

### 4. Row Level Security (RLS)

Drizzle ORM with Supabase supports Row Level Security. We've implemented RLS policies in our setup:

1. RLS policies are defined in `db/rls.sql`
2. Apply policies with:
   ```bash
   bun run db:rls
   ```
3. When creating new tables, add appropriate RLS policies to the SQL file

The RLS policies ensure:
- Users can only access their own data 
- Subscription plans are readable by anyone
- Service role bypasses RLS for admin operations

When using the different client types:
- `createClientDrizzle()`: Respects RLS policies (use in client components)
- `createServerDrizzle()`: Uses service role key (can bypass RLS)
- `createDirectClient()`: Direct database access (bypasses RLS)

## Command Reference

- **Generate migrations**: `bun run db:generate`
- **Apply migrations**: `bun run db:migrate`
- **Push schema changes directly**: `bun run db:push`
- **View database with UI**: `bun run db:studio`
- **Check different environments**:
  ```bash
  # For dev database
  bun run db:generate --config=drizzle-dev.config.ts
  
  # For prod database (be careful!)
  bun run db:generate --config=drizzle-prod.config.ts
  ```

## Why Drizzle?

Drizzle offers several advantages:
- Type-safe SQL query builder
- No code generation step needed
- More flexible schema definition in TypeScript
- Better performance and lower resource usage
- Direct compatibility with Supabase (including RLS)
- Full control over SQL queries
- Simpler, more explicit query syntax

For more details, see the [DATABASE-GUIDE.md](./DATABASE-GUIDE.md) file. 