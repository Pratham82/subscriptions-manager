import { create } from 'zustand';

import { Subscription } from '@/types/subscription';

interface SubscriptionStore {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  markAsCancelled: (id: string) => void;
}

// Mock data based on screenshots
const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Apple One',
    price: 195.0,
    currency: '₹',
    billingCycle: 'monthly',
    billingCycleQuantity: 1,
    nextPaymentDate: '2025-12-09',
    category: 'Productivity',
    subscribedDate: '2025-05-13',
    isActive: true,
    billingHistory: [
      { date: '2025-11-09', amount: 195.0 },
      { date: '2025-10-09', amount: 195.0 },
      { date: '2025-09-09', amount: 195.0 },
      { date: '2025-08-09', amount: 195.0 },
      { date: '2025-07-09', amount: 195.0 },
      { date: '2025-06-09', amount: 195.0 },
      { date: '2025-05-09', amount: 195.0 },
    ],
    priceHistory: [
      { date: '2025-12-05', price: 195.0 },
      { date: '2025-05-09', price: 195.0 },
    ],
    notification: '1 day before',
    list: 'Personal',
    freeTrial: false,
  },
  {
    id: '2',
    name: 'Spotify',
    price: 1189.0,
    currency: '₹',
    billingCycle: 'monthly',
    billingCycleQuantity: 1,
    nextPaymentDate: '2025-12-14',
    category: 'Entertainment',
    subscribedDate: '2025-04-14',
    isActive: true,
    billingHistory: [],
    priceHistory: [],
    notification: '1 day before',
    list: 'Personal',
    freeTrial: false,
  },
  {
    id: '3',
    name: 'Netflix',
    price: 499.0,
    currency: '₹',
    billingCycle: 'monthly',
    billingCycleQuantity: 1,
    nextPaymentDate: '2025-12-27',
    category: 'Entertainment',
    subscribedDate: '2025-03-27',
    isActive: true,
    billingHistory: [],
    priceHistory: [],
    notification: '1 day before',
    list: 'Personal',
    freeTrial: false,
  },
  {
    id: '4',
    name: 'Jio Hotstar',
    price: 1499.0,
    currency: '₹',
    billingCycle: 'yearly',
    billingCycleQuantity: 1,
    nextPaymentDate: '2026-05-14',
    category: 'Entertainment',
    subscribedDate: '2025-05-14',
    isActive: true,
    billingHistory: [],
    priceHistory: [],
    notification: '1 day before',
    list: 'Personal',
    freeTrial: false,
  },
  {
    id: '5',
    name: 'Amazon Prime',
    price: 1499.0,
    currency: '₹',
    billingCycle: 'yearly',
    billingCycleQuantity: 1,
    nextPaymentDate: '2026-09-08',
    category: 'Shopping',
    subscribedDate: '2025-09-08',
    isActive: true,
    billingHistory: [],
    priceHistory: [],
    notification: '1 day before',
    list: 'Personal',
    freeTrial: false,
  },
];

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
