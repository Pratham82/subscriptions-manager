import { StyleSheet, Text, View, Pressable } from 'react-native';

import { Subscription } from '@/types/subscription';
import { getBrandByName, renderBrandIcon } from '@/utils/brandUtils';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDaysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress: () => void;
}

export function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
  const daysUntil = getDaysUntil(subscription.nextPaymentDate);
  const brand = getBrandByName(subscription.logo);

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: '#1a1a2e' }}
    >
      <View style={styles.cardContent}>
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logoPlaceholder,
              brand && { backgroundColor: brand.color || '#6b46c1' },
            ]}
          >
            {brand ? (
              renderBrandIcon(brand, 24, '#fff')
            ) : (
              <Text style={styles.logoText}>
                {subscription.name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{subscription.name}</Text>
          <Text style={styles.cardDate}>
            Renews in {daysUntil} days • {formatDate(subscription.nextPaymentDate)}
          </Text>
        </View>
        <View style={styles.cardPrice}>
          <Text style={styles.priceText}>
            {subscription.currency}
            {subscription.price.toFixed(2)}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logoContainer: {
    marginRight: 12,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6b46c1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDate: {
    color: '#888',
    fontSize: 12,
  },
  cardPrice: {
    marginRight: 8,
  },
  priceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chevron: {
    color: '#888',
    fontSize: 24,
    fontWeight: '300',
  },
});
