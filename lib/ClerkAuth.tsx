// Clerk Auth Provider wrapper for Expo
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  console.warn('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set');
}

// Token cache for React Native
const tokenCache = {
  async getToken(key: string) {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (err) {
      console.error('Error saving token:', err);
    }
  },
};

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  if (!clerkPublishableKey) {
    console.error(
      'Clerk publishable key is missing. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file',
    );
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      {children}
    </ClerkProvider>
  );
}
