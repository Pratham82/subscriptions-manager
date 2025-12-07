import { create } from 'zustand';

import { Subscription } from '@/types/subscription';
import { mockSubscriptions } from '@/data/mockSubscriptions';

interface SubscriptionStore {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  markAsCancelled: (id: string) => void;
}

export const useSubscriptionStore = create<SubscriptionStore>(set => ({
  subscriptions: mockSubscriptions,
  addSubscription: subscription =>
    set(state => ({
      subscriptions: [...state.subscriptions, subscription],
    })),
  updateSubscription: (id, updates) =>
    set(state => ({
      subscriptions: state.subscriptions.map(sub =>
        sub.id === id ? { ...sub, ...updates } : sub,
      ),
    })),
  deleteSubscription: id =>
    set(state => ({
      subscriptions: state.subscriptions.filter(sub => sub.id !== id),
    })),
  markAsCancelled: id =>
    set(state => ({
      subscriptions: state.subscriptions.map(sub =>
        sub.id === id ? { ...sub, isActive: false } : sub,
      ),
    })),
}));
