import React from 'react';
import { StyleSheet, Text, Pressable, Modal, ScrollView } from 'react-native';

interface NotificationPickerProps {
  visible: boolean;
  onClose: () => void;
  selected: string;
  options: readonly string[];
  onSelect: (option: string) => void;
}

export function NotificationPicker({
  visible,
  onClose,
  selected,
  options,
  onSelect,
}: NotificationPickerProps) {
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
            {options.map(option => (
              <Pressable
                key={option}
                style={styles.optionItem}
                onPress={() => onSelect(option)}
              >
                <Text style={styles.optionText}>
                  {option === 'none' ? 'None' : option}
                </Text>
                {selected === option && <Text style={styles.checkmark}>✓</Text>}
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
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0a0a0f',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  checkmark: {
    color: '#6b46c1',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
