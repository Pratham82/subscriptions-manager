import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SubscriptionModal } from '@/components/core';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDaysSince(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  const diff = today.getTime() - target.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { subscriptions, markAsCancelled, deleteSubscription } = useSubscriptionStore();
  const [modalVisible, setModalVisible] = useState(false);
  const subscription = subscriptions.find(sub => sub.id === id);

  if (!subscription) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Subscription not found</Text>
      </View>
    );
  }

  const totalSpent = subscription.billingHistory.reduce(
    (sum, record) => sum + record.amount,
    0,
  );
  const daysSubscribed = getDaysSince(subscription.subscribedDate);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backButton}>←</Text>
          </Pressable>
          <Pressable style={styles.editButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>

        {/* Subscription Info */}
        <View style={styles.infoSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>
                {subscription.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.name}>{subscription.name}</Text>
          <Text style={styles.price}>
            {subscription.currency}
            {subscription.price.toFixed(2)}
          </Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Billing</Text>
              <Text style={styles.detailValue}>
                {subscription.billingCycle.charAt(0).toUpperCase() +
                  subscription.billingCycle.slice(1)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Next payment</Text>
              <Text style={styles.detailValue}>
                {formatDate(subscription.nextPaymentDate)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total spent</Text>
              <Text style={styles.detailValue}>
                {subscription.currency}
                {totalSpent.toFixed(2)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Subscribed</Text>
              <Text style={styles.detailValue}>{daysSubscribed} days</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{subscription.category}</Text>
            </View>
          </View>
        </View>

        {/* Billing History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Billing History</Text>
          {subscription.billingHistory.length > 0 ? (
            subscription.billingHistory.map((record, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyDate}>{formatDate(record.date)}</Text>
                <Text style={styles.historyAmount}>
                  {subscription.currency}
                  {record.amount.toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No billing history</Text>
          )}
        </View>

        {/* Price History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Price History</Text>
          {subscription.priceHistory.length > 0 ? (
            subscription.priceHistory.map((record, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyDate}>{formatDate(record.date)}</Text>
                <Text style={styles.historyAmount}>
                  {subscription.currency}
                  {record.price.toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No price history</Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={styles.cancelButton}
            onPress={() => {
              markAsCancelled(subscription.id);
              router.back();
            }}
          >
            <Text style={styles.cancelButtonText}>Mark as Cancelled</Text>
          </Pressable>
          <Pressable
            style={styles.deleteButton}
            onPress={() => {
              deleteSubscription(subscription.id);
              router.back();
            }}
          >
            <Text style={styles.deleteButtonText}>Delete subscription</Text>
          </Pressable>
        </View>
      </ScrollView>

      <SubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        subscription={subscription}
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
  backButton: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
  editButton: {
    backgroundColor: '#6b46c1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6b46c1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  name: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  detailsGrid: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#888',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  historySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  historyDate: {
    color: '#888',
    fontSize: 14,
  },
  historyAmount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  cancelButton: {
    backgroundColor: '#6b46c1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteButtonText: {
    color: '#888',
    fontSize: 14,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
});
