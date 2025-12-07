// Client
export { supabase } from './client';

// Subscription Queries
export {
  fetchSubscriptions,
  fetchSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  markSubscriptionAsCancelled,
  fetchActiveSubscriptions,
  fetchSubscriptionsByCategory,
} from './queries';

// User Queries
export {
  getCurrentUserProfile,
  getUserProfileById,
  upsertUserProfile,
  updateUserProfile,
  getCurrentUser,
  signUp,
  signIn,
  signOut,
  isAuthenticated,
} from './user-queries';

// Seed functions
export {
  seedMockData,
  clearAllSubscriptions,
  resetDatabase,
  isDatabaseEmpty,
} from './seed';

// Transformers
export {
  toDbSubscription,
  toDbSubscriptionUpdate,
  fromDbSubscription,
} from './transformers';
