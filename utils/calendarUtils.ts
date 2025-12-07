import { Subscription } from '@/types/subscription';

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  const firstDay = new Date(year, month, 1).getDay();
  return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6, Monday (1) to 0
}

// Calculate all renewal dates for a subscription within a date range
export function calculateRenewalDates(
  subscription: Subscription,
  startDate: Date,
  endDate: Date,
): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(subscription.nextPaymentDate);

  // If the next payment date is before start date, calculate from start
  if (currentDate < startDate) {
    // Calculate how many cycles we need to advance
    const { billingCycle, billingCycleQuantity } = subscription;
    const daysDiff = Math.floor(
      (startDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    let cyclesToAdvance = 0;
    switch (billingCycle) {
      case 'daily':
        cyclesToAdvance = Math.ceil(daysDiff / billingCycleQuantity);
        break;
      case 'weekly':
        cyclesToAdvance = Math.ceil(daysDiff / (7 * billingCycleQuantity));
        break;
      case 'monthly':
        // Approximate: 30 days per month
        cyclesToAdvance = Math.ceil(daysDiff / (30 * billingCycleQuantity));
        break;
      case 'yearly':
        cyclesToAdvance = Math.ceil(daysDiff / (365 * billingCycleQuantity));
        break;
    }

    // Advance to the first renewal date after start date
    for (let i = 0; i < cyclesToAdvance; i++) {
      const newDate = new Date(currentDate);
      switch (subscription.billingCycle) {
        case 'daily':
          newDate.setDate(newDate.getDate() + subscription.billingCycleQuantity);
          break;
        case 'weekly':
          newDate.setDate(newDate.getDate() + 7 * subscription.billingCycleQuantity);
          break;
        case 'monthly':
          newDate.setMonth(newDate.getMonth() + subscription.billingCycleQuantity);
          break;
        case 'yearly':
          newDate.setFullYear(newDate.getFullYear() + subscription.billingCycleQuantity);
          break;
      }
      currentDate = newDate;
    }
  }

  // Generate all renewal dates within the range
  while (currentDate <= endDate) {
    if (currentDate >= startDate) {
      dates.push(new Date(currentDate));
    }

    // Calculate next renewal date
    const nextDate = new Date(currentDate);
    switch (subscription.billingCycle) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + subscription.billingCycleQuantity);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7 * subscription.billingCycleQuantity);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + subscription.billingCycleQuantity);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + subscription.billingCycleQuantity);
        break;
    }
    currentDate = nextDate;
  }

  return dates;
}
