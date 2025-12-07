import { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { getBrandLogoUrl } from '@/utils/brandUtils';

interface CalendarDayProps {
  day: number | null;
  subscriptions: Array<{ name: string; color: string; price: number; logo?: string }>;
  isToday: boolean;
  month: number;
  year: number;
  cellWidth: number;
}

export function CalendarDay({
  day,
  subscriptions,
  isToday,
  month,
  year,
  cellWidth,
}: CalendarDayProps) {
  if (day === null) {
    return <View style={styles.dayCell} />;
  }

  const today = new Date();
  const isCurrentDay =
    isToday &&
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <View
      style={[
        styles.dayCell,
        { width: cellWidth, height: cellWidth },
        isCurrentDay && styles.todayCell,
      ]}
    >
      <Text style={[styles.dayNumber, isCurrentDay && styles.todayText]}>{day}</Text>
      {subscriptions.length > 0 && (
        <View style={styles.iconsContainer}>
          {subscriptions.slice(0, 3).map((sub, index) => {
            const logoUrl = getBrandLogoUrl(sub.logo || sub.name);
            return (
              <SubscriptionBadge
                key={index}
                subscription={sub}
                logoUrl={logoUrl}
                color={sub.color}
              />
            );
          })}
          {subscriptions.length > 3 && (
            <Text style={styles.moreCount}>+{subscriptions.length - 3}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dayCell: {
    padding: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    marginBottom: 4,
  },
  todayCell: {
    backgroundColor: '#6b46c1',
    borderWidth: 2,
    borderColor: '#8b5cf6',
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
    gap: 3,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  iconBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6b46c1',
  },
  iconText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  iconLogo: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  moreCount: {
    color: '#888',
    fontSize: 8,
    marginLeft: 2,
    fontWeight: '600',
  },
});

interface SubscriptionBadgeProps {
  subscription: { name: string; logo?: string };
  logoUrl: string | null;
  color: string;
}

function SubscriptionBadge({ subscription, logoUrl, color }: SubscriptionBadgeProps) {
  const [logoError, setLogoError] = useState(false);
  const showLogo = logoUrl && !logoError;

  return (
    <View
      style={[
        styles.iconBadge,
        !showLogo && { backgroundColor: color },
        showLogo && { backgroundColor: '#fff' },
      ]}
    >
      {showLogo ? (
        <Image
          source={{ uri: logoUrl }}
          style={styles.iconLogo}
          resizeMode="contain"
          onError={() => setLogoError(true)}
        />
      ) : (
        <Text style={styles.iconText}>{subscription.name.charAt(0).toUpperCase()}</Text>
      )}
    </View>
  );
}
