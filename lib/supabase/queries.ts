import { supabase } from './client';
import { Subscription } from '@/types/subscription';
import {
  DbSubscription,
  DbSubscriptionInsert,
  DbSubscriptionUpdate,
} from '@/types/database';
import {
  toDbSubscription,
  toDbSubscriptionUpdate,
  fromDbSubscription,
} from './transformers';

/**
 * Get the current user ID
 */
async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  return user.id;
}

/**
 * Fetch all subscriptions for the current user
 */
export async function fetchSubscriptions(): Promise<Subscription[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('next_payment_date', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map(fromDbSubscription);
}

/**
 * Fetch a single subscription by ID (for current user)
 */
export async function fetchSubscriptionById(id: string): Promise<Subscription | null> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }

  return data ? fromDbSubscription(data) : null;
}

/**
 * Create a new subscription for the current user
 */
export async function createSubscription(
  subscription: Subscription,
): Promise<Subscription> {
  const userId = await getCurrentUserId();
  const dbSubscription = toDbSubscription(subscription);

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      ...dbSubscription,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromDbSubscription(data);
}

/**
 * Update an existing subscription (for current user)
 */
export async function updateSubscription(
  id: string,
  updates: Partial<Subscription>,
): Promise<Subscription> {
  const userId = await getCurrentUserId();
  const dbUpdates = toDbSubscriptionUpdate(updates);

  const { data, error } = await supabase
    .from('subscriptions')
    .update(dbUpdates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromDbSubscription(data);
}

/**
 * Delete a subscription (for current user)
 */
export async function deleteSubscription(id: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

/**
 * Mark a subscription as cancelled (set isActive to false)
 */
export async function markSubscriptionAsCancelled(id: string): Promise<Subscription> {
  return updateSubscription(id, { isActive: false });
}

/**
 * Fetch active subscriptions only (for current user)
 */
export async function fetchActiveSubscriptions(): Promise<Subscription[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('next_payment_date', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map(fromDbSubscription);
}

/**
 * Fetch subscriptions by category (for current user)
 */
export async function fetchSubscriptionsByCategory(
  category: string,
): Promise<Subscription[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .order('next_payment_date', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map(fromDbSubscription);
}
