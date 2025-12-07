-- Update subscriptions table to properly link to users
-- Run this AFTER creating the user_profiles table
-- This updates the existing subscriptions schema to enforce user relationships

-- Step 1: Clean up existing data
-- Delete all subscriptions (since we're starting fresh)
DELETE FROM subscriptions;

-- Alternative: If you want to assign null subscriptions to a specific user instead of deleting:
-- First, get a user ID: SELECT id FROM auth.users LIMIT 1;
-- Then uncomment and update the line below with that user ID:
-- UPDATE subscriptions SET user_id = 'YOUR_USER_ID_HERE' WHERE user_id IS NULL;

-- Step 2: Now make user_id required (safe since we've handled nulls)
ALTER TABLE subscriptions 
  ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'subscriptions_user_id_fkey'
  ) THEN
    ALTER TABLE subscriptions
      ADD CONSTRAINT subscriptions_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update RLS policies for subscriptions to be user-specific
-- Drop all existing policies if they exist (to allow re-running this script)
DROP POLICY IF EXISTS "Allow all operations for development" ON subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can delete own subscriptions" ON subscriptions;

-- Create user-specific RLS policies
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own subscriptions
CREATE POLICY "Users can delete own subscriptions" ON subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add index for user_id if it doesn't exist (should already exist from schema/subscriptions-schema.sql)
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

