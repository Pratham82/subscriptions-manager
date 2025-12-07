import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';

import { useSubscriptionStore } from '@/store/subscriptionStore';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';

export default function SettingsScreen() {
  const { subscriptions } = useSubscriptionStore();
  const { session } = useAuth();
  const activeCount = subscriptions.filter(sub => sub.isActive).length;
  const cancelledCount = subscriptions.filter(sub => !sub.isActive).length;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{cancelledCount}</Text>
            <Text style={styles.statLabel}>Cancelled</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{subscriptions.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <Pressable style={styles.option}>
            <Text style={styles.optionText}>Currency</Text>
            <Text style={styles.optionValue}>₹ INR</Text>
          </Pressable>
          <Pressable style={styles.option}>
            <Text style={styles.optionText}>Theme</Text>
            <Text style={styles.optionValue}>Dark</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <Pressable style={styles.option}>
            <Text style={styles.optionText}>Export Data</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
          <Pressable style={styles.option}>
            <Text style={styles.optionText}>Import Data</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.option}>
            <Text style={styles.optionText}>Version</Text>
            <Text style={styles.optionValue}>1.0.0</Text>
          </View>
        </View>

        {session && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <Pressable
              style={[styles.option, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Sign Out</Text>
            </Pressable>
          </View>
        )}
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
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  optionValue: {
    color: '#888',
    fontSize: 14,
  },
  chevron: {
    color: '#888',
    fontSize: 24,
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
