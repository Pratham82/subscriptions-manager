import { Subscription, BillingRecord, PriceRecord } from '@/types/subscription';
import {
  DbSubscription,
  DbSubscriptionInsert,
  DbSubscriptionUpdate,
} from '@/types/database';

/**
 * Convert frontend Subscription (camelCase) to database format (snake_case)
 * Note: user_id is set in queries.ts, not here
 */
export function toDbSubscription(
  sub: Subscription,
): Omit<DbSubscriptionInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'> {
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

/**
 * Convert partial Subscription updates to database format
 */
export function toDbSubscriptionUpdate(
  updates: Partial<Subscription>,
): DbSubscriptionUpdate {
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

/**
 * Convert database Subscription (snake_case) to frontend format (camelCase)
 */
export function fromDbSubscription(dbSub: DbSubscription): Subscription {
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
