export type Subscription = {
  id: string;
  name: string;
  logo?: string;
  price: number;
  currency: string;
  billingCycle: 'daily' | 'weekly' | 'monthly' | 'yearly';
  billingCycleQuantity: number; // e.g., 1, 2, 3 months
  nextPaymentDate: string; // ISO date string
  category: string;
  subscribedDate: string; // ISO date string
  isActive: boolean;
  billingHistory: BillingRecord[];
  priceHistory: PriceRecord[];
  notification?:
    | 'none'
    | '1 day before'
    | '3 days before'
    | '1 week before'
    | '1 month before'
    | '3 months before';
  paymentMethod?: string;
  freeTrial?: boolean;
  list?: 'Personal' | 'Business';
  url?: string;
};

export type BillingRecord = {
  date: string; // ISO date string
  amount: number;
};

export type PriceRecord = {
  date: string; // ISO date string
  price: number;
};
