import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { SupabaseClient } from '@supabase/supabase-js';
import * as schema from '@/db/schema';

// Singleton instance for direct DB connection
let directClientSingleton: ReturnType<typeof drizzle>;

// Direct database connection (for server-only operations) - bypasses RLS
export function createDirectClient() {
  if (!process.env.DIRECT_URL) {
    throw new Error('Missing DIRECT_URL environment variable');
  }

  if (!directClientSingleton) {
    const client = postgres(process.env.DIRECT_URL);
    directClientSingleton = drizzle(client, { schema });
  }

  return directClientSingleton;
}

// Client-side Supabase client - respects RLS
export function createClient(): SupabaseClient {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables'
    );
  }

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return supabase;
}

// Server-side Supabase client - respects RLS with authentication context
export async function createServerClient(): Promise<SupabaseClient> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
    );
  }

  const cookieStore = await cookies();

  const supabase = createSupabaseServerClient(
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

  return supabase;
}

/**
 * Usage:
 * 
 * Direct Drizzle ORM Access (Server Components and Server Actions):
 * import { createDirectClient } from '@/lib/drizzle';
 * import { users } from '@/db/schema';
 * 
 * export async function myServerAction() {
 *   const db = createDirectClient();
 *   // Use db for database operations that bypass RLS
 *   const allUsers = await db.select().from(users);
 * }
 * 
 * Client Components ('use client') - still using Supabase client:
 * import { createClient } from '@/lib/drizzle';
 * 
 * function MyComponent() {
 *   const supabase = createClient();
 *   // Use supabase for database queries, auth, storage, etc.
 * }
 * 
 * Server Components (default) & API Routes - still using Supabase client:
 * import { createServerClient } from '@/lib/drizzle';
 * 
 * async function MyServerComponent() {
 *   const supabase = await createServerClient();
 *   // Use supabase for database queries, auth, storage, etc.
 * }
 */ 