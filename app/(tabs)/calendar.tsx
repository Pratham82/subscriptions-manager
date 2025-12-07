import { useMemo, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';

import { useSubscriptionStore } from '@/store/subscriptionStore';
import { calculateRenewalDates } from '@/utils/calendarUtils';
import { CalendarMonth } from '@/components/calendar';

export default function CalendarScreen() {
  const { subscriptions } = useSubscriptionStore();
  const activeSubscriptions = subscriptions.filter(sub => sub.isActive);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Calculate all renewal dates for all subscriptions across the years
  const subscriptionsByDate = useMemo(() => {
    const result: Record<
      string,
      Array<{ name: string; color: string; price: number; logo?: string }>
    > = {};

    const startDate = new Date(currentYear - 1, 0, 1); // January 1st of previous year
    const endDate = new Date(currentYear + 1, 11, 31); // December 31st of next year

    activeSubscriptions.forEach(sub => {
      const renewalDates = calculateRenewalDates(sub, startDate, endDate);

      renewalDates.forEach(date => {
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        if (!result[dateKey]) {
          result[dateKey] = [];
        }
        result[dateKey].push({
          name: sub.name,
          color: '#6b46c1',
          price: sub.price,
          logo: sub.logo,
        });
      });
    });

    return result;
  }, [activeSubscriptions, currentYear]);

  // Generate all months to display (previous year, current year, next year)
  const monthsToShow = useMemo(() => {
    const months: Array<{ year: number; month: number }> = [];
    const yearsToShow = [currentYear - 1, currentYear, currentYear + 1];
    yearsToShow.forEach(year => {
      for (let month = 0; month < 12; month++) {
        months.push({ year, month });
      }
    });
    return months;
  }, [currentYear]);

  // Scroll to current month on mount
  useEffect(() => {
    // Calculate the index of current month (12 months in previous year + current month index)
    const currentMonthIndex = 12 + currentMonth;
    const scrollPosition = currentMonthIndex * screenWidth;

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: scrollPosition,
        animated: false,
      });
    }, 100);
  }, [currentMonth, screenWidth]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.yearTitle}>Calendar</Text>
      </View>

      {/* Horizontal Scrollable Months */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.horizontalContent}
      >
        {monthsToShow.map(({ year, month }) => (
          <View
            key={`${year}-${month}`}
            style={[styles.monthWrapper, { width: screenWidth }]}
          >
            <CalendarMonth
              year={year}
              month={month}
              subscriptionsByDate={subscriptionsByDate}
              today={today}
              screenWidth={screenWidth}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  yearTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  horizontalScroll: {
    flex: 1,
  },
  horizontalContent: {
    alignItems: 'flex-start',
  },
  monthWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    width: '100%',
  },
});
