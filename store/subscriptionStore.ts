import { create } from 'zustand';

import {
  fetchSubscriptions as fetchSubscriptionsFromDb,
  createSubscription as createSubscriptionInDb,
  updateSubscription as updateSubscriptionInDb,
  deleteSubscription as deleteSubscriptionInDb,
  markSubscriptionAsCancelled as markSubscriptionAsCancelledInDb,
  seedMockData as seedMockDataInDb,
} from '@/lib/supabase';
import { Subscription } from '@/types/subscription';

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
      const subscriptions = await fetchSubscriptionsFromDb();
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
      const newSubscription = await createSubscriptionInDb(subscription);
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
      const updatedSubscription = await updateSubscriptionInDb(id, updates);
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
      await deleteSubscriptionInDb(id);
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
    try {
      const updatedSubscription = await markSubscriptionAsCancelledInDb(id);
      set(state => ({
        subscriptions: state.subscriptions.map(sub =>
          sub.id === id ? updatedSubscription : sub,
        ),
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to cancel subscription';
      set({ error: message });
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  },

  seedMockData: async () => {
    set({ isLoading: true, error: null });

    try {
      await seedMockDataInDb();
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
