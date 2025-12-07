// User profile types
// These types map to the user_profiles table and auth.users

export type UserProfile = {
  id: string; // UUID from auth.users
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
};

// Extended user type that includes auth information
export type User = {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
};

// Insert type (omit auto-generated fields)
export type UserProfileInsert = Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;

// Update type
export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'created_at'>>;
