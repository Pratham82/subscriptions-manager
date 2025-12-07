import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { BRANDS, FALLBACK_BRAND, type Brand } from '@/data/brands';

interface LogoPickerProps {
  visible: boolean;
  onClose: () => void;
  selected?: string;
  onSelect: (brand: Brand | null) => void;
}

function BrandIcon({ brand }: { brand: Brand }) {
  const iconProps = {
    name: brand.icon as any,
    size: 24,
    color: '#fff', // Always white to show on colored backgrounds
  };

  switch (brand.iconType) {
    case 'FontAwesome':
      return <FontAwesome {...iconProps} />;
    case 'MaterialIcons':
      return <MaterialIcons {...iconProps} />;
    case 'Ionicons':
      return <Ionicons {...iconProps} />;
    case 'Entypo':
      return <Entypo {...iconProps} />;
    case 'Feather':
      return <Feather {...iconProps} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons {...iconProps} />;
    default:
      return <FontAwesome {...iconProps} />;
  }
}

export function LogoPicker({ visible, onClose, selected, onSelect }: LogoPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) {
      return BRANDS;
    }

    const query = searchQuery.toLowerCase().trim();
    return BRANDS.filter(
      brand =>
        brand.name.toLowerCase().includes(query) ||
        brand.searchTerms.some(term => term.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  const handleSelect = (brand: Brand) => {
    onSelect(brand);
    onClose();
    setSearchQuery('');
  };

  const handleClear = () => {
    onSelect(null);
    onClose();
    setSearchQuery('');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Add Logo</Text>
            <Pressable onPress={handleClear}>
              <Text style={styles.clearButton}>Clear</Text>
            </Pressable>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={16} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a logo"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} style={styles.clearIcon}>
                <MaterialIcons name="close" size={20} color="#888" />
              </Pressable>
            )}
          </View>

          {/* Results */}
          <ScrollView
            style={styles.resultsContainer}
            showsVerticalScrollIndicator={false}
          >
            {filteredBrands.length > 0 ? (
              filteredBrands.map(brand => (
                <Pressable
                  key={brand.name}
                  style={[
                    styles.brandItem,
                    selected === brand.name && styles.selectedBrandItem,
                  ]}
                  onPress={() => handleSelect(brand)}
                >
                  <View
                    style={[
                      styles.brandIconContainer,
                      { backgroundColor: brand.color || '#6b46c1' },
                    ]}
                  >
                    <BrandIcon brand={brand} />
                  </View>
                  <Text style={styles.brandName}>{brand.name}</Text>
                  {selected === brand.name && (
                    <MaterialIcons name="check-circle" size={24} color="#6b46c1" />
                  )}
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No brands found</Text>
                <Text style={styles.emptySubtext}>
                  Try searching with a different term or use the default icon
                </Text>
                <Pressable
                  style={styles.useDefaultButton}
                  onPress={() => handleSelect(FALLBACK_BRAND)}
                >
                  <View
                    style={[
                      styles.brandIconContainer,
                      { backgroundColor: FALLBACK_BRAND.color },
                    ]}
                  >
                    <BrandIcon brand={FALLBACK_BRAND} />
                  </View>
                  <Text style={styles.useDefaultText}>Use Default Icon</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    marginTop: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  cancelButton: {
    color: '#888',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    color: '#6b46c1',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  clearIcon: {
    padding: 4,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  brandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  selectedBrandItem: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    marginHorizontal: -12,
    marginVertical: 4,
  },
  brandIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#6b46c1',
  },
  brandName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  useDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  useDefaultText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});
