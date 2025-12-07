-- Safe version: Assigns existing subscriptions to a user instead of deleting
-- Use this if you want to keep your existing subscription data

-- Step 1: Get the first user ID (or replace with a specific user ID)
-- This will assign all null subscriptions to the first user in your auth.users table
DO $$
DECLARE
  first_user_id UUID;
BEGIN
  -- Get the first user ID
  SELECT id INTO first_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  
  IF first_user_id IS NOT NULL THEN
    -- Assign null subscriptions to this user
    UPDATE subscriptions 
    SET user_id = first_user_id 
    WHERE user_id IS NULL;
    
    RAISE NOTICE 'Assigned subscriptions to user: %', first_user_id;
  ELSE
    RAISE EXCEPTION 'No users found in auth.users. Please create a user first.';
  END IF;
END $$;

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
-- First, drop the development policy if it exists
DROP POLICY IF EXISTS "Allow all operations for development" ON subscriptions;

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

