import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Subscription } from '@/types/subscription';

import { SubscriptionModal } from './SubscriptionModal';

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

interface SubscriptionDetailSheetProps {
  subscription: Subscription | null;
  onClose: () => void;
}

export function SubscriptionDetailSheet({
  subscription,
  onClose,
}: SubscriptionDetailSheetProps) {
  console.log('🚀 ~ SubscriptionDetailSheet ~ subscription:', subscription);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { markAsCancelled, deleteSubscription } = useSubscriptionStore();
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => ['90%'], []);

  React.useEffect(() => {
    if (subscription) {
      // Use requestAnimationFrame and setTimeout to ensure the sheet is ready before expanding
      requestAnimationFrame(() => {
        setTimeout(() => {
          bottomSheetRef.current?.expand();
        }, 50);
      });
    } else {
      bottomSheetRef.current?.close();
    }
  }, [subscription]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={1}
      >
        <LinearGradient
          colors={[
            'rgba(10, 10, 15, 0.95)',
            'rgba(26, 26, 46, 0.9)',
            'rgba(107, 70, 193, 0.8)',
          ]}
          style={StyleSheet.absoluteFill}
        />
      </BottomSheetBackdrop>
    ),
    [],
  );

  const totalSpent = subscription
    ? subscription.billingHistory.reduce((sum, record) => sum + record.amount, 0)
    : 0;
  const daysSubscribed = subscription ? getDaysSince(subscription.subscribedDate) : 0;

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheet}
        handleIndicatorStyle={styles.handleIndicatorHidden}
        topInset={insets.top}
      >
        <LinearGradient
          colors={['#2d1b4e', '#1a1a2e', '#0a0a0f']}
          style={[StyleSheet.absoluteFill, styles.gradientContainer]}
        />
        <BottomSheetView style={styles.contentContainer}>
          {subscription ? (
            <>
              {/* Handle Indicator */}
              <View style={styles.handleIndicatorContainer}>
                <View style={styles.handleIndicator} />
              </View>
              {/* Header */}
              <View style={[styles.header]}>
                <Pressable onPress={onClose}>
                  {/* <Text style={styles.backButton}>←</Text> */}
                </Pressable>
                <Pressable
                  style={styles.editButton}
                  onPress={() => setEditModalVisible(true)}
                >
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              </View>

              <BottomSheetScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
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
                        {subscription.billingCycleQuantity === 1
                          ? subscription.billingCycle.charAt(0).toUpperCase() +
                            subscription.billingCycle.slice(1)
                          : `Every ${subscription.billingCycleQuantity} ${subscription.billingCycle}s`}
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
              </BottomSheetScrollView>

              {/* Actions - Sticky at bottom */}
              <View style={styles.actionsContainer}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    markAsCancelled(subscription.id);
                    onClose();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Mark as Cancelled</Text>
                </Pressable>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => {
                    deleteSubscription(subscription.id);
                    onClose();
                  }}
                >
                  <Text style={styles.deleteButtonText}>Delete subscription</Text>
                </Pressable>
              </View>
            </>
          ) : null}
        </BottomSheetView>
      </BottomSheet>

      <SubscriptionModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        subscription={subscription || undefined}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handleIndicatorHidden: {
    display: 'none',
  },
  gradientContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicatorContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
    flexShrink: 0,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#888',
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexShrink: 0,
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
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
    flexShrink: 0,
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
});
