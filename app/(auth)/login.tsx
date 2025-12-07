import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOAuth, useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';

import { useAuthStore } from '@/store/authStore';
import { syncClerkUserToSupabase } from '@/lib/clerk-supabase-sync';
import { Logo } from '@/components/Logo';
import { GoogleIcon } from '@/components/GoogleIcon';

export default function LoginScreen() {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { setClerkUser, isLoading, clerkUserId } = useAuthStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const hasSyncedRef = useRef(false);

  // Sync Clerk user to Supabase when signed in (only once)
  useEffect(() => {
    if (isSignedIn && user && !hasSyncedRef.current && !clerkUserId) {
      hasSyncedRef.current = true;
      const syncUser = async () => {
        try {
          // Sync user to Supabase first
          await syncClerkUserToSupabase(
            user.id,
            user.primaryEmailAddress?.emailAddress || '',
            user.fullName || undefined,
            user.imageUrl || undefined,
          );

          // Then set in auth store
          await setClerkUser(user.id);

          // Small delay to ensure state is updated
          await new Promise(resolve => setTimeout(resolve, 100));

          toast.success('Signed in successfully');
          router.replace('/(tabs)');
        } catch (error) {
          console.error('Error syncing user:', error);
          hasSyncedRef.current = false; // Reset on error so it can retry
          toast.error('Failed to sync user data', {
            description: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      };
      syncUser();
    }
  }, [isSignedIn, user, setClerkUser, router, clerkUserId]);

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        // The useEffect will handle syncing to Supabase
      }
    } catch (err: any) {
      console.error('OAuth error', err);
      if (err.errors) {
        err.errors.forEach((error: any) => {
          toast.error(error.message || 'Sign in failed');
        });
      } else {
        toast.error('Failed to sign in with Google');
      }
    }
  };

  return (
    <LinearGradient
      colors={['#0a0a0f', '#1a1a2e', '#2d1b4e']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo size={140} color="#6b46c1" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Subscription Manager</Text>
        <Text style={styles.subtitle}>
          Track and manage all your subscriptions in one place
        </Text>
      </View>

      {/* Bottom section with button and info */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom }]}>
        {/* Sign in button */}
        <Pressable
          style={[styles.googleButton, isLoading && styles.buttonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <>
              <View style={styles.googleIconContainer}>
                <GoogleIcon size={20} />
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </Pressable>

        {/* Info text */}
        <Text style={styles.infoText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingTop: 20,
    width: '100%',
  },
  logoContainer: {
    marginBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  googleIconContainer: {
    marginRight: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});
