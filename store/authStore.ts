import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner-native';

import { supabase } from '@/lib/supabase/client';
import {
  getCurrentUserProfile,
  signOut as signOutUser,
} from '@/lib/supabase/user-queries';
import { UserProfile } from '@/types/user';

interface AuthStore {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  profile: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    set({ isLoading: true });

    try {
      // Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch user profile
        const profile = await getCurrentUserProfile();
        set({
          user: session.user,
          profile,
          isInitialized: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          profile: null,
          isInitialized: true,
          isLoading: false,
        });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await getCurrentUserProfile();
          set({ user: session.user, profile, isLoading: false });
          toast.success('Signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, profile: null });
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          set({ user: session.user });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        user: null,
        profile: null,
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  // signInWithGoogle: async () => {
  //   set({ isLoading: true });

  //   try {
  //     // Get OAuth URL from Supabase
  //     const oauthData = await signInWithGoogle();
  //     const authUrl = oauthData.url;

  //     if (!authUrl) {
  //       set({ isLoading: false });
  //       toast.error('Failed to get OAuth URL', {
  //         description: 'Please check Supabase configuration',
  //       });
  //       return;
  //     }

  //     // Use AuthSession to handle the OAuth flow
  //     const { makeRedirectUri } = await import('expo-auth-session');
  //     const { openAuthSessionAsync } = await import('expo-web-browser');

  //     const redirectUri = makeRedirectUri({
  //       scheme: 'subscriptionmanager',
  //       path: 'auth/callback',
  //     });

  //     console.log('Opening OAuth with redirect URI:', redirectUri);
  //     console.log('Auth URL:', authUrl);

  //     // Open the OAuth session - this will redirect back to our app scheme
  //     const result = await openAuthSessionAsync(authUrl, redirectUri);

  //     if (result.type === 'success' && result.url) {
  //       // Parse the callback URL
  //       const callbackUrl = new URL(result.url);

  //       // Try to get authorization code first (PKCE flow)
  //       const code = callbackUrl.searchParams.get('code');

  //       if (code) {
  //         // Exchange code for session
  //         const { data: sessionData, error: sessionError } =
  //           await supabase.auth.exchangeCodeForSession(code);

  //         if (sessionError) {
  //           console.error('Session exchange error:', sessionError);
  //           set({ isLoading: false });
  //           toast.error('Failed to exchange code for session', {
  //             description: sessionError.message,
  //           });
  //           return;
  //         }

  //         if (sessionData.user) {
  //           const profile = await getCurrentUserProfile();
  //           set({
  //             user: sessionData.user,
  //             profile,
  //             isLoading: false,
  //           });
  //           toast.success('Signed in successfully');
  //         } else {
  //           set({ isLoading: false });
  //           toast.error('Failed to complete sign in');
  //         }
  //       } else {
  //         // Fallback: Try to extract tokens directly from URL
  //         const accessToken = callbackUrl.searchParams.get('access_token');
  //         const refreshToken = callbackUrl.searchParams.get('refresh_token');

  //         if (accessToken && refreshToken) {
  //           const { data: sessionData, error: sessionError } =
  //             await supabase.auth.setSession({
  //               access_token: accessToken,
  //               refresh_token: refreshToken,
  //             });

  //           if (sessionError) {
  //             console.error('Session error:', sessionError);
  //             set({ isLoading: false });
  //             toast.error('Failed to set session', {
  //               description: sessionError.message,
  //             });
  //             return;
  //           }

  //           if (sessionData.user) {
  //             const profile = await getCurrentUserProfile();
  //             set({
  //               user: sessionData.user,
  //               profile,
  //               isLoading: false,
  //             });
  //             toast.success('Signed in successfully');
  //           } else {
  //             set({ isLoading: false });
  //             toast.error('Failed to complete sign in');
  //           }
  //         } else {
  //           // Wait a bit and check if session was set via deep linking
  //           setTimeout(async () => {
  //             const {
  //               data: { session },
  //             } = await supabase.auth.getSession();

  //             if (session?.user) {
  //               const profile = await getCurrentUserProfile();
  //               set({
  //                 user: session.user,
  //                 profile,
  //                 isLoading: false,
  //               });
  //               toast.success('Signed in successfully');
  //             } else {
  //               set({ isLoading: false });
  //               toast.error('Failed to complete sign in');
  //             }
  //           }, 1500);
  //         }
  //       }
  //     } else if (result.type === 'cancel') {
  //       set({ isLoading: false });
  //       // User cancelled, don't show error
  //     } else {
  //       set({ isLoading: false });
  //       toast.error('Failed to sign in with Google');
  //     }
  //   } catch (error) {
  //     const message =
  //       error instanceof Error ? error.message : 'Failed to sign in with Google';
  //     set({ isLoading: false });
  //     toast.error('Sign in failed', {
  //       description: message,
  //     });
  //     console.error('Google sign-in error:', error);
  //   }
  // },

  signInWithGoogle: async () => {
    set({ isLoading: true });

    try {
      // Import and use the GoogleAuth utility
      const { signInWithGoogle: signInWithGoogleAuth } = await import('@/lib/GoogleAuth');

      await signInWithGoogleAuth();

      // Wait a moment for the session to be set via onAuthStateChange
      // Then fetch the updated session and profile
      setTimeout(async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const profile = await getCurrentUserProfile();
          set({
            user: session.user,
            profile,
            isLoading: false,
          });
          toast.success('Signed in successfully');
        } else {
          set({ isLoading: false });
          toast.error('Failed to complete sign in');
        }
      }, 500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to sign in with Google';
      console.error('Google sign-in error:', error);
      toast.error('Sign in failed', {
        description: message,
      });
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });

    try {
      await signOutUser();
      set({
        user: null,
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
    try {
      const profile = await getCurrentUserProfile();
      set({ profile });
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  },
}));
