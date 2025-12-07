import React from 'react';
import { StyleSheet, Text, Pressable, Modal, ScrollView } from 'react-native';

export type SortOption = 'next' | 'name' | 'price-low' | 'price-high' | 'group-by';

interface SortPickerProps {
  visible: boolean;
  onClose: () => void;
  selected: SortOption;
  onSelect: (option: SortOption) => void;
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string; icon: string }> = [
  { value: 'next', label: 'Next', icon: '✓' },
  { value: 'name', label: 'Name', icon: '☰' },
  { value: 'price-low', label: 'Price (Low)', icon: '↓' },
  { value: 'price-high', label: 'Price (High)', icon: '↑' },
  { value: 'group-by', label: 'Group by', icon: '⋯' },
];

export function SortPicker({ visible, onClose, selected, onSelect }: SortPickerProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={e => e.stopPropagation()}>
          <ScrollView style={styles.scrollView}>
            {SORT_OPTIONS.map(option => (
              <Pressable
                key={option.value}
                style={styles.optionItem}
                onPress={() => {
                  if (option.value === 'group-by') {
                    // Handle group by sub-menu later
                    onSelect(option.value);
                  } else {
                    onSelect(option.value);
                    onClose();
                  }
                }}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text style={styles.optionText}>{option.label}</Text>
                {selected === option.value && <Text style={styles.checkmark}>✓</Text>}
                {option.value === 'group-by' && <Text style={styles.chevron}>›</Text>}
              </Pressable>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    width: '80%',
    maxWidth: 300,
    maxHeight: '60%',
    overflow: 'hidden',
  },
  scrollView: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0a0a0f',
  },
  optionIcon: {
    color: '#888',
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    color: '#6b46c1',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  chevron: {
    color: '#888',
    fontSize: 20,
    marginLeft: 8,
  },
});
