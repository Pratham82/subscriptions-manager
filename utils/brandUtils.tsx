import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ReactElement } from 'react';

import { Brand, BRANDS } from '@/data/brands';

// Map brand names to their domains for logo fetching
const BRAND_DOMAINS: Record<string, string> = {
  Netflix: 'netflix.com',
  Spotify: 'spotify.com',
  'Disney+': 'disney.com',
  'Amazon Prime': 'amazon.com',
  'Apple TV+': 'apple.com',
  'HBO Max': 'hbomax.com',
  Hulu: 'hulu.com',
  'YouTube Premium': 'youtube.com',
  'Jio Hotstar': 'hotstar.com',
  'Apple One': 'apple.com',
  'Microsoft 365': 'microsoft.com',
  'Adobe Creative Cloud': 'adobe.com',
  Notion: 'notion.so',
  Evernote: 'evernote.com',
  Dropbox: 'dropbox.com',
  'Google Drive': 'drive.google.com',
  iCloud: 'icloud.com',
  OneDrive: 'onedrive.live.com',
  Slack: 'slack.com',
  Zoom: 'zoom.us',
  Discord: 'discord.com',
  Peloton: 'onepeloton.com',
  Strava: 'strava.com',
  MyFitnessPal: 'myfitnesspal.com',
  'The New York Times': 'nytimes.com',
  'The Wall Street Journal': 'wsj.com',
  Medium: 'medium.com',
  Costco: 'costco.com',
  'PlayStation Plus': 'playstation.com',
  'Xbox Game Pass': 'xbox.com',
  'Nintendo Switch Online': 'nintendo.com',
  'Uber Eats': 'ubereats.com',
  DoorDash: 'doordash.com',
  Grubhub: 'grubhub.com',
  VPN: 'vpn.com',
  '1Password': '1password.com',
  LastPass: 'lastpass.com',
};

export function getBrandByName(name: string | undefined): Brand | null {
  if (!name) return null;
  return BRANDS.find(b => b.name === name) || null;
}

/**
 * Get the logo URL for a brand using Clearbit Logo API
 * Falls back to a generic logo service if domain not found
 */
export function getBrandLogoUrl(brandName: string | undefined): string | null {
  if (!brandName) return null;

  const domain = BRAND_DOMAINS[brandName];
  if (domain) {
    return `https://logo.clearbit.com/${domain}`;
  }

  // Fallback: try to construct domain from brand name
  const sanitized = brandName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (sanitized) {
    return `https://logo.clearbit.com/${sanitized}.com`;
  }

  return null;
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
