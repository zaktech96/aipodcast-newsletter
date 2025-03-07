# Migrating from Prisma to Drizzle

This guide outlines the step-by-step process for migrating from Prisma to Drizzle in this codebase. Drizzle is a TypeScript ORM that offers better performance, cleaner SQL management, and lower resource usage compared to Prisma.

## Migration Benefits

- **Performance**: Drizzle is significantly faster (5-10x for complex queries)
- **Bundle Size**: ~10-20KB vs Prisma's 20-40MB with engines
- **Cold Starts**: Faster serverless startup times (critical in serverless environments)
- **SQL Control**: Cleaner SQL generation and more direct query control
- **Supabase Integration**: Better native integration with Supabase PostgreSQL features

## Prerequisites

- Existing Prisma schema
- Supabase as database provider
- Node.js environment
- Understanding of TypeScript

## Migration Overview

1. Install Drizzle dependencies
2. Convert Prisma schema to Drizzle schema
3. Create a Drizzle client adapter
4. Update database queries in your application
5. Create a migration system
6. Adjust database operations 

---

## Step 1: Install Drizzle Dependencies

```bash
bun add drizzle-orm pg
bun add -d drizzle-kit @types/pg
```

## Step 2: Create Drizzle Schema

Create `drizzle/schema.ts` using your Prisma schema as a reference:

```typescript
import { pgTable, serial, timestamp, varchar, text, integer } from 'drizzle-orm/pg-core';

// User model
export const users = pgTable('user', {
  id: serial('id').primaryKey(),
  createdTime: timestamp('created_time').defaultNow(),
  email: varchar('email').notNull().unique(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  gender: varchar('gender'),
  profileImageUrl: varchar('profile_image_url'),
  userId: varchar('user_id').notNull().unique(),
  subscription: varchar('subscription'),
});

// Payments model
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  createdTime: timestamp('created_time').defaultNow(),
  stripeId: varchar('stripe_id').notNull(),
  email: varchar('email').notNull(),
  amount: varchar('amount').notNull(),
  paymentTime: varchar('payment_time').notNull(),
  paymentDate: varchar('payment_date').notNull(),
  currency: varchar('currency').notNull(),
  userId: varchar('user_id').notNull(),
  customerDetails: varchar('customer_details').notNull(),
  paymentIntent: varchar('payment_intent').notNull(),
});

// Subscriptions model
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  createdTime: timestamp('created_time').defaultNow(),
  subscriptionId: varchar('subscription_id').notNull(),
  stripeUserId: varchar('stripe_user_id').notNull(),
  status: varchar('status').notNull(),
  startDate: varchar('start_date').notNull(),
  endDate: varchar('end_date'),
  planId: varchar('plan_id').notNull(),
  defaultPaymentMethodId: varchar('default_payment_method_id'),
  email: varchar('email').notNull(),
  userId: varchar('user_id').notNull(),
});

// Subscription plans model
export const subscriptionPlans = pgTable('subscriptions_plans', {
  id: serial('id').primaryKey(),
  createdTime: timestamp('created_time').defaultNow(),
  planId: varchar('plan_id').notNull(),
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
  amount: varchar('amount').notNull(),
  currency: varchar('currency').notNull(),
  interval: varchar('interval').notNull(),
});

// Invoices model
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  createdTime: timestamp('created_time').defaultNow(),
  invoiceId: varchar('invoice_id').notNull(),
  subscriptionId: varchar('subscription_id').notNull(),
  amountPaid: varchar('amount_paid').notNull(),
  amountDue: varchar('amount_due'),
  currency: varchar('currency').notNull(),
  status: varchar('status').notNull(),
  email: varchar('email').notNull(),
  userId: varchar('user_id'),
});
```

## Step 3: Create Drizzle Client

Create `lib/db/index.ts` for database connection:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/drizzle/schema';

// For server-side usage (Edge functions with pooling)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
```

## Step 4: Create a Migration System

Set up the Drizzle migration system:

1. Create a `drizzle.config.ts` in your project root:

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg', 
  dbCredentials: {
    // Using the same DATABASE_URL from Prisma
    connectionString: process.env.DATABASE_URL as string,
  },
} satisfies Config;
```

2. Add scripts to your package.json:

```json
{
  "scripts": {
    // ... existing scripts
    "drizzle:generate": "drizzle-kit generate:pg",
    "drizzle:push": "drizzle-kit push:pg",
    "drizzle:studio": "drizzle-kit studio"
  }
}
```

