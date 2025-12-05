import React from 'react';
import { StyleSheet, Text, Pressable, Modal, ScrollView } from 'react-native';

interface CategoryPickerProps {
  visible: boolean;
  onClose: () => void;
  selected: string;
  categories: string[];
  onSelect: (category: string) => void;
}

export function CategoryPicker({
  visible,
  onClose,
  selected,
  categories,
  onSelect,
}: CategoryPickerProps) {
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
            {categories.map(category => (
              <Pressable
                key={category}
                style={styles.categoryItem}
                onPress={() => onSelect(category)}
              >
                <Text style={styles.categoryText}>{category}</Text>
                {selected === category && <Text style={styles.checkmark}>✓</Text>}
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
    maxHeight: '60%',
    overflow: 'hidden',
  },
  scrollView: {
    maxHeight: 400,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0a0a0f',
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
  },
  checkmark: {
    color: '#6b46c1',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
