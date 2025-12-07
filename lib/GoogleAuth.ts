import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase/client';

WebBrowser.maybeCompleteAuthSession();

export const signInWithGoogle = async () => {
  try {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      throw new Error('Supabase URL is not configured');
    }

    // Use app scheme for deep linking back to the app
    // Hardcode the redirect URL to ensure it uses the app scheme, not localhost
    const redirectUrl = 'subscriptionmanager://auth/callback';

    console.log('Redirect URL:', redirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false, // Let Supabase handle the redirect
      },
    });

    if (error) throw error;

    if (!data?.url) {
      throw new Error('Failed to get OAuth URL');
    }

    // Open the browser for OAuth
    console.log('Opening OAuth URL:', data.url);
    const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    console.log('WebBrowser result type:', res.type);
    console.log('WebBrowser result:', JSON.stringify(res, null, 2));

    if (res.type === 'success' && res.url) {
      const { url } = res;
      console.log('Callback URL received:', url);

      // Try to parse tokens from URL hash fragment (Supabase sometimes returns tokens in hash)
      const urlParts = url.split('#');
      if (urlParts.length > 1) {
        const params = new URLSearchParams(urlParts[1]);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          console.log('Found tokens in URL hash');
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

          if (sessionError) {
            throw sessionError;
          }

          return sessionData;
        }
      }

      // Fallback: Try to get code from query params and exchange it
      // Handle both app scheme URLs and regular URLs
      let callbackUrl: URL;
      try {
        // If URL starts with app scheme, we need to handle it differently
        if (url.startsWith('subscriptionmanager://')) {
          // Replace the scheme with http:// for URL parsing
          const urlForParsing = url.replace('subscriptionmanager://', 'http://');
          callbackUrl = new URL(urlForParsing);
        } else {
          callbackUrl = new URL(url);
        }
      } catch (e) {
        console.error('Error parsing URL:', url, e);
        throw new Error(`Invalid callback URL: ${url}`);
      }

      const code = callbackUrl.searchParams.get('code');
      console.log('Extracted code from URL:', code ? 'Found' : 'Not found');

      if (code) {
        console.log('Found code in URL, exchanging for session');
        const { data: sessionData, error: sessionError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (sessionError) {
          throw sessionError;
        }

        return sessionData;
      }

      // Last fallback: Try to extract tokens from query params
      const accessToken = callbackUrl.searchParams.get('access_token');
      const refreshToken = callbackUrl.searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        console.log('Found tokens in query params');
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession(
          {
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        );

        if (sessionError) {
          throw sessionError;
        }

        return sessionData;
      }

      throw new Error('No tokens or code found in callback URL');
    } else if (res.type === 'cancel') {
      throw new Error('User cancelled sign in');
    } else if (res.type === 'dismiss') {
      // Browser was dismissed - check if session was set via deep link
      console.log('Browser dismissed, checking if session was set via deep link...');

      // Wait a moment for deep link to process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if we have a session now
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error getting session:', sessionError);
        throw new Error('Failed to get session after browser dismiss');
      }

      if (session) {
        console.log('Session found after browser dismiss - deep link worked!');
        return { session, user: session.user };
      } else {
        throw new Error('Browser was closed but no session was found. Please try again.');
      }
    } else {
      console.error('Unexpected WebBrowser result type:', res.type);
      throw new Error(`Failed to complete sign in: ${res.type}`);
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};
