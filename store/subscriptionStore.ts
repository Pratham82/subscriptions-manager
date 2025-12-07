import { create } from 'zustand';

import { supabase } from '@/utils/supabase';
import { Subscription, BillingRecord, PriceRecord } from '@/types/subscription';
import {
  DbSubscription,
  DbSubscriptionInsert,
  DbSubscriptionUpdate,
} from '@/types/database';
import { mockSubscriptions } from '@/data/mockSubscriptions';

// Helper functions to convert between frontend (camelCase) and database (snake_case) types
function toDbSubscription(sub: Subscription): DbSubscriptionInsert {
  return {
    name: sub.name,
    logo: sub.logo || null,
    price: sub.price,
    currency: sub.currency,
    billing_cycle: sub.billingCycle,
    billing_cycle_quantity: sub.billingCycleQuantity,
    next_payment_date: sub.nextPaymentDate,
    category: sub.category,
    subscribed_date: sub.subscribedDate,
    is_active: sub.isActive,
    billing_history: sub.billingHistory,
    price_history: sub.priceHistory,
    notification: sub.notification || null,
    payment_method: sub.paymentMethod || null,
    free_trial: sub.freeTrial ?? null,
    list: sub.list || null,
    url: sub.url || null,
  };
}

function toDbSubscriptionUpdate(updates: Partial<Subscription>): DbSubscriptionUpdate {
  const dbUpdates: DbSubscriptionUpdate = {};

  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.logo !== undefined) dbUpdates.logo = updates.logo || null;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
  if (updates.billingCycle !== undefined) dbUpdates.billing_cycle = updates.billingCycle;
  if (updates.billingCycleQuantity !== undefined)
    dbUpdates.billing_cycle_quantity = updates.billingCycleQuantity;
  if (updates.nextPaymentDate !== undefined)
    dbUpdates.next_payment_date = updates.nextPaymentDate;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.subscribedDate !== undefined)
    dbUpdates.subscribed_date = updates.subscribedDate;
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
  if (updates.billingHistory !== undefined)
    dbUpdates.billing_history = updates.billingHistory;
  if (updates.priceHistory !== undefined) dbUpdates.price_history = updates.priceHistory;
  if (updates.notification !== undefined)
    dbUpdates.notification = updates.notification || null;
  if (updates.paymentMethod !== undefined)
    dbUpdates.payment_method = updates.paymentMethod || null;
  if (updates.freeTrial !== undefined) dbUpdates.free_trial = updates.freeTrial ?? null;
  if (updates.list !== undefined) dbUpdates.list = updates.list || null;
  if (updates.url !== undefined) dbUpdates.url = updates.url || null;

  return dbUpdates;
}

function fromDbSubscription(dbSub: DbSubscription): Subscription {
  return {
    id: dbSub.id,
    name: dbSub.name,
    logo: dbSub.logo || undefined,
    price: dbSub.price,
    currency: dbSub.currency,
    billingCycle: dbSub.billing_cycle,
    billingCycleQuantity: dbSub.billing_cycle_quantity,
    nextPaymentDate: dbSub.next_payment_date,
    category: dbSub.category,
    subscribedDate: dbSub.subscribed_date,
    isActive: dbSub.is_active,
    billingHistory: (dbSub.billing_history || []) as BillingRecord[],
    priceHistory: (dbSub.price_history || []) as PriceRecord[],
    notification: dbSub.notification as Subscription['notification'],
    paymentMethod: dbSub.payment_method || undefined,
    freeTrial: dbSub.free_trial ?? undefined,
    list: dbSub.list || undefined,
    url: dbSub.url || undefined,
  };
}

interface SubscriptionStore {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  fetchSubscriptions: () => Promise<void>;
  addSubscription: (subscription: Subscription) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  markAsCancelled: (id: string) => Promise<void>;
  seedMockData: () => Promise<void>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  isLoading: false,
  error: null,
  isInitialized: false,

  fetchSubscriptions: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('next_payment_date', { ascending: true });

      if (error) {
        throw error;
      }

      const subscriptions = (data || []).map(fromDbSubscription);
      set({ subscriptions, isLoading: false, isInitialized: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch subscriptions';
      set({ error: message, isLoading: false, isInitialized: true });
      console.error('Error fetching subscriptions:', error);
    }
  },

  addSubscription: async (subscription: Subscription) => {
    set({ isLoading: true, error: null });

    try {
      const dbSubscription = toDbSubscription(subscription);

      const { data, error } = await supabase
        .from('subscriptions')
        .insert(dbSubscription)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newSubscription = fromDbSubscription(data);
      set(state => ({
        subscriptions: [...state.subscriptions, newSubscription],
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to add subscription';
      set({ error: message, isLoading: false });
      console.error('Error adding subscription:', error);
      throw error;
    }
  },

  updateSubscription: async (id: string, updates: Partial<Subscription>) => {
    set({ isLoading: true, error: null });

    try {
      const dbUpdates = toDbSubscriptionUpdate(updates);

      const { data, error } = await supabase
        .from('subscriptions')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedSubscription = fromDbSubscription(data);
      set(state => ({
        subscriptions: state.subscriptions.map(sub =>
          sub.id === id ? updatedSubscription : sub,
        ),
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update subscription';
      set({ error: message, isLoading: false });
      console.error('Error updating subscription:', error);
      throw error;
    }
  },

  deleteSubscription: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.from('subscriptions').delete().eq('id', id);

      if (error) {
        throw error;
      }

      set(state => ({
        subscriptions: state.subscriptions.filter(sub => sub.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete subscription';
      set({ error: message, isLoading: false });
      console.error('Error deleting subscription:', error);
      throw error;
    }
  },

  markAsCancelled: async (id: string) => {
    await get().updateSubscription(id, { isActive: false });
  },

  // Helper function to seed the database with mock data (for development)
  seedMockData: async () => {
    set({ isLoading: true, error: null });

    try {
      const dbSubscriptions = mockSubscriptions.map(toDbSubscription);

      const { error } = await supabase.from('subscriptions').insert(dbSubscriptions);

      if (error) {
        throw error;
      }

      // Refresh the subscriptions list
      await get().fetchSubscriptions();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to seed mock data';
      set({ error: message, isLoading: false });
      console.error('Error seeding mock data:', error);
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
