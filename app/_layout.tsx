import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Toaster } from 'sonner-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks';
import { CustomSplashScreen } from './splash';
import { ClerkAuthProvider } from '../lib/ClerkAuth';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useAuthStore } from '@/store/authStore';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { clerkUserId, setClerkUser } = useAuthStore();

  // Initialize Clerk user in store when signed in (only if not already set)
  // Note: The actual sync to Supabase happens in login.tsx
  useEffect(() => {
    if (isSignedIn && userLoaded && user && !clerkUserId) {
      // Only set the user ID in store, don't sync here
      // The sync happens in login.tsx to avoid duplicates
      setClerkUser(user.id);
    }
  }, [isSignedIn, userLoaded, user, clerkUserId, setClerkUser]);

  if (!isLoaded) return <Redirect href="/(auth)/loading" />;

  if (!isSignedIn) return <Redirect href="/(auth)/login" />;

  return <Redirect href="/(tabs)" />;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [splashVisible, setSplashVisible] = useState(true);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && !splashVisible) {
      SplashScreen.hideAsync();
    }
  }, [loaded, splashVisible]);

  const handleSplashFinish = () => {
    setSplashVisible(false);
    if (loaded) {
      SplashScreen.hideAsync();
    }
  };

  if (!loaded || splashVisible) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <ClerkAuthProvider>
      <RootLayoutNav />
    </ClerkAuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
          <RootNavigation />
          <Toaster position="top-center" />
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
