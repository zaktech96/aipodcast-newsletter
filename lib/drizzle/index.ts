import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { SupabaseClient } from '@supabase/supabase-js';

let clientSingleton: ReturnType<typeof drizzle>;

// Direct database connection (for server-only operations)
export function createDirectClient() {
  if (!process.env.DIRECT_URL) {
    throw new Error('Missing DIRECT_URL environment variable');
  }

  if (!clientSingleton) {
    const client = postgres(process.env.DIRECT_URL);
    clientSingleton = drizzle(client);
  }

  return clientSingleton;
}

// Client-side Supabase + Drizzle client (respects RLS)
export function createClientDrizzle() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables'
    );
  }

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // When using with Supabase, we return the Supabase client directly
  // You'll use the Supabase query builder with Postgres syntax
  return supabase;
}

// Server-side Supabase + Drizzle client (can bypass RLS)
export async function createServerDrizzle() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Omit<ResponseCookie, 'name' | 'value'>) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: Omit<ResponseCookie, 'name' | 'value'>) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );

  // When using with Supabase, we return the Supabase client directly
  // You'll use the Supabase query builder with Postgres syntax
  return supabase;
}

/**
 * Usage:
 * 
 * Client Components ('use client'):
 * import { createClientDrizzle } from '@/lib/drizzle';
 * 
 * function MyComponent() {
 *   const supabase = createClientDrizzle();
 *   // Use supabase for database queries, auth, storage, etc.
 * }
 * 
 * Server Components (default) & API Routes:
 * import { createServerDrizzle } from '@/lib/drizzle';
 * 
 * async function MyServerComponent() {
 *   const supabase = await createServerDrizzle();
 *   // Use supabase for database queries, auth, storage, etc.
 * }
 * 
 * Server Actions with Direct DB Access:
 * import { createDirectClient } from '@/lib/drizzle';
 * import { users } from '@/db/schema';
 * 
 * export async function myServerAction() {
 *   const db = createDirectClient();
 *   // Use db for database operations that bypass RLS
 *   const allUsers = await db.select().from(users);
 * }
 */ 