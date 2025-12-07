import { create } from 'zustand';
import { toast } from 'sonner-native';

import { getAuthenticatedSupabase } from '@/lib/supabase/clerk-client';
import { UserProfile } from '@/types/user';

interface AuthStore {
  clerkUserId: string | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setClerkUser: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>(set => ({
  clerkUserId: null,
  profile: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    set({ isLoading: true });
    set({ isInitialized: true, isLoading: false });
    // Clerk handles initialization, we just mark as ready
  },

  setClerkUser: async (userId: string) => {
    set({ isLoading: true, clerkUserId: userId });

    try {
      // Get Clerk user data (we'll need to pass this from the component)
      // For now, we'll fetch from Supabase after sync
      const supabase = getAuthenticatedSupabase();
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      set({
        profile: profile as UserProfile | null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error setting Clerk user:', error);
      set({ isLoading: false });
    }
  },

  signInWithGoogle: async () => {
    // This will be handled by Clerk's OAuth button
    // The actual sign-in happens in the login component
    set({ isLoading: true });
  },

  signOut: async () => {
    set({ isLoading: true });

    try {
      const { useAuth } = await import('@clerk/clerk-expo');
      // Note: signOut should be called from a component using useAuth hook
      // This is a placeholder - actual sign out happens in the component
      set({
        clerkUserId: null,
        profile: null,
        isLoading: false,
      });
      toast.success('Signed out successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign out';
      set({ isLoading: false });
      toast.error('Sign out failed', {
        description: message,
      });
      throw error;
    }
  },

  refreshProfile: async () => {
    const state = useAuthStore.getState();
    if (!state.clerkUserId) return;

    try {
      const supabase = getAuthenticatedSupabase();
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', state.clerkUserId)
        .single();

      if (error) {
        console.error('Error refreshing profile:', error);
        return;
      }

      set({ profile: profile as UserProfile });
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  },
}));
