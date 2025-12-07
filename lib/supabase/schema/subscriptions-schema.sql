-- Subscription Manager Database Schema
-- Run this SQL in your Supabase SQL Editor to create the subscriptions table

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT '₹',
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('daily', 'weekly', 'monthly', 'yearly')),
  billing_cycle_quantity INTEGER NOT NULL DEFAULT 1,
  next_payment_date DATE NOT NULL,
  category TEXT NOT NULL,
  subscribed_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  billing_history JSONB DEFAULT '[]'::jsonb,
  price_history JSONB DEFAULT '[]'::jsonb,
  notification TEXT,
  payment_method TEXT,
  free_trial BOOLEAN DEFAULT false,
  list TEXT CHECK (list IN ('Personal', 'Business')),
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_is_active ON subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_payment_date ON subscriptions(next_payment_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_category ON subscriptions(category);

-- RLS Policies
-- Drop existing policy if it exists (to allow re-running this script)
DROP POLICY IF EXISTS "Allow all operations for development" ON subscriptions;

-- For development: Allow all operations (remove in production)
CREATE POLICY "Allow all operations for development" ON subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- For production with authentication (uncomment when ready):
-- CREATE POLICY "Users can view their own subscriptions" ON subscriptions
--   FOR SELECT USING (auth.uid() = user_id);
--
-- CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
--   FOR INSERT WITH CHECK (auth.uid() = user_id);
--
-- CREATE POLICY "Users can update their own subscriptions" ON subscriptions
--   FOR UPDATE USING (auth.uid() = user_id);
--
-- CREATE POLICY "Users can delete their own subscriptions" ON subscriptions
--   FOR DELETE USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON TABLE subscriptions IS 'Stores user subscription information';
COMMENT ON COLUMN subscriptions.billing_history IS 'JSON array of billing records: [{"date": "2025-01-01", "amount": 10.99}]';
COMMENT ON COLUMN subscriptions.price_history IS 'JSON array of price changes: [{"date": "2025-01-01", "price": 10.99}]';

