#!/bin/bash

echo "🗑️  Stopping Supabase services..."
supabase stop

echo "🗑️  Starting fresh Supabase instance..."
supabase start

echo "🗑️  Wiping Prisma schema state..."
bun prisma migrate reset --force

echo "🔄 Regenerating types..."
bun prisma generate
supabase gen types typescript --local > types/supabase.ts

echo "✨ Database reset complete!" 