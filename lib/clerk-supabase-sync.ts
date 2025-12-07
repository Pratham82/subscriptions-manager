// Sync Clerk user to Supabase user_profiles table
import { getAuthenticatedSupabase } from './supabase/clerk-client';
import { UserProfile } from '@/types/user';

export async function syncClerkUserToSupabase(
  clerkUserId: string,
  email: string,
  fullName?: string,
  avatarUrl?: string,
): Promise<UserProfile> {
  try {
    const supabase = getAuthenticatedSupabase();

    // Check if user profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', clerkUserId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new users
      console.error('Error fetching user profile:', fetchError);
      throw fetchError;
    }

    const profileData = {
      id: clerkUserId,
      email: email || null,
      full_name: fullName || null,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString(),
    };

    if (existingProfile) {
      // Update existing profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', clerkUserId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        throw updateError;
      }

      return updatedProfile as UserProfile;
    } else {
      // Create new profile
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          ...profileData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        throw insertError;
      }

      return newProfile as UserProfile;
    }
  } catch (error) {
    console.error('Error syncing Clerk user to Supabase:', error);
    throw error;
  }
}
