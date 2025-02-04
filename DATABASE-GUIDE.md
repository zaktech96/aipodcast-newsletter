# Database Guide

Everything you need to know about developing with the supbase postgres database locally, in production, and how to make changes to your database schema safely over time.

## Understanding Local vs Production

- **Local Database**: Think of this as your personal "sandbox" copy of the database that runs on your computer. (We use Docker to run the database locally.)
  - ✅ Safe to experiment with
  - ✅ Changes only affect your machine
  - ✅ Can be reset easily
  - ✅ Perfect for testing new features
  - ❌ Not accessible to real users

- **Production Database**: This is the "real" database that your live app uses. (We use Supabase's Postgres database in production.)
  - ✅ Used by real users
  - ✅ Contains real data
  - ❌ Changes affect everyone
  - ❌ Mistakes can be costly
  - ❌ Can't easily be reset

## Quickstart

Make sure you're in the root directory of the project, have the supabase CLI installed, and have the Docker Desktop App running.

```bash
supabase start    # Start your local database
supabase stop     # Stop when you're done
supabase status   # Check if everything's running (see the relevant URLs and secrets)
```

## Making Database Changes Safely

1. **Start Fresh**
```bash
cd main
git pull origin main    # Get latest code
supabase start          # Make sure your local database is running
```

2. **Create a new migration for your locally running database**
```bash
# Edit prisma/schema.prisma file to change database structure
# Then run:
npx prisma migrate dev --name what_changed
supabase gen types typescript --local > types/supabase.ts
```

1. **Push to the production database**
```bash
# Backup first
supabase db dump --project-ref YOUR_REF -f backup.sql

# Deploy
prisma migrate deploy
supabase gen types typescript --project-ref YOUR_REF > types/supabase.ts
```

## Common Problems & Solutions

### "I messed up my local changes!"
```bash
# Start fresh:
supabase db reset
npx prisma migrate reset --force
```

### "I made a bad migration!"
```bash
# Only for local (not production) fixes:
npx prisma migrate reset --force           # Reset database
# Delete the last file from prisma/migrations/
# Fix your schema.prisma file
npx prisma migrate dev --name fixed_issue  # Create new migration
```

Note: You can only 'reverse' migrations locally. Once pushed to prod, you will have to create a new migration to undo a bad schema change. That's why it's important to make small, reversible changes and test them in your locally running app before applying them to the production database.

### "Another dev made changes!"
```bash
cd main
git pull origin main     # Get their changes
supabase db reset        # Reset your database
npx prisma migrate dev   # Apply all migrations
```

## Best Practices

1. **Always test locally first**
2. **Make small, reversible changes**
3. **Backup before production changes**
4. **Use clear migration names** like:
   ```bash
   npx prisma migrate dev --name add_user_profile
   npx prisma migrate dev --name update_payment_fields
   ```

## Useful Commands

```bash
# View changes before 
supabase db diff

# Backup database
supabase db dump --local -f backup.sql                 # Local Database backup
supabase db dump --project-ref YOUR_REF -f backup.sql  # Production database backup

# Check status
supabase status
``` 