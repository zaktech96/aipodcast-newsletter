# Drizzle ORM + Supabase in Titan

This guide provides best practices and patterns for using Drizzle ORM with Supabase in the Titan codebase.

## Database Access Patterns

There are three primary ways to access the database in this project:

### 1. Direct Drizzle ORM Access (Server-Side) - PREFERRED

```typescript
import { createDirectClient } from '@/lib/drizzle';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

export async function myServerAction() {
  const db = createDirectClient();
  
  // Use Drizzle ORM's query builder
  const user = await db.select()
    .from(users)
    .where(eq(users.userId, 'some-id'));
  
  return user[0];
}
```

This approach:
- Bypasses Row Level Security (RLS) entirely
- Provides full TypeScript safety with the Drizzle ORM
- Is optimal for server-side operations (server components, server actions)
- Works with all Drizzle ORM features

### 2. Server-Side Supabase Client (with Auth Context)

```typescript
import { createServerClient } from '@/lib/drizzle';

export async function myServerAction() {
  const supabase = await createServerClient();
  
  // Use Supabase query builder
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', 'some-id');
  
  return data?.[0];
}
```

This approach:
- Respects Row Level Security (RLS) policies with auth context
- Uses Supabase query builder (not Drizzle ORM)
- Handles auth cookies automatically
- Is good for operations that should respect permissions

### 3. Client-Side Supabase Client

```typescript
'use client';
import { createClient } from '@/lib/drizzle';

export function MyComponent() {
  const supabase = createClient();
  
  // Use Supabase query builder in client components
  async function fetchData() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', 'some-id');
    
    return data;
  }
  
  // ...
}
```

This approach:
- Respects Row Level Security (RLS) with the current user's session
- Uses Supabase query builder (not Drizzle ORM)
- Is meant for client components only

## Common Query Patterns

### Select Data

```typescript
// Using Drizzle ORM (server-side)
const user = await db.select()
  .from(users)
  .where(eq(users.userId, userId));

// With joins and filtering
const posts = await db.select({
  id: posts.id,
  title: posts.title,
  user: {
    id: users.id,
    name: users.firstName
  }
})
.from(posts)
.leftJoin(users, eq(posts.authorId, users.id))
.where(eq(posts.published, true))
.orderBy(desc(posts.createdAt))
.limit(10);
```

### Insert Data

```typescript
const newUser = await db.insert(users)
  .values({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe'
  })
  .returning();
```

### Update Data

```typescript
const updated = await db.update(users)
  .set({
    firstName: 'Jane',
    lastName: 'Smith'
  })
  .where(eq(users.id, userId))
  .returning();
```

### Delete Data

```typescript
const deleted = await db.delete(users)
  .where(eq(users.id, userId))
  .returning();
```

## Type Safety

Drizzle ORM provides excellent type safety:

```typescript
// Get the inferred types from your schema
type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;

// Use them in your functions
function processUser(user: User) {
  // TypeScript knows all the properties of User
  console.log(user.firstName);
}

function createNewUser(userData: Omit<NewUser, 'id'>) {
  // Type-safe function that accepts user data without an ID
  // ...
}
```

## Best Practices

1. **Always use the direct Drizzle client for server-side operations**
   - Prefer `createDirectClient()` for all server actions, API routes, and server components

2. **Use Supabase clients when RLS is needed**
   - If you need RLS policies to be applied, use the Supabase clients

3. **Organize your schema by domain**
   - Keep related tables in the same file under `db/schema/`
   - Export all tables from `db/schema/index.ts`

4. **Use transaction for related operations**
   ```typescript
   await db.transaction(async (tx) => {
     const user = await tx.insert(users).values(...).returning();
     await tx.insert(profiles).values({ userId: user[0].id, ... });
   });
   ```

5. **Add indexes for frequently queried columns**
   ```typescript
   export const users = pgTable(
     'users',
     {
       // columns
     },
     (table) => {
       return {
         emailIdx: index('email_idx').on(table.email),
       }
     }
   );
   ```

6. **Use relations for better type safety**
   ```typescript
   export const posts = pgTable('posts', {
     authorId: integer('author_id').references(() => users.id),
   });
   ```

7. **Let Drizzle handle migrations**
   - Use `npx drizzle-kit generate` to create migrations
   - Use `npx drizzle-kit push` during development

## Further Reading

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle + Supabase Tutorial](https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase)
- [Supabase Documentation](https://supabase.com/docs) 