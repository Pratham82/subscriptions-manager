import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

// Log for debugging
if (__DEV__) {
  console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
  console.log('Supabase Key:', supabaseAnonKey ? 'Found' : 'Missing');
}

let supabase: SupabaseClient;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  } else {
    console.warn(
      'Missing Supabase environment variables. App will work but Supabase features will be disabled.',
    );
    // Create a mock client that will fail gracefully
    supabase = {
      from: () => ({
        select: () =>
          Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
        insert: () =>
          Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () =>
                Promise.resolve({
                  data: null,
                  error: new Error('Supabase not configured'),
                }),
            }),
          }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        }),
      }),
    } as unknown as SupabaseClient;
  }
} catch (error) {
  console.error('Error initializing Supabase:', error);
  // Create a mock client as fallback
  supabase = {
    from: () => ({
      select: () =>
        Promise.resolve({ data: [], error: new Error('Supabase initialization failed') }),
      insert: () =>
        Promise.resolve({
          data: null,
          error: new Error('Supabase initialization failed'),
        }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: null,
                error: new Error('Supabase initialization failed'),
              }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: new Error('Supabase initialization failed') }),
      }),
    }),
  } as unknown as SupabaseClient;
}

export { supabase };
