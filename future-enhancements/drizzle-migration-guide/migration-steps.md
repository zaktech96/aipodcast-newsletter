# Step-by-Step Migration Timeline

This guide provides a practical, phased approach to migrate from Prisma to Drizzle while minimizing disruption to your application.

## Phase 1: Preparation & Setup (Estimated: 1-2 days)

### Day 1: Install Dependencies & Setup Drizzle

1. **Install Drizzle dependencies**
   ```bash
   pnpm add drizzle-orm pg
   pnpm add -D drizzle-kit @types/pg postgres
   ```

2. **Create Drizzle configuration**
   ```bash
   # Create drizzle.config.ts in project root
   touch drizzle.config.ts
   ```
   
   Add the following configuration:
   ```typescript
   import type { Config } from 'drizzle-kit';
   
   export default {
     schema: './drizzle/schema.ts',
     out: './drizzle/migrations',
     driver: 'pg',
     dbCredentials: {
       connectionString: process.env.DATABASE_URL as string,
     },
   } satisfies Config;
   ```

3. **Update package.json with Drizzle scripts**
   ```json
   "scripts": {
     // ... existing scripts
     "drizzle:generate": "drizzle-kit generate:pg",
     "drizzle:push": "drizzle-kit push:pg",
     "drizzle:studio": "drizzle-kit studio"
   }
   ```

### Day 2: Schema Creation

1. **Create Drizzle schema directory**
   ```bash
   mkdir -p drizzle
   touch drizzle/schema.ts
   ```

2. **Convert Prisma schema to Drizzle schema**
   - Copy your Prisma models from `prisma/schema.prisma`
   - Convert them to Drizzle's schema format in `drizzle/schema.ts`
   
3. **Create the DB client**
   ```bash
   mkdir -p lib/db
   touch lib/db/index.ts
   ```
   
   Set up the Drizzle client:
   ```typescript
   // lib/db/index.ts
   import { drizzle } from 'drizzle-orm/node-postgres';
   import { Pool } from 'pg';
   import * as schema from '@/drizzle/schema';
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
   });
   
   export const db = drizzle(pool, { schema });
   ```

## Phase 2: Incremental Migration (Estimated: 2-5 days)

### Day 3-4: Create Parallel Implementation

1. **Choose a single data model to migrate first**
   - Start with a simple, less critical model (e.g., `subscriptionPlans`)
   - Create Drizzle queries for this model while keeping Prisma working

2. **Create a parallel implementation for selected model**
   ```typescript
   // Example: app/api/subscription-plans/drizzle.ts
   import { db } from '@/lib/db';
   import { subscriptionPlans } from '@/drizzle/schema';
   
   export async function getSubscriptionPlans() {
     return await db.select().from(subscriptionPlans);
   }
   ```

3. **Add a feature flag in your configuration**
   ```typescript
   // config.ts
   export default {
     // ... existing config
     database: {
       useNewOrm: process.env.USE_DRIZZLE === 'true',
     },
   };
   ```

4. **Add conditional logic to use either ORM**
   ```typescript
   // app/api/subscription-plans/route.ts
   import config from '@/config';
   import * as prismaQueries from './prisma';
   import * as drizzleQueries from './drizzle';
   
   export async function GET() {
     try {
       const plans = config.database.useNewOrm
         ? await drizzleQueries.getSubscriptionPlans()
         : await prismaQueries.getSubscriptionPlans();
       
       return Response.json({ plans });
     } catch (error) {
       return Response.json({ error: 'Failed to fetch plans' }, { status: 500 });
     }
   }
   ```

### Day 5-7: Expand & Test

1. **Expand to more complex models**
   - Add more models to your Drizzle implementation
   - Focus on models with relationships next

2. **Create test cases**
   ```typescript
   // tests/drizzle-migration.test.ts
   import { expect, test } from 'vitest';
   import * as prismaQueries from '../app/api/users/prisma';
   import * as drizzleQueries from '../app/api/users/drizzle';
   
   test('Drizzle and Prisma return same user count', async () => {
     const prismaUsers = await prismaQueries.getAllUsers();
     const drizzleUsers = await drizzleQueries.getAllUsers();
     
     expect(drizzleUsers.length).toBe(prismaUsers.length);
   });
   ```

3. **Run parallel implementations in development/staging**
   - Set `USE_DRIZZLE=true` in your `.env.development` file
   - Test thoroughly to ensure data consistency

## Phase 3: Cutover & Cleanup (Estimated: 1-2 days)

### Day 8: Final Migration

1. **Remove conditional logic**
   - Once you're confident in your Drizzle implementation, remove the conditional logic
   - Update all imports to use the Drizzle implementations

2. **Update environment variables**
   - Set `USE_DRIZZLE=true` in production

3. **Deploy the changes**
   ```bash
   git commit -m "Migrate from Prisma to Drizzle"
   git push origin main
   ```

### Day 9: Cleanup

1. **Remove Prisma dependencies**
   ```bash
   pnpm remove prisma @prisma/client
   ```

2. **Remove Prisma-specific files**
   ```bash
   rm -rf prisma
   ```

3. **Remove feature flags and old implementations**
   - Delete the `useNewOrm` flag from your config
   - Remove the old Prisma implementation files

4. **Update CI/CD pipeline**
   - Remove Prisma-specific steps
   - Add Drizzle migration steps

## Phase 4: Optimization (Ongoing)

1. **Optimize Drizzle queries**
   - Review query performance
   - Add indexes where needed
   - Implement prepared statements for frequently-used queries

2. **Leverage Drizzle-specific features**
   - Implement relations
   - Use SQL functions for complex operations
   - Explore Postgres-specific features

3. **Monitor performance**
   - Track query performance in production
   - Compare with previous Prisma metrics
   - Make adjustments as needed

## Rollback Plan

In case issues arise, have a rollback strategy ready:

1. **Keep Prisma code for 1-2 deployment cycles**
   - Don't delete Prisma files immediately
   - Maintain the conditional logic for quick fallback

2. **Prepare rollback commands**
   ```bash
   # Quick rollback script
   echo "export const USE_DRIZZLE=false" > .env.production.local
   git checkout -- prisma/
   pnpm add prisma @prisma/client
   ```

3. **Create a rollback feature flag**
   - Have an emergency feature flag that can be toggled without redeployment

## Conclusion

This migration approach allows you to:

1. Incrementally migrate from Prisma to Drizzle
2. Test in parallel to ensure data consistency
3. Quickly rollback if issues arise
4. Optimize once the migration is complete

The timeline is flexible and can be adjusted based on the size and complexity of your application. 