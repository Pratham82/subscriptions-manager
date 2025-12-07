import { supabase } from './client';
import { UserProfile, UserProfileInsert, UserProfileUpdate } from '@/types/user';

/**
 * Get the current authenticated user's profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No profile found, return null
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Get user profile by ID
 */
export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(
  userId: string,
  profile: UserProfileInsert,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(
      {
        id: userId,
        ...profile,
      },
      {
        onConflict: 'id',
      },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdate,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || email.split('@')[0],
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign in a user
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user !== null;
}

/**
 * Sign in with Google OAuth using Expo AuthSession
 * This is the recommended approach for React Native/Expo apps
 */
export async function signInWithGoogle() {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error(
      'Supabase URL is not configured. Please check your environment variables.',
    );
  }

  // Use the app scheme for deep linking
  // Format: your-app-scheme://auth/callback
  const { makeRedirectUri } = await import('expo-auth-session');
  const redirectTo = makeRedirectUri({
    scheme: 'subscriptionmanager',
    path: 'auth/callback',
  });

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true, // We'll handle the redirect with AuthSession
      },
    });

    if (error) {
      console.error('OAuth error:', error);
      throw error;
    }

    if (!data?.url) {
      const errorMessage =
        'Failed to get OAuth URL. Please ensure:\n1. Google provider is enabled in Supabase Dashboard\n2. Google OAuth credentials are configured\n3. Redirect URL is added to Supabase URL Configuration';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    return { url: data.url };
  } catch (error) {
    console.error('Error in signInWithGoogle:', error);
    throw error;
  }
}
