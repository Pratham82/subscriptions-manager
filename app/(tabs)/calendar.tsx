import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { useSubscriptionStore } from '@/store/subscriptionStore';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
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

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const firstDay = new Date(year, month, 1).getDay();
  return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6, Monday (1) to 0
}

function CalendarDay({
  day,
  subscriptions,
  isToday,
}: {
  day: number | null;
  subscriptions: Array<{ name: string; color: string }>;
  isToday: boolean;
}) {
  if (day === null) {
    return <View style={styles.dayCell} />;
  }

  const today = new Date();
  const isCurrentDay = isToday && day === today.getDate();

  return (
    <View style={[styles.dayCell, isCurrentDay && styles.todayCell]}>
      <Text style={[styles.dayNumber, isCurrentDay && styles.todayText]}>{day}</Text>
      <View style={styles.iconsContainer}>
        {subscriptions.slice(0, 3).map((sub, index) => (
          <View key={index} style={[styles.iconDot, { backgroundColor: sub.color }]} />
        ))}
      </View>
    </View>
  );
}

export default function CalendarScreen() {
  const { subscriptions } = useSubscriptionStore();
  const activeSubscriptions = subscriptions.filter(sub => sub.isActive);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Group subscriptions by renewal date
  const subscriptionsByDate: Record<number, Array<{ name: string; color: string }>> = {};

  activeSubscriptions.forEach(sub => {
    const renewalDate = new Date(sub.nextPaymentDate);
    if (
      renewalDate.getMonth() === currentMonth &&
      renewalDate.getFullYear() === currentYear
    ) {
      const day = renewalDate.getDate();
      if (!subscriptionsByDate[day]) {
        subscriptionsByDate[day] = [];
      }
      subscriptionsByDate[day].push({
        name: sub.name,
        color: '#6b46c1',
      });
    }
  });

  // Calculate totals for the month
  const monthSubscriptions = activeSubscriptions.filter(sub => {
    const renewalDate = new Date(sub.nextPaymentDate);
    return (
      renewalDate.getMonth() === currentMonth && renewalDate.getFullYear() === currentYear
    );
  });

  const totalAmount = monthSubscriptions.reduce((sum, sub) => sum + sub.price, 0);
  const upcomingAmount = monthSubscriptions
    .filter(sub => {
      const renewalDate = new Date(sub.nextPaymentDate);
      return renewalDate >= today;
    })
    .reduce((sum, sub) => sum + sub.price, 0);

  // Generate calendar grid
  const calendarDays: Array<number | null> = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.monthName}>
            {MONTHS[currentMonth]} {currentYear}
          </Text>
          <View style={styles.totalsContainer}>
            <Text style={styles.totalText}>₹{totalAmount.toFixed(2)} Total</Text>
            <Text style={styles.upcomingText}>₹{upcomingAmount.toFixed(2)} Upcoming</Text>
          </View>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          {/* Day headers */}
          <View style={styles.dayHeaders}>
            {DAYS.map(day => (
              <Text key={day} style={styles.dayHeader}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar days */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <CalendarDay
                key={index}
                day={day}
                subscriptions={subscriptionsByDate[day || 0] || []}
                isToday={
                  day !== null &&
                  day === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear()
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  monthName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  totalsContainer: {
    gap: 8,
  },
  totalText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  upcomingText: {
    color: '#888',
    fontSize: 18,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayHeader: {
    flex: 1,
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  todayCell: {
    backgroundColor: '#6b46c1',
    borderRadius: 8,
  },
  dayNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  todayText: {
    color: '#fff',
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'center',
  },
  iconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
