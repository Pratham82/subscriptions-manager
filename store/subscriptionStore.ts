import { create } from 'zustand';
import { toast } from 'sonner-native';

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
      console.log('🚀 ~ error:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to fetch subscriptions';
      set({ error: message, isLoading: false, isInitialized: true });
      toast.error('Failed to fetch subscriptions', {
        description: message,
      });
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
      toast.success('Subscription added', {
        description: `${subscription.name} has been added successfully`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to add subscription';
      set({ error: message, isLoading: false });
      toast.error('Failed to add subscription', {
        description: message,
      });
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
      toast.success('Subscription updated', {
        description: `${updates.name || 'Subscription'} has been updated successfully`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update subscription';
      set({ error: message, isLoading: false });
      toast.error('Failed to update subscription', {
        description: message,
      });
      throw error;
    }
  },

  deleteSubscription: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const subscription = get().subscriptions.find(sub => sub.id === id);
      await deleteSubscriptionInDb(id);
      set(state => ({
        subscriptions: state.subscriptions.filter(sub => sub.id !== id),
        isLoading: false,
      }));
      toast.success('Subscription deleted', {
        description: `${subscription?.name || 'Subscription'} has been deleted`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete subscription';
      set({ error: message, isLoading: false });
      toast.error('Failed to delete subscription', {
        description: message,
      });
      throw error;
    }
  },

  markAsCancelled: async (id: string) => {
    try {
      const subscription = get().subscriptions.find(sub => sub.id === id);
      const updatedSubscription = await markSubscriptionAsCancelledInDb(id);
      set(state => ({
        subscriptions: state.subscriptions.map(sub =>
          sub.id === id ? updatedSubscription : sub,
        ),
      }));
      toast.success('Subscription cancelled', {
        description: `${subscription?.name || 'Subscription'} has been marked as cancelled`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to cancel subscription';
      set({ error: message });
      toast.error('Failed to cancel subscription', {
        description: message,
      });
      throw error;
    }
  },

  seedMockData: async () => {
    set({ isLoading: true, error: null });

    try {
      await seedMockDataInDb();
      // Refresh the subscriptions list
      await get().fetchSubscriptions();
      toast.success('Mock data seeded', {
        description: 'Sample subscriptions have been added',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to seed mock data';
      set({ error: message, isLoading: false });
      toast.error('Failed to seed mock data', {
        description: message,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
