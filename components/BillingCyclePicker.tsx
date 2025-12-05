import React from 'react';
import { StyleSheet, Text, View, Pressable, Modal, ScrollView } from 'react-native';

interface BillingCyclePickerProps {
  visible: boolean;
  onClose: () => void;
  quantity: number;
  cycle: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onSelect: (quantity: number, cycle: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
}

export function BillingCyclePicker({
  visible,
  onClose,
  quantity,
  cycle,
  onSelect,
}: BillingCyclePickerProps) {
  const quantities = [1, 2, 3, 4, 5, 6];
  const cycles: Array<'daily' | 'weekly' | 'monthly' | 'yearly'> = [
    'daily',
    'weekly',
    'monthly',
    'yearly',
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Billing Cycle</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.doneButton}>Done</Text>
            </Pressable>
          </View>

          <View style={styles.pickerContainer}>
            <ScrollView style={styles.quantityColumn}>
              {quantities.map(qty => (
                <Pressable
                  key={qty}
                  style={[styles.pickerItem, quantity === qty && styles.selectedItem]}
                  onPress={() => onSelect(qty, cycle)}
                >
                  <Text
                    style={[styles.pickerText, quantity === qty && styles.selectedText]}
                  >
                    {qty}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <ScrollView style={styles.cycleColumn}>
              {cycles.map(c => (
                <Pressable
                  key={c}
                  style={[styles.pickerItem, cycle === c && styles.selectedCycleItem]}
                  onPress={() => onSelect(quantity, c)}
                >
                  <Text
                    style={[styles.pickerText, cycle === c && styles.selectedCycleText]}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0a0a0f',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    color: '#6b46c1',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: 300,
  },
  quantityColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#0a0a0f',
  },
  cycleColumn: {
    flex: 1,
  },
  pickerItem: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: 'transparent',
  },
  selectedCycleItem: {
    backgroundColor: '#0a0a0f',
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  pickerText: {
    color: '#888',
    fontSize: 18,
  },
  selectedText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  selectedCycleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
