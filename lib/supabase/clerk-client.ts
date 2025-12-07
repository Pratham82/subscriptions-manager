// Supabase client configured to work with Clerk
// Note: For now, we use the anon key and rely on RLS policies
// In production, you may want to configure Supabase to validate Clerk JWT tokens
import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

// Create Supabase client
let supabase: SupabaseClient;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Disable Supabase auth since we're using Clerk
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  } else {
    throw new Error('Supabase not configured');
  }
} catch (error) {
  console.error('Error initializing Supabase:', error);
  throw error;
}

/**
 * Get the Supabase client
 * Note: RLS is disabled for now - auth is handled in application layer
 * The queries filter by user_id directly
 */
export function getAuthenticatedSupabase() {
  return supabase;
}

export { supabase };
