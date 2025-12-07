-- Cleanup Script: Wipe all data and start fresh
-- WARNING: This will delete ALL data from subscriptions and user_profiles tables
-- Run this if you want to start completely fresh

-- Step 1: Delete all subscriptions
DELETE FROM subscriptions;

-- Step 2: Delete all user profiles
DELETE FROM user_profiles;

-- Step 3: (Optional) Delete all auth users
-- WARNING: This will delete all users from auth.users table
-- Uncomment the line below ONLY if you want to delete all users too
-- DELETE FROM auth.users;

-- Step 4: Reset sequences (if any)
-- This ensures auto-incrementing IDs start from 1 again

-- Verify cleanup
SELECT 
  (SELECT COUNT(*) FROM subscriptions) as subscription_count,
  (SELECT COUNT(*) FROM user_profiles) as user_profile_count,
  (SELECT COUNT(*) FROM auth.users) as auth_user_count;

