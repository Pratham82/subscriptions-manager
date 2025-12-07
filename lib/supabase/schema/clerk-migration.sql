-- Migration: Update schema to support Clerk user IDs (TEXT instead of UUID)
-- Run this SQL in your Supabase SQL Editor

-- IMPORTANT: Drop all policies FIRST before altering column types
-- Policies depend on columns, so we must drop them first

-- 1. Drop all existing policies on user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- 2. Drop all existing policies on subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can delete own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Allow all operations for development" ON subscriptions;

-- 3. Now we can alter the column types
-- Update user_profiles table to use TEXT for id (Clerk user IDs)
-- Drop the foreign key constraint first
ALTER TABLE IF EXISTS user_profiles 
  DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Change id column from UUID to TEXT
ALTER TABLE IF EXISTS user_profiles 
  ALTER COLUMN id TYPE TEXT;

-- Remove the reference to auth.users since we're using Clerk
-- The id column will now store Clerk user IDs like: user_2bN4f89X123

-- 4. Update subscriptions table to use TEXT for user_id
-- Drop foreign key constraint
ALTER TABLE IF EXISTS subscriptions 
  DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;

-- Change user_id column from UUID to TEXT
ALTER TABLE IF EXISTS subscriptions 
  ALTER COLUMN user_id TYPE TEXT;

-- For now, we'll disable RLS and handle auth in the application layer
-- This is because we're filtering by user_id directly in queries
-- For production, you can enable RLS and configure Clerk JWT validation

-- Disable RLS temporarily (enable later with proper JWT setup)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;

-- Note: To enable RLS with Clerk JWT later:
-- 1. Configure Supabase to validate Clerk JWT tokens
-- 2. Create a function to extract user_id from JWT: clerk_user_id()
-- 3. Update policies to use: USING (clerk_user_id() = user_id)
-- 4. Re-enable RLS: ALTER TABLE ... ENABLE ROW LEVEL SECURITY;

-- Comments
COMMENT ON COLUMN user_profiles.id IS 'Clerk user ID (e.g., user_2bN4f89X123)';
COMMENT ON COLUMN subscriptions.user_id IS 'Clerk user ID (e.g., user_2bN4f89X123)';

