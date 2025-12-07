import { supabase } from './client';
import { mockSubscriptions } from '@/data/mockSubscriptions';
import { toDbSubscription } from './transformers';
import { fetchSubscriptions } from './queries';

/**
 * Seed the database with mock subscription data
 * This is useful for development and testing
 */
export async function seedMockData(): Promise<void> {
  const dbSubscriptions = mockSubscriptions.map(toDbSubscription);

  const { error } = await supabase.from('subscriptions').insert(dbSubscriptions);

  if (error) {
    throw error;
  }
}

/**
 * Clear all subscriptions from the database
 * WARNING: This will delete all data!
 */
export async function clearAllSubscriptions(): Promise<void> {
  const { error } = await supabase.from('subscriptions').delete().neq('id', '');

  if (error) {
    throw error;
  }
}

/**
 * Reset the database by clearing all data and reseeding with mock data
 */
export async function resetDatabase(): Promise<void> {
  await clearAllSubscriptions();
  await seedMockData();
}

/**
 * Check if the database is empty
 */
export async function isDatabaseEmpty(): Promise<boolean> {
  const subscriptions = await fetchSubscriptions();
  return subscriptions.length === 0;
}
