import { StyleSheet, Text, View } from 'react-native';

import { CalendarDay } from './CalendarDay';
import { DAYS, MONTHS, getDaysInMonth, getFirstDayOfMonth } from '@/utils/calendarUtils';

interface CalendarMonthProps {
  year: number;
  month: number;
  subscriptionsByDate: Record<
    string,
    Array<{ name: string; color: string; price: number }>
  >;
  today: Date;
  screenWidth: number;
}

export function CalendarMonth({
  year,
  month,
  subscriptionsByDate,
  today,
  screenWidth,
}: CalendarMonthProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

  const calendarDays: Array<number | null> = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const dateKey = `${year}-${month}-`;
  // Calculate cell width: (screen width - horizontal padding) / 7
  const cellWidth = (screenWidth - 40) / 7; // 40 = 20px padding on each side

  return (
    <View style={styles.monthContainer}>
      <Text style={styles.monthName}>
        {MONTHS[month]} {year}
      </Text>
      <View style={styles.dayHeaders}>
        {DAYS.map(day => (
          <Text key={day} style={[styles.dayHeader, { width: cellWidth }]}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => {
          const fullDateKey = day !== null ? `${dateKey}${day}` : '';
          const daySubscriptions = subscriptionsByDate[fullDateKey] || [];
          return (
            <CalendarDay
              key={index}
              day={day}
              subscriptions={daySubscriptions}
              isToday={isCurrentMonth}
              month={month}
              year={year}
              cellWidth={cellWidth}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthContainer: {
    flex: 1,
  },
  monthName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayHeader: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 4,
  },
});
