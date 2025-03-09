-- Enable RLS on tables
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscriptions_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (to allow idempotent application)
--- ALWAYS ADD A ROW TO THIS BLOCK WEHN CREATING NEW POLICIES
DROP POLICY IF EXISTS "Users can view their own data" ON "user";
DROP POLICY IF EXISTS "Users can update their own data" ON "user";
DROP POLICY IF EXISTS "Users can view their own payments" ON "payments";
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON "subscriptions";
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON "subscriptions_plans";
DROP POLICY IF EXISTS "Users can view their own invoices" ON "invoices";

-- Create policies for user table
CREATE POLICY "Users can view their own data" 
  ON "user" 
  FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own data" 
  ON "user" 
  FOR UPDATE 
  USING (auth.uid()::text = user_id);

-- Create policies for payments table
CREATE POLICY "Users can view their own payments" 
  ON "payments" 
  FOR SELECT 
  USING (auth.uid()::text = user_id);

-- Create policies for subscriptions table
CREATE POLICY "Users can view their own subscriptions" 
  ON "subscriptions" 
  FOR SELECT 
  USING (auth.uid()::text = user_id);

-- Allow public read access to subscription plans
CREATE POLICY "Anyone can view subscription plans" 
  ON "subscriptions_plans" 
  FOR SELECT 
  USING (true);

-- Create policies for invoices table
CREATE POLICY "Users can view their own invoices" 
  ON "invoices" 
  FOR SELECT 
  USING (auth.uid()::text = user_id); 