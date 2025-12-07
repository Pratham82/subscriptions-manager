// lib/GoogleAuth.ts - Mobile-optimized version
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

import { supabase } from './supabase/client';

WebBrowser.maybeCompleteAuthSession();

export const signInWithGoogle = async () => {
  try {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      throw new Error('Supabase URL is not configured');
    }

    console.log('=== Starting Google Sign In ===');

    // Create a custom redirect URL using Expo's linking
    // This ensures the callback comes back to our app
    const redirectUrl = Linking.createURL('auth/callback');
    console.log('App redirect URL:', redirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('❌ OAuth initialization error:', error);
      throw error;
    }

    if (!data?.url) {
      throw new Error('Failed to get OAuth URL from Supabase');
    }

    console.log('✓ OAuth URL generated');
    console.log('Opening browser...');

    // Open browser and wait for callback
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    console.log('=== Browser Closed ===');
    console.log('Result type:', result.type);

    if (result.type === 'success' && result.url) {
      console.log('✓ Callback received');
      console.log('Callback URL:', result.url);

      // Parse the callback URL
      const url = result.url;
      let parsedUrl;

      try {
        // Handle custom scheme URLs
        if (url.startsWith('exp://') || url.startsWith('subscriptionmanager://')) {
          // Replace custom scheme with http for parsing
          const urlForParsing = url.replace(/^(exp|subscriptionmanager):\/\//, 'http://');
          parsedUrl = new URL(urlForParsing);
        } else {
          parsedUrl = new URL(url);
        }
      } catch (e) {
        console.error('Error parsing URL:', e);
        throw new Error('Invalid callback URL received');
      }

      // Extract tokens from hash fragment (most common)
      const hashFragment = url.split('#')[1];
      if (hashFragment) {
        console.log('Checking hash fragment for tokens...');
        const hashParams = new URLSearchParams(hashFragment);

        const access_token = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');
        const error_description = hashParams.get('error_description');

        if (error_description) {
          console.error('OAuth error:', error_description);
          throw new Error(error_description);
        }

        if (access_token && refresh_token) {
          console.log('✓ Tokens found in hash!');

          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

          if (sessionError) {
            console.error('❌ Session error:', sessionError);
            throw sessionError;
          }

          console.log('✓ Session set successfully!');
          return sessionData;
        }
      }

      // Check query parameters for authorization code
      const code = parsedUrl.searchParams.get('code');
      const error_description = parsedUrl.searchParams.get('error_description');

      if (error_description) {
        console.error('OAuth error:', error_description);
        throw new Error(error_description);
      }

      if (code) {
        console.log('✓ Authorization code found');
        console.log('Exchanging code for session...');

        const { data: sessionData, error: sessionError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (sessionError) {
          console.error('❌ Code exchange error:', sessionError);
          throw sessionError;
        }

        console.log('✓ Session created!');
        return sessionData;
      }

      // Last attempt: check for tokens in query params
      const access_token = parsedUrl.searchParams.get('access_token');
      const refresh_token = parsedUrl.searchParams.get('refresh_token');

      if (access_token && refresh_token) {
        console.log('✓ Tokens found in query params');

        const { data: sessionData, error: sessionError } = await supabase.auth.setSession(
          {
            access_token,
            refresh_token,
          },
        );

        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          throw sessionError;
        }

        console.log('✓ Session set!');
        return sessionData;
      }

      console.error('❌ No tokens or code found');
      console.log('Full callback URL for debugging:', url);
      throw new Error('No authentication data received. Please try again.');
    }

    if (result.type === 'cancel') {
      console.log('User cancelled');
      throw new Error('cancelled');
    }

    if (result.type === 'dismiss') {
      console.log('Browser dismissed');

      // Give it a moment for session to be set via deep link
      await new Promise(resolve => setTimeout(resolve, 2000));

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        console.log('✓ Session found!');
        return { session, user: session.user };
      }

      throw new Error('dismiss');
    }

    throw new Error(`Unexpected result: ${result.type}`);
  } catch (error) {
    console.error('=== Sign In Error ===');
    console.error(error);
    throw error;
  }
};
