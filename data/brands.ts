// Brand definitions for subscription services
// Each brand has: name, icon (from @expo/vector-icons), iconType, and search terms
export type Brand = {
  name: string;
  icon: string;
  iconType:
    | 'FontAwesome'
    | 'MaterialIcons'
    | 'Ionicons'
    | 'Entypo'
    | 'Feather'
    | 'MaterialCommunityIcons';
  searchTerms: string[];
  color?: string;
};

export const BRANDS: Brand[] = [
  // Streaming Services
  {
    name: 'Netflix',
    icon: 'play-circle',
    iconType: 'FontAwesome',
    searchTerms: ['netflix', 'streaming', 'movies', 'tv'],
    color: '#E50914',
  },
  {
    name: 'Spotify',
    icon: 'spotify',
    iconType: 'FontAwesome',
    searchTerms: ['spotify', 'music', 'audio', 'streaming'],
    color: '#1DB954',
  },
  {
    name: 'Disney+',
    icon: 'play-circle',
    iconType: 'MaterialIcons',
    searchTerms: ['disney', 'disneyplus', 'streaming', 'movies'],
    color: '#113CCF',
  },
  {
    name: 'Amazon Prime',
    icon: 'amazon',
    iconType: 'FontAwesome',
    searchTerms: ['amazon', 'prime', 'shopping', 'streaming'],
    color: '#FF9900',
  },
  {
    name: 'Apple TV+',
    icon: 'tv',
    iconType: 'Ionicons',
    searchTerms: ['apple tv', 'appletv', 'streaming', 'apple'],
    color: '#000000',
  },
  {
    name: 'HBO Max',
    icon: 'play-circle',
    iconType: 'MaterialIcons',
    searchTerms: ['hbo', 'hbomax', 'streaming', 'movies'],
    color: '#8B50FF',
  },
  {
    name: 'Hulu',
    icon: 'play-circle',
    iconType: 'MaterialIcons',
    searchTerms: ['hulu', 'streaming', 'tv'],
    color: '#1CE783',
  },
  {
    name: 'YouTube Premium',
    icon: 'youtube',
    iconType: 'FontAwesome',
    searchTerms: ['youtube', 'youtube premium', 'video', 'streaming'],
    color: '#FF0000',
  },
  {
    name: 'Jio Hotstar',
    icon: 'play-circle',
    iconType: 'MaterialIcons',
    searchTerms: ['hotstar', 'jio', 'streaming', 'sports'],
    color: '#FF6B00',
  },

  // Productivity & Software
  {
    name: 'Apple One',
    icon: 'apple',
    iconType: 'FontAwesome',
    searchTerms: ['apple', 'apple one', 'icloud', 'productivity'],
    color: '#000000',
  },
  {
    name: 'Microsoft 365',
    icon: 'microsoft',
    iconType: 'FontAwesome',
    searchTerms: ['microsoft', 'office', '365', 'productivity'],
    color: '#00A4EF',
  },
  {
    name: 'Adobe Creative Cloud',
    icon: 'adobe',
    iconType: 'MaterialCommunityIcons',
    searchTerms: ['adobe', 'creative cloud', 'photoshop', 'design'],
    color: '#FF0000',
  },
  {
    name: 'Notion',
    icon: 'notebook',
    iconType: 'MaterialCommunityIcons',
    searchTerms: ['notion', 'productivity', 'notes', 'workspace'],
    color: '#000000',
  },
  {
    name: 'Evernote',
    icon: 'note',
    iconType: 'MaterialIcons',
    searchTerms: ['evernote', 'notes', 'productivity'],
    color: '#00A82D',
  },
  {
    name: 'Dropbox',
    icon: 'dropbox',
    iconType: 'FontAwesome',
    searchTerms: ['dropbox', 'storage', 'cloud', 'backup'],
    color: '#0061FF',
  },
  {
    name: 'Google Drive',
    icon: 'google-drive',
    iconType: 'MaterialCommunityIcons',
    searchTerms: ['google drive', 'storage', 'cloud', 'google'],
    color: '#4285F4',
  },
  {
    name: 'iCloud',
    icon: 'cloud',
    iconType: 'MaterialIcons',
    searchTerms: ['icloud', 'apple', 'storage', 'cloud'],
    color: '#007AFF',
  },
  {
    name: 'OneDrive',
    icon: 'onedrive',
    iconType: 'MaterialCommunityIcons',
    searchTerms: ['onedrive', 'microsoft', 'storage', 'cloud'],
    color: '#0078D4',
  },

  // Communication
  {
    name: 'Slack',
    icon: 'slack',
    iconType: 'FontAwesome',
    searchTerms: ['slack', 'communication', 'team', 'work'],
    color: '#4A154B',
  },
  {
    name: 'Zoom',
    icon: 'video-camera',
    iconType: 'FontAwesome',
    searchTerms: ['zoom', 'video', 'meeting', 'conference'],
    color: '#2D8CFF',
  },
  {
    name: 'Discord',
    icon: 'discord',
    iconType: 'MaterialCommunityIcons',
    searchTerms: ['discord', 'chat', 'gaming', 'communication'],
    color: '#5865F2',
  },

  // Fitness & Health
  {
    name: 'Peloton',
    icon: 'bicycle',
    iconType: 'MaterialCommunityIcons',
    searchTerms: ['peloton', 'fitness', 'exercise', 'bike'],
    color: '#000000',
  },
  {
    name: 'Strava',
    icon: 'run',
    iconType: 'MaterialCommunityIcons',
    searchTerms: ['strava', 'fitness', 'running', 'cycling'],
    color: '#FC4C02',
  },
  {
    name: 'MyFitnessPal',
    icon: 'food-apple',
    iconType: 'MaterialCommunityIcons',
    searchTerms: ['myfitnesspal', 'fitness', 'health', 'diet'],
    color: '#FF6B6B',
  },

  // News & Media
  {
    name: 'The New York Times',
    icon: 'newspaper-o',
    iconType: 'FontAwesome',
    searchTerms: ['nytimes', 'new york times', 'news', 'newspaper'],
    color: '#000000',
  },
  {
    name: 'The Wall Street Journal',
    icon: 'newspaper-o',
    iconType: 'FontAwesome',
    searchTerms: ['wsj', 'wall street journal', 'news', 'finance'],
    color: '#0074C1',
  },
  {
    name: 'Medium',
    icon: 'medium',
    iconType: 'FontAwesome',
    searchTerms: ['medium', 'articles', 'reading', 'blog'],
    color: '#000000',
  },

  // Shopping
  {
    name: 'Costco',
    icon: 'shopping-cart',
    iconType: 'FontAwesome',
    searchTerms: ['costco', 'shopping', 'wholesale', 'membership'],
    color: '#E31837',
  },

  // Gaming
  {
    name: 'PlayStation Plus',
    icon: 'gamepad',
    iconType: 'FontAwesome',
    searchTerms: ['playstation', 'ps plus', 'gaming', 'sony'],
    color: '#003087',
  },
  {
    name: 'Xbox Game Pass',
    icon: 'xbox',
    iconType: 'FontAwesome',
    searchTerms: ['xbox', 'game pass', 'gaming', 'microsoft'],
    color: '#107C10',
  },
  {
    name: 'Nintendo Switch Online',
    icon: 'gamepad',
    iconType: 'MaterialIcons',
    searchTerms: ['nintendo', 'switch', 'gaming'],
    color: '#E60012',
  },

  // Food & Delivery
  {
    name: 'Uber Eats',
    icon: 'utensils',
    iconType: 'FontAwesome',
    searchTerms: ['uber eats', 'food', 'delivery', 'uber'],
    color: '#06C167',
  },
  {
    name: 'DoorDash',
    icon: 'utensils',
    iconType: 'FontAwesome',
    searchTerms: ['doordash', 'food', 'delivery'],
    color: '#FF3008',
  },
  {
    name: 'Grubhub',
    icon: 'utensils',
    iconType: 'FontAwesome',
    searchTerms: ['grubhub', 'food', 'delivery'],
    color: '#F63440',
  },

  // Utilities
  {
    name: 'VPN',
    icon: 'shield',
    iconType: 'MaterialIcons',
    searchTerms: ['vpn', 'security', 'privacy'],
    color: '#4A90E2',
  },
  {
    name: '1Password',
    icon: 'lock',
    iconType: 'MaterialIcons',
    searchTerms: ['1password', 'password', 'security'],
    color: '#0094F5',
  },
  {
    name: 'LastPass',
    icon: 'lock',
    iconType: 'MaterialIcons',
    searchTerms: ['lastpass', 'password', 'security'],
    color: '#D32D27',
  },
];

// Fallback icon for brands that don't exist
export const FALLBACK_BRAND: Brand = {
  name: 'Default',
  icon: 'circle',
  iconType: 'FontAwesome',
  searchTerms: [],
  color: '#6b46c1',
};
