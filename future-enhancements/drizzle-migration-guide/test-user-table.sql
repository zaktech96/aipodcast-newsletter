-- Create user table based on the Drizzle schema
CREATE TABLE IF NOT EXISTS "user" (
  "id" SERIAL PRIMARY KEY,
  "created_time" TIMESTAMP DEFAULT NOW(),
  "email" VARCHAR NOT NULL UNIQUE,
  "first_name" TEXT,
  "last_name" TEXT,
  "gender" TEXT,
  "profile_image_url" TEXT,
  "user_id" VARCHAR NOT NULL UNIQUE,
  "subscription" TEXT
); 