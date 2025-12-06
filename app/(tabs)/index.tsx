import { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';

import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Subscription } from '@/types/subscription';
import {
  AddSubscriptionModal,
  SubscriptionDetailSheet,
  SubscriptionCard,
} from '@/components/core';
import { SolarSystemVisual } from '@/components/SolarSystemVisual';
import { SortPicker, type SortOption } from '@/components/SortPicker';

export default function SubscriptionsScreen() {
  const { subscriptions } = useSubscriptionStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(
    null,
  );
  const [sortOption, setSortOption] = useState<SortOption>('next');
  const [showSortPicker, setShowSortPicker] = useState(false);

  const activeSubscriptions = subscriptions.filter(sub => sub.isActive);

  // Sort subscriptions based on selected option
  const sortedSubscriptions = useMemo(() => {
    const sorted = [...activeSubscriptions];

    switch (sortOption) {
      case 'next':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.nextPaymentDate).getTime();
          const dateB = new Date(b.nextPaymentDate).getTime();
          return dateA - dateB;
        });
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'group-by':
        // Group by category, then sort by name within each group
        return sorted.sort((a, b) => {
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
          }
          return a.name.localeCompare(b.name);
        });
      default:
        return sorted;
    }
  }, [activeSubscriptions, sortOption]);
  // Calculate monthly cost for each subscription
  const totalMonthly = sortedSubscriptions.reduce((sum, sub) => {
    let monthlyPrice = 0;
    const { billingCycle, billingCycleQuantity, price } = sub;

    switch (billingCycle) {
      case 'daily':
        // Daily: price per day * 30 days per month / quantity
        monthlyPrice = (price * 30) / billingCycleQuantity;
        break;
      case 'weekly':
        // Weekly: price per week * 52 weeks / 12 months / quantity
        monthlyPrice = (price * 52) / 12 / billingCycleQuantity;
        break;
      case 'monthly':
        // Monthly: price per billing cycle / quantity (if quantity is 2, it's every 2 months)
        monthlyPrice = price / billingCycleQuantity;
        break;
      case 'yearly':
        // Yearly: price per year / 12 months / quantity (if quantity is 2, it's every 2 years)
        monthlyPrice = price / 12 / billingCycleQuantity;
        break;
    }

    return sum + monthlyPrice;
  }, 0);

  // Distribute subscriptions across 3 rings (use original activeSubscriptions for visual)
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
          <Pressable onPress={() => setShowSortPicker(true)}>
            <Text style={styles.sortText}>
              {sortOption === 'next'
                ? 'Next ↑↓'
                : sortOption === 'name'
                  ? 'Name'
                  : sortOption === 'price-low'
                    ? 'Price (Low)'
                    : sortOption === 'price-high'
                      ? 'Price (High)'
                      : 'Group by'}
            </Text>
          </Pressable>
        </View>

        {/* Subscription List */}
        <View style={styles.listContainer}>
          {sortedSubscriptions.map(subscription => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onPress={() => setSelectedSubscription(subscription)}
            />
          ))}
        </View>
      </ScrollView>

      <AddSubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <SubscriptionDetailSheet
        subscription={selectedSubscription}
        onClose={() => setSelectedSubscription(null)}
      />

      <SortPicker
        visible={showSortPicker}
        onClose={() => setShowSortPicker(false)}
        selected={sortOption}
        onSelect={setSortOption}
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
});
