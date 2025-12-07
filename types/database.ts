// Supabase database types
// These types map to the database schema (snake_case)

export type DbSubscription = {
  id: string;
  user_id?: string;
  name: string;
  logo?: string | null;
  price: number;
  currency: string;
  billing_cycle: 'daily' | 'weekly' | 'monthly' | 'yearly';
  billing_cycle_quantity: number;
  next_payment_date: string;
  category: string;
  subscribed_date: string;
  is_active: boolean;
  billing_history: DbBillingRecord[];
  price_history: DbPriceRecord[];
  notification?: string | null;
  payment_method?: string | null;
  free_trial?: boolean | null;
  list?: 'Personal' | 'Business' | null;
  url?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type DbBillingRecord = {
  date: string;
  amount: number;
};

export type DbPriceRecord = {
  date: string;
  price: number;
};

// Insert type (omit auto-generated fields)
export type DbSubscriptionInsert = Omit<
  DbSubscription,
  'id' | 'created_at' | 'updated_at'
>;

// Update type (all fields optional except id)
export type DbSubscriptionUpdate = Partial<Omit<DbSubscription, 'id' | 'created_at'>>;
