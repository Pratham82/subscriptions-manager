import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ReactElement } from 'react';

import { Brand, BRANDS } from '@/data/brands';

export function getBrandByName(name: string | undefined): Brand | null {
  if (!name) return null;
  return BRANDS.find(b => b.name === name) || null;
}

export function renderBrandIcon(
  brand: Brand | null,
  size: number = 24,
  color: string = '#fff',
): ReactElement | null {
  if (!brand) return null;

  const iconProps = {
    name: brand.icon as any,
    size,
    color,
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

