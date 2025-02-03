# Titan

Easy-to-setup, fully-featured, and customizable NextJS Boilerplate.

NOTE: You'll only want to use this repo if you want to create an App idea that needs Authentication and you'll be charging users for it (Payments). Otherwise, it's overkill.

## Tech Stack

- [NextJS 15](https://nextjs.org/) - Full-Stack React framework
- [Supabase](https://supabase.com/) - Database
- [Clerk](https://clerk.com/) - Authentication
- [Stripe](https://stripe.com/) - Collect Payments
- [Plunk](https://useplunk.com/) - Send Emails
- [Umami](https://umami.is/) - Analytics
- [UserJot](https://userjot.com/) - User Feedback + Product Roadmap
- [Vercel](https://vercel.com/) - Deployments

> [!NOTE]
> - Video walkthrough coming soon...
> - Database interactions are handled through our database module (`lib/supabase`):
>   - Server-side: Use `createServerActionClient()` which uses `SUPABASE_SERVICE_ROLE_KEY`
>   - Client-side: Use `createClient()` which uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Database Module Usage

```typescript
// Server-side (in server actions, API routes)
import { createServerActionClient } from '@/lib/supabase'

const supabase = await createServerActionClient()
const { data, error } = await supabase.from('table').select()

// Client-side (in React components)
import { createClient } from '@/lib/supabase'

const supabase = createClient()
const { data, error } = await supabase.from('table').select()
```

## 1. Prerequisites

Some React + NextJS knowledge is assumed (just the basics is sufficient to get started).

1. Install Node.js:
   - **Windows**: Download and install 64-bit version from [nodejs.org](https://nodejs.org/) (LTS version 22)
   - **Mac/Linux**: Install via [nvm](https://github.com/nvm-sh/nvm):
     ```bash
     nvm install 22 --lts
     ```

   Verify Node.js is installed:
   ```bash
   node -v
   ```
   Should return something like `v22.x.y`

2. Install latest version of pnpm:
   ```bash
   curl -fsSL https://get.pnpm.io/install.sh | sh -
   ```
   Verify pnpm is installed:
   ```bash
   pnpm -v
   ```
   Should return something like `10.x.y`

3. Create a new empty GitHub repository for your project

Have the SSH repository URL ready (e.g., `git@github.com:username/repo-name.git`)

Make sure it's the SSH URL, not the HTTPS URL!

4. In order to run a local Supabase instance, you'll need to install Docker/Orbstack (depending on your OS):
   - **Windows**: Install [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - **Mac**: Install [Docker Desktop](https://docs.docker.com/desktop/install/mac-install/) or [Orbstack](https://orbstack.dev/download)

5. Install the Supabase CLI to interact with Supabase:
   - **Windows**: Install via [scoop](https://scoop.sh/):
     ```powershell
     # Install scoop first if you haven't:
     Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
     irm get.scoop.sh | iex
     # Then install Supabase CLI (64-bit):
     scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
     scoop install supabase
     ```
   - **Mac**: Install via Homebrew:
     ```bash
     brew install supabase/tap/supabase
     ```

6. Gather your Development API keys from the following services:

   - **Clerk** (Authentication)
     - Create account at [Clerk](https://clerk.com)
     - Create a new Application (It will create a Development app by default)
     - Copy your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from the 'API Keys' section

   - **Stripe** (Payments)
     - Create account at [Stripe](https://stripe.com)
     - Make sure you're in test mode (toggle at the top right)
     - Copy your `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` from the 'API Keys' section
     - Create a product and get your `NEXT_PUBLIC_STRIPE_PRICE_ID`

   - **Plunk** (Email)
     - Create account at [Plunk](https://useplunk.com) (We don't care about the environment)
     - Copy your `PLUNK_API_KEY` from Project Settings > API Keys
     - Connect the domain you bought earlier (Project Settings -> Verified Domain)

## 2. Setup via CLI

1. Make sure Docker Desktop / Orbstack is running

2. Using your previous saved info (github repo URL and API keys), create your project locally by running:
   ```bash
   pnpm dlx @codeandcreed/create-titan@latest
   ```

3. Follow the prompts to configure your project. The CLI will:
   1. Clone the project template
   2. Initialize a local Supabase instance
   3. Start the database (this might take a few minutes on first run)
   4. Create all required database tables
   5. Generate TypeScript types for your database schema
   6. Configure your environment variables

Done! Your project will be:
- Pushed to your GitHub repo ✅
- Your local Supabase instance should now be running ✅
- You're ready for local development ✅

You can access your local Supabase Studio at http://127.0.0.1:54323 to:
- View your database tables
- Run SQL queries
- Manage your data

## 3. Developing your app locally

### Setup ngrok

1. Install ngrok:
   - **Windows**: Download from [ngrok.com](https://ngrok.com/download) or install via scoop: `scoop install ngrok`
   - **Mac**: Install via Homebrew: `brew install ngrok`
2. Run `ngrok http http://localhost:3000`
3. Copy the ngrok URL.
4. Update the FRONTEND_URL environment variable in your `.env` file to the ngrok URL.

### Setup Clerk Webhook to Save Users to your Database
1. Create a webhook in your Clerk 'Development' Application
2. Set the webhook URL to `[your-ngrok-url]/api/webhooks/clerk`
3. Set the events to `user.created` and `user.updated`

### Setup Stripe Webhook to Test Payments

1. Install the Stripe CLI:
   - **Windows**: Download 64-bit version from [Stripe CLI releases](https://github.com/stripe/stripe-cli/releases/latest) or install via scoop: `scoop install stripe`
   - **Mac**: Install via Homebrew: `brew install stripe/stripe-cli/stripe`
2. Run `stripe login`
3. Run `stripe listen --forward-to [your-ngrok-url]/api/payments/webhook`
4. Done. Your site should now be able to receive webhooks from Stripe and you can test the payment flow locally.

## Database Migrations

For detailed instructions on working with database migrations, schema changes, and Supabase CLI commands, see our [Database Operations Guide](docs/DATABASE.md).

## 4. Updating the UI

When you initally clone the project, the UI is a basic UI for Titan itself.

But it's upto you to rip everything out and replace with your own designs. Likewise for the Dashboard.

The following guides will help you customise the entire application UI to your liking:

- [Landing Page Design](https://blueprint.codeandcreed.tech/product-development/landing-page)
- [Rapid UI Prototyping](https://blueprint.codeandcreed.tech/product-development/rapid-ui-prototyping)

Use Cursor to guide you efficiently through the process, add new features, fix bugs etc. See [Efficency](https://blueprint.codeandcreed.tech/product-development/efficiency)

## 5. Recommendations

> - When adding client-side database interactions, make sure to use `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead of `SUPABASE_SERVICE_ROLE_KEY`. The service role key should only be used in server-side components.

## 6. Deploying the App to Production

1. Create a new repository on Github
2. Push all your changes to the new repository
3. Setup your production database:
     - Create account at Supabase
     - Create a new project
     - Note: When creating your database password, avoid special characters like '#' and '&' as they cause URL encoding issues
     - Copy your database password and keep it safe (ideally in a password manager)
     - Copy your `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from the 'Connect' modal on the main Project Dashboard page (click on the 'Connect' button) and then go to the 'App Frameworks' tab
     - Copy your `DATABASE_URL` and `DIRECT_URL` from the same 'Connect' modal under the 'ORMs' tab (without the quotations)
     - You'll use these as the env vars when deploying to Vercel
     - **IMPORTANT**: Enable Row Level Security (RLS) for all your tables in Supabase
     - Apply your local migrations to production safely:
       ```bash
       # Link to your production project
       supabase link --project-ref your-project-ref
       
       # First, backup your production database (safety first!)
       supabase db dump --project-ref your-project-ref -f prod_backup.sql
       
       # Check what changes will be applied (review this carefully!)
       prisma migrate diff \
         --from-empty \
         --to-schema-datamodel prisma/schema.prisma \
         --shadow-database-url "$DATABASE_URL"

       # If the changes look good, deploy migrations
       # This will preserve existing data while applying schema changes
       prisma migrate deploy
       ```
       > [!IMPORTANT]
       > Always review the migration diff before applying to production. This ensures you understand what changes will be made and that they won't affect existing data.
4. Create a Production Instance of your Clerk Application
   1. Copy your Production API Keys
   2. Copy your Production Webhook URL (Setup exactly as you did for the test mode)
   3. Follow the Clerk docs to setup Google Auth and connect your domain
5. Untoggle the test mode on your Stripe account (to use your production Stripe account)
   1. Create a new product in your production Stripe account (or copy over your test mode product)
   2. Copy your Production API Keys (PUBLIC and SECRET)
   3. Copy your Production Price ID
6. Set all your environment variables in Vercel
7. Deploy your site to Vercel with all the above Production Environment Variables

Done. Your site is now live and ready to use. Users can now sign up, login, and pay for your product.

## 5. Setup Analytics

Track your site visitors and get insights on how they interact with your site.

1. Create an account at [Umami](https://umami.is/)
2. Copy the Tracking code and paste it into the head of your `index.html` file
3. Deploy your site
4. Done. Real-time traffic data should now be being tracked.

## 6. Gather User Feedback

1. Create an account at [UserJot](https://userjot.com/)
2. Create a new Workspace for the app
3. Done. Go to 'My Board' to see your public feedback/roadmap board.

## Learn More

Refer to the documentation of the individual technologies:
- [Database Operations Guide](docs/DATABASE.md) - Comprehensive guide for Supabase CLI and database operations
- [NextJS Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.dev/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Plunk Documentation](https://docs.useplunk.com/)

## Contributing

Any beneficial contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Common issues

- If you have issues installing 3rd party components with 21.dev, try first running:
```bash
ln -s tailwind.config.ts tailwind.config.js
```

## ToDos

- Implement stronger security rules with ArcJet (Bot detection, Rate limiting, Data Redaction, Email Validation, Application-level DDoS protection, etc.) - https://docs.arcjet.com/get-started?f=next-js