## Step 5: Update Database Queries

Replace Prisma queries with Drizzle equivalents in your application:

### Example Conversions

**1. Fetching data**

Prisma:
```typescript
const user = await prisma.user.findUnique({
  where: { userId: userId }
});
```

Drizzle:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/drizzle/schema';

const user = await db.query.users.findFirst({
  where: eq(users.userId, userId)
});
```

**2. Creating data**

Prisma:
```typescript
const newUser = await prisma.user.create({
  data: {
    email: email,
    userId: userId,
    firstName: firstName
  }
});
```

Drizzle:
```typescript
const newUser = await db.insert(users)
  .values({
    email: email,
    userId: userId,
    firstName: firstName
  })
  .returning();
```

**3. Updating data**

Prisma:
```typescript
const updatedUser = await prisma.user.update({
  where: { userId: userId },
  data: { firstName: newName }
});
```

Drizzle:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/drizzle/schema';

const updatedUser = await db.update(users)
  .set({ firstName: newName })
  .where(eq(users.userId, userId))
  .returning();
```

**4. Deleting data**

Prisma:
```typescript
await prisma.user.delete({
  where: { userId: userId }
});
```

Drizzle:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/drizzle/schema';

await db.delete(users)
  .where(eq(users.userId, userId));
```

## Step 6: Adjust Database Operations

### Example of Adapting Specific Operations

**Example: Authentication Check**

Current implementation (from isAuthorized.ts):
```typescript
const supabase = await createServerActionClient();
const { data, error } = await supabase.from('subscriptions').select('*').eq('user_id', userId);

if (error?.code)
  return {
    authorized: false,
    message: error.message,
  };

if (data && data[0].status === 'active') {
  return {
    authorized: true,
    message: 'User is subscribed',
  };
}
```

Drizzle implementation:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { subscriptions } from '@/drizzle/schema';

try {
  const data = await db.select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));
  
  if (data && data[0]?.status === 'active') {
    return {
      authorized: true,
      message: 'User is subscribed',
    };
  }
  
  return {
    authorized: false,
    message: 'User is not subscribed',
  };
} catch (error: any) {
  console.error('Failed to check authorization:', error);
  return {
    authorized: false,
    message: error.message,
  };
}
```

## Step 7: Update `reset-db.sh` Script

```bash
#!/bin/bash

echo "🗑️  Stopping Supabase services..."
supabase stop

echo "🗑️  Starting fresh Supabase instance..."
supabase start

echo "🗑️  Applying schema changes..."
bun drizzle:push

echo "🔄 Regenerating types..."
supabase gen types typescript --local > types/supabase.ts

echo "✨ Database reset complete!"
```

---

## Handling Complex Queries

For complex queries, Drizzle provides more SQL-like syntax:

```typescript
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';

// Complex query example
const results = await db.execute(
  sql`SELECT u.*, COUNT(s.id) as subscription_count 
      FROM ${users} u
      LEFT JOIN ${subscriptions} s ON u.user_id = s.user_id
      WHERE u.email LIKE ${'%@example.com%'}
      GROUP BY u.id
      HAVING COUNT(s.id) > 0`
);
```

## Advanced Features

Drizzle provides powerful features for complex database operations:

1. **Transactions**:
```typescript
await db.transaction(async (tx) => {
  await tx.insert(users).values({ email: 'user@example.com', userId: 'user123' });
  await tx.insert(subscriptions).values({ 
    subscriptionId: 'sub123',
    stripeUserId: 'cus123',
    status: 'active',
    startDate: '2023-01-01',
    planId: 'plan123',
    email: 'user@example.com',
    userId: 'user123'
  });
});
```

2. **Relations**:

Define relationships in your schema:
```typescript
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.userId],
  }),
}));
```

Query with relations:
```typescript
const usersWithSubscriptions = await db.query.users.findMany({
  with: {
    subscriptions: true,
  },
});
```

## Final Steps

1. Remove Prisma dependencies:
```bash
bun remove prisma @prisma/client
```

2. Update any CI/CD workflows to use Drizzle instead of Prisma

3. Delete Prisma files:
```bash
rm -rf prisma/
```

By following this guide, you'll have successfully migrated from Prisma to Drizzle, with better performance and resources usage while maintaining the same functionality with your Supabase PostgreSQL database. 