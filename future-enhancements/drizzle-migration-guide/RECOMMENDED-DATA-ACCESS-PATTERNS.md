# Recommended Data Access Patterns with Drizzle and Supabase

This document outlines the recommended patterns for accessing data in your Next.js application using Drizzle ORM, Supabase, and React Query.

## When to Use Each Pattern

| Pattern | When to Use | Benefits |
|---------|-------------|----------|
| **Direct Drizzle in Server Actions** | • Database operations in server components<br>• Server actions (form submissions, etc.)<br>• When you need maximum type safety | • Full TypeScript safety<br>• Direct DB access (bypasses RLS)<br>• Best performance |
| **Supabase Client** | • Client-side operations<br>• When you need RLS security<br>• When working with auth/storage | • Respects RLS policies<br>• Easy authentication<br>• Simple API |
| **React Query + Server Actions** | • When client UI needs server data<br>• For caching, background refetching<br>• When loading states matter | • Client-side caching<br>• Automatic loading/error states<br>• Optimistic updates |

## Core Database Access Patterns

### 1. Direct Drizzle in Server Actions (Preferred for Server-Side)

```typescript
// utils/actions/users.ts
'use server';

import { createDirectClient } from '@/lib/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserById(id: string) {
  const db = createDirectClient();
  const user = await db.select()
    .from(users)
    .where(eq(users.userId, id));
  
  return user[0] || null;
}
```

### 2. Supabase Client for Client-Side Access

```typescript
// In client components ('use client')
import { createClient } from '@/lib/drizzle';

export function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data } = await supabase.from('users').select('*').eq('id', userId);
      setUser(data?.[0]);
    }
    fetchUser();
  }, [userId]);
}
```

### 3. React Query with Server Actions (Recommended for UI)

```typescript
// 1. Server action with Drizzle
'use server';
export async function getUsers() {
  const db = createDirectClient();
  return db.select().from(users);
}

// 2. React Query hook
'use client';
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });
}

// 3. React component
'use client';
function UsersList() {
  const { data, isLoading } = useUsers();
  if (isLoading) return <div>Loading...</div>;
  return <ul>{data.map(user => <li>{user.name}</li>)}</ul>;
}
```

## React Query Setup

```bash
bun add @tanstack/react-query @tanstack/react-query-devtools
```

Configure in your app:

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## Decision Tree: Which Pattern to Use

1. **Is this operation on the server (server component or server action)?**
   - **Yes**: Use Direct Drizzle for maximum type safety and performance
   - **No**: Go to step 2

2. **Does this operation need to be displayed in the UI with loading states?**
   - **Yes**: Use React Query with Server Actions
   - **No**: Go to step 3

3. **Is this a client-side-only operation or needs RLS?**
   - **Yes**: Use Supabase Client directly
   - **No**: Use Direct Drizzle in a server action

## Example: Complete User Management

```typescript
// 1. Server Actions (utils/actions/users.ts)
'use server';

import { createDirectClient } from '@/lib/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserById(id: string) {
  const db = createDirectClient();
  const result = await db.select()
    .from(users)
    .where(eq(users.userId, id));
  return result[0] || null;
}

export async function updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
  const db = createDirectClient();
  const updated = await db.update(users)
    .set(data)
    .where(eq(users.userId, id))
    .returning();
  return updated[0];
}

// 2. React Query hooks (utils/hooks/useUser.ts)
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserById, updateUser } from '@/utils/actions/users';

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', data.userId] });
    },
  });
}

// 3. Component using the hooks
'use client';

function UserProfile({ userId }) {
  const { data: user, isLoading } = useUser(userId);
  const updateUserMutation = useUpdateUser();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <button 
        onClick={() => updateUserMutation.mutate({
          id: userId,
          data: { lastSeen: new Date() }
        })}
      >
        Update Last Seen
      </button>
    </div>
  );
} 
- Great developer and user experience 