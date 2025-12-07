// lib/GoogleAuth.ts - Proven working solution
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { supabase } from './supabase/client';

WebBrowser.maybeCompleteAuthSession();

export const signInWithGoogle = async () => {
  try {
    console.log('=== Starting Google Sign In ===');

    // Generate redirect URI
    // In development (Expo Go), this will be exp://localhost:8081/--/auth/callback
    // In production, this will be subscriptionmanager://auth/callback
    const redirectUrl = makeRedirectUri({
      scheme: 'subscriptionmanager',
      path: 'auth/callback',
    });

    console.log('=== DEBUG INFO ===');
    console.log('Generated Redirect URI:', redirectUrl);
    console.log('Full redirect URL:', JSON.stringify(redirectUrl));

    // Also try without explicit scheme to see what makeRedirectUri generates
    const altRedirectUrl = makeRedirectUri({
      path: 'auth/callback',
    });
    console.log('Alternative Redirect URI (no scheme):', altRedirectUrl);

    // Get the OAuth provider URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false, // Let Supabase handle the redirect
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('❌ OAuth error from Supabase:', error);
      console.error('Error message:', error.message);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    if (!data?.url) {
      console.error('❌ No OAuth URL returned from Supabase');
      throw new Error('No provider URL returned');
    }

    console.log('✓ OAuth URL received from Supabase');
    console.log('OAuth URL (first 100 chars):', data.url.substring(0, 100) + '...');

    // Check if redirectTo is in the URL
    if (data.url.includes('redirect_to=')) {
      const redirectMatch = data.url.match(/redirect_to=([^&]+)/);
      if (redirectMatch) {
        const decodedRedirect = decodeURIComponent(redirectMatch[1]);
        console.log('Redirect URL in OAuth URL:', decodedRedirect);
      }
    }

    console.log('Opening browser with URL...');

    // Open the auth session
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    console.log('Browser result:', result.type);

    if (result.type !== 'success') {
      if (result.type === 'cancel') {
        throw new Error('cancelled');
      }
      throw new Error(`Authentication failed: ${result.type}`);
    }

    console.log('Success! Processing callback...');

    // Extract the URL from the result
    const { url } = result;
    console.log('Callback URL:', url);

    // Parse URL to get the fragments
    // Handle custom scheme URLs (subscriptionmanager://, exp://, etc.)
    let parsedUrl: URL;
    try {
      if (url.startsWith('subscriptionmanager://') || url.startsWith('exp://')) {
        // Replace custom scheme with http:// for URL parsing
        const urlForParsing = url.replace(/^(subscriptionmanager|exp):\/\//, 'http://');
        parsedUrl = new URL(urlForParsing);
      } else {
        parsedUrl = new URL(url);
      }
    } catch (e) {
      console.error('Error parsing URL:', e);
      throw new Error('Invalid callback URL received');
    }

    const hashParams = new URLSearchParams(parsedUrl.hash.substring(1));

    const access_token = hashParams.get('access_token');
    const refresh_token = hashParams.get('refresh_token');

    if (!access_token || !refresh_token) {
      console.error('No tokens in callback URL');
      console.log('Hash:', parsedUrl.hash);
      console.log('Search:', parsedUrl.search);
      throw new Error('No tokens received from authentication');
    }

    console.log('Tokens received, setting session...');

    // Set the session with the tokens
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError) {
      console.error('Session error:', sessionError);
      throw sessionError;
    }

    console.log('✓ Successfully signed in!');
    console.log('User:', sessionData.session?.user?.email);

    return sessionData;
  } catch (error: any) {
    console.error('Sign in error:', error);

    // Don't throw error for user cancellation
    if (error.message === 'cancelled') {
      throw error;
    }

    throw new Error(error.message || 'Failed to sign in with Google');
  }
};
