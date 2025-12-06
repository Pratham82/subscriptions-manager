import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Subscription } from '@/types/subscription';

import { BillingCyclePicker } from './BillingCyclePicker';
import { CategoryPicker } from './CategoryPicker';
import { NotificationPicker } from './NotificationPicker';
import { DatePicker } from './DatePicker';

const CATEGORIES = [
  'Newsletter',
  'Other',
  'Phone',
  'Photography',
  'Podcast',
  'Productivity',
  'Rent',
  'Shopping',
  'Smart Home',
  'Social',
  'Sports',
  'Entertainment',
];

const NOTIFICATION_OPTIONS = [
  'none',
  '1 day before',
  '3 days before',
  '1 week before',
  '1 month before',
  '3 months before',
] as const;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  subscription?: Subscription;
}

export function SubscriptionModal({
  visible,
  onClose,
  subscription,
}: SubscriptionModalProps) {
  const { addSubscription, updateSubscription } = useSubscriptionStore();
  const isEdit = !!subscription;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => ['90%'], []);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [billingCycleQuantity, setBillingCycleQuantity] = useState(1);
  const [billingCycle, setBillingCycle] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'
  >('monthly');
  const [category, setCategory] = useState('Productivity');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [freeTrial, setFreeTrial] = useState(false);
  const [list, setList] = useState<'Personal' | 'Business'>('Personal');
  const [notification, setNotification] =
    useState<(typeof NOTIFICATION_OPTIONS)[number]>('1 day before');
  const [url, setUrl] = useState('');

  const [showBillingPicker, setShowBillingPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showNotificationPicker, setShowNotificationPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          bottomSheetRef.current?.expand();
        }, 50);
      });
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setPrice(subscription.price.toString());
      setPaymentDate(new Date(subscription.nextPaymentDate));
      setBillingCycleQuantity(subscription.billingCycleQuantity || 1);
      setBillingCycle(subscription.billingCycle);
      setCategory(subscription.category);
      setPaymentMethod(subscription.paymentMethod || '');
      setFreeTrial(subscription.freeTrial || false);
      setList(subscription.list || 'Personal');
      setNotification(subscription.notification || '1 day before');
      setUrl(subscription.url || '');
    } else {
      setName('');
      setPrice('');
      setPaymentDate(new Date());
      setBillingCycleQuantity(1);
      setBillingCycle('monthly');
      setCategory('Productivity');
      setPaymentMethod('');
      setFreeTrial(false);
      setList('Personal');
      setNotification('1 day before');
      setUrl('');
    }
  }, [subscription, visible]);

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

  const handleSave = () => {
    if (!name || !price) {
      return;
    }

    const subscriptionData: Partial<Subscription> = {
      name,
      price: parseFloat(price),
      currency: '₹',
      nextPaymentDate: paymentDate.toISOString().split('T')[0],
      billingCycleQuantity,
      billingCycle,
      category,
      paymentMethod: paymentMethod || undefined,
      freeTrial,
      list,
      notification,
      url: url || undefined,
      subscribedDate:
        subscription?.subscribedDate || new Date().toISOString().split('T')[0],
      isActive: subscription?.isActive ?? true,
      billingHistory: subscription?.billingHistory || [],
      priceHistory: subscription?.priceHistory || [],
    };

    if (isEdit && subscription) {
      if (subscription.price !== parseFloat(price)) {
        subscriptionData.priceHistory = [
          ...(subscription.priceHistory || []),
          {
            date: new Date().toISOString().split('T')[0],
            price: parseFloat(price),
          },
        ];
      }
      updateSubscription(subscription.id, subscriptionData);
    } else {
      const newSubscription: Subscription = {
        id: Date.now().toString(),
        ...subscriptionData,
      } as Subscription;
      addSubscription(newSubscription);
    }

    onClose();
  };

  const getBillingCycleText = () => {
    if (billingCycleQuantity === 1) {
      return `Every ${billingCycle.slice(0, -2)}`;
    }
    return `Every ${billingCycleQuantity} ${billingCycle}s`;
  };

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
        <View style={styles.contentContainer}>
          {/* Handle Indicator */}
          <View style={styles.handleIndicatorContainer}>
            <View style={styles.handleIndicator} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isEdit ? 'Edit Subscription' : 'Add Subscription'}
            </Text>
            <Pressable onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>

          {/* Scrollable Content */}
          <BottomSheetScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Subscription Info Card */}
            <View style={styles.card}>
              <View style={styles.logoContainer}>
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoText}>
                    {name.charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>
              </View>
              <View style={styles.namePriceContainer}>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Subscription name"
                  placeholderTextColor="#888"
                  value={name}
                  onChangeText={setName}
                />
                <View style={styles.priceContainer}>
                  <View style={styles.currencyBadge}>
                    <Text style={styles.currencyText}>₹</Text>
                  </View>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="0.00"
                    placeholderTextColor="#888"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>

            {/* Payment Info Card */}
            <View style={styles.card}>
              <Pressable style={styles.fieldRow} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.fieldLabel}>Payment date</Text>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>
                    {formatDate(paymentDate.toISOString())}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.fieldRow}
                onPress={() => setShowBillingPicker(true)}
              >
                <Text style={styles.fieldLabel}>Billing Cycle</Text>
                <Text style={styles.fieldValue}>{getBillingCycleText()}</Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Free Trial</Text>
                <Switch
                  value={freeTrial}
                  onValueChange={setFreeTrial}
                  trackColor={{ false: '#1a1a2e', true: '#6b46c1' }}
                  thumbColor={freeTrial ? '#fff' : '#888'}
                />
              </View>
            </View>

            {/* Categorization Card */}
            <View style={styles.card}>
              <Pressable
                style={styles.fieldRow}
                onPress={() => setList(list === 'Personal' ? 'Business' : 'Personal')}
              >
                <Text style={styles.fieldLabel}>List</Text>
                <Text style={styles.fieldValue}>{list}</Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              <Pressable
                style={styles.fieldRow}
                onPress={() => setShowCategoryPicker(true)}
              >
                <Text style={styles.fieldLabel}>Category</Text>
                <Text style={styles.fieldValue}>{category}</Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Payment Method</Text>
                <TextInput
                  style={styles.paymentInput}
                  placeholder="Card number"
                  placeholderTextColor="#888"
                  value={paymentMethod}
                  onChangeText={setPaymentMethod}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Additional Options Card */}
            <View style={styles.card}>
              <Pressable
                style={styles.fieldRow}
                onPress={() => setShowNotificationPicker(true)}
              >
                <Text style={styles.fieldLabel}>Notification</Text>
                <Text style={styles.fieldValue}>
                  {notification === 'none' ? 'None' : notification}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              {isEdit && subscription && subscription.priceHistory.length > 0 && (
                <Pressable
                  style={styles.fieldRow}
                  onPress={() => {
                    // Navigate to price history if needed
                  }}
                >
                  <Text style={styles.fieldLabel}>Price History</Text>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              )}
            </View>

            {/* URL Field */}
            <View style={styles.card}>
              <Text style={styles.fieldLabel}>URL</Text>
              <TextInput
                style={styles.urlInput}
                placeholder="https://..."
                placeholderTextColor="#888"
                value={url}
                onChangeText={setUrl}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </BottomSheetScrollView>
        </View>
      </BottomSheet>

      {/* Pickers */}
      <BillingCyclePicker
        visible={showBillingPicker}
        onClose={() => setShowBillingPicker(false)}
        quantity={billingCycleQuantity}
        cycle={billingCycle}
        onSelect={(qty, cycle) => {
          setBillingCycleQuantity(qty);
          setBillingCycle(cycle);
          setShowBillingPicker(false);
        }}
      />

      <CategoryPicker
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        selected={category}
        categories={CATEGORIES}
        onSelect={cat => {
          setCategory(cat);
          setShowCategoryPicker(false);
        }}
      />

      <NotificationPicker
        visible={showNotificationPicker}
        onClose={() => setShowNotificationPicker(false)}
        selected={notification}
        options={NOTIFICATION_OPTIONS}
        onSelect={notif => {
          setNotification(notif);
          setShowNotificationPicker(false);
        }}
      />

      <DatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        date={paymentDate}
        onSelect={date => {
          setPaymentDate(date);
          setShowDatePicker(false);
        }}
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
    // REMOVED: flexShrink: 0,
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
    // REMOVED: flexShrink: 0,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#6b46c1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1a1a2e',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  logoContainer: {
    marginBottom: 12,
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
  namePriceContainer: {
    gap: 12,
  },
  nameInput: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyBadge: {
    backgroundColor: '#6b46c1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  currencyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  priceInput: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    color: '#fff',
    fontSize: 16,
  },
  fieldValue: {
    color: '#888',
    fontSize: 14,
  },
  dateBadge: {
    backgroundColor: '#0a0a0f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
  },
  chevron: {
    color: '#888',
    fontSize: 20,
    marginLeft: 8,
    fontWeight: '300',
  },
  paymentInput: {
    color: '#888',
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  urlInput: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#0a0a0f',
    borderRadius: 8,
  },
});
