import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';

import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Subscription } from '@/types/subscription';
import { SubscriptionModal, SubscriptionDetailSheet } from '@/components/core';
import { SolarSystemVisual } from '@/components/SolarSystemVisual';

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

function SubscriptionCard({
  subscription,
  onPress,
}: {
  subscription: Subscription;
  onPress: () => void;
}) {
  const daysUntil = getDaysUntil(subscription.nextPaymentDate);

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: '#1a1a2e' }}
    >
      <View style={styles.cardContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>
              {subscription.name.charAt(0).toUpperCase()}
            </Text>
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

export default function SubscriptionsScreen() {
  const { subscriptions } = useSubscriptionStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(
    null,
  );
  const activeSubscriptions = subscriptions.filter(sub => sub.isActive);
  const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
    const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
    return sum + monthlyPrice;
  }, 0);

  // Distribute subscriptions across 3 rings
  const ring1Subs = activeSubscriptions.slice(
    0,
    Math.ceil(activeSubscriptions.length / 3),
  );
  const ring2Subs = activeSubscriptions.slice(
    ring1Subs.length,
    ring1Subs.length + Math.ceil((activeSubscriptions.length - ring1Subs.length) / 2),
  );
  const ring3Subs = activeSubscriptions.slice(ring1Subs.length + ring2Subs.length);

  // Prepare orbit data with counts
  const orbits = [
    { subscriptions: ring1Subs, count: ring1Subs.length },
    { subscriptions: ring2Subs, count: ring2Subs.length },
    { subscriptions: ring3Subs, count: ring3Subs.length },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.upgradeButton}>
            <Text style={styles.upgradeText}>+ Upgrade</Text>
          </Pressable>
          <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addIcon}>+</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activeSubscriptions.length}</Text>
            <Text style={styles.statLabel}>Personal</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>₹{totalMonthly.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total monthly</Text>
          </View>
        </View>

        {/* Visual */}
        <SolarSystemVisual orbits={orbits} />

        {/* Active Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active</Text>
          <Pressable>
            <Text style={styles.sortText}>Next ↑↓</Text>
          </Pressable>
        </View>

        {/* Subscription List */}
        <View style={styles.listContainer}>
          {activeSubscriptions.map(subscription => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onPress={() => setSelectedSubscription(subscription)}
            />
          ))}
        </View>
      </ScrollView>

      <SubscriptionModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <SubscriptionDetailSheet
        subscription={selectedSubscription}
        onClose={() => setSelectedSubscription(null)}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  upgradeButton: {
    backgroundColor: '#6b46c1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#888',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  sortText: {
    color: '#888',
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
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
