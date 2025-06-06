import type { MapTheme, MapPin } from '@/types';

/**
 * Predefined map themes
 */
export const predefinedThemes: Record<string, MapTheme> = {
  default: {
    id: 'default',
    name: 'Default',
    styles: [],
    primaryColor: '#3B82F6',
    secondaryColor: '#93C5FD',
    pinColor: '#3B82F6',
    isDark: false
  },
  light: {
    id: 'light',
    name: 'Light',
    styles: [
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#dbeafe' }] },
      { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: '#f9fafb' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e5e7eb' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#d1fae5' }] },
    ],
    primaryColor: '#60A5FA',
    secondaryColor: '#BFDBFE',
    pinColor: '#2563EB',
    isDark: false
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    styles: [
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#d1d5db' }] },
      { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#1f2937' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#0f172a' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#374151' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#312e81' }] },
    ],
    primaryColor: '#4B5563',
    secondaryColor: '#9CA3AF',
    pinColor: '#6B7280',
    isDark: true
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    styles: [
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#713f12' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#fef3c7' }] },
      { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: '#fef2f2' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#fecaca' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#fed7aa' }] },
    ],
    primaryColor: '#F59E0B',
    secondaryColor: '#FCD34D',
    pinColor: '#D97706',
    isDark: false
  },
  aqua: {
    id: 'aqua',
    name: 'Aqua Pop',
    styles: [
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#0f766e' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#a5f3fc' }] },
      { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: '#f0fdfa' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ccfbf1' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#99f6e4' }] },
    ],
    primaryColor: '#06B6D4',
    secondaryColor: '#67E8F9',
    pinColor: '#0891B2',
    isDark: false
  },
  grayscale: {
    id: 'grayscale',
    name: 'Grayscale',
    styles: [
      { featureType: 'all', elementType: 'all', stylers: [{ saturation: -100 }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#e5e7eb' }] },
    ],
    primaryColor: '#6B7280',
    secondaryColor: '#9CA3AF',
    pinColor: '#4B5563',
    isDark: false
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    styles: [
      { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#1e3a8a' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#312e81' }] },
      { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#475569' }] },
    ],
    primaryColor: '#6366f1',
    secondaryColor: '#818cf8',
    pinColor: '#4f46e5',
    isDark: true
  },
  nature: {
    id: 'nature',
    name: 'Nature',
    styles: [
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#a5f3fc' }] },
      { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: '#d9f99d' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#fef3c7' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#86efac' }] },
      { featureType: 'poi.business', elementType: 'geometry', stylers: [{ color: '#fef08a' }] },
    ],
    primaryColor: '#16a34a',
    secondaryColor: '#4ade80',
    pinColor: '#15803d',
    isDark: false
  },
  retro: {
    id: 'retro',
    name: 'Retro',
    styles: [
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#fcd34d' }] },
      { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: '#fef3c7' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#fca5a5' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#bbf7d0' }] },
    ],
    primaryColor: '#f97316',
    secondaryColor: '#fb923c',
    pinColor: '#ea580c',
    isDark: false
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    styles: [
      { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#18181b' }] },
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#d4d4d8' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#0c4a6e' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#3b0764' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#4c1d95' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
    ],
    primaryColor: '#d946ef',
    secondaryColor: '#e879f9',
    pinColor: '#c026d3',
    isDark: true
  },
};

/**
 * Pin icon options
 */
export const pinIcons = [
  'default',
  'office',
  'store',
  'warehouse',
  'event',
  'workshop',
  'restaurant',
  'hotel',
  'attraction',
  'custom',
];

/**
 * Pin color options
 */
export const pinColors = [
  '#4f46e5', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#6b7280', // gray
  '#000000', // black
];

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`;
}

/**
 * Calculate distance between two points in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generate a random pin color
 */
export function getRandomPinColor(): string {
  return pinColors[Math.floor(Math.random() * pinColors.length)];
}

/**
 * Generate a sample pin
 */
export function generateSamplePin(index: number): Omit<MapPin, 'id'> {
  const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
  const lng = -74.006 + (Math.random() - 0.5) * 0.1;
  
  return {
    title: `Sample Location ${index + 1}`,
    description: `This is a sample location ${index + 1} for demonstration purposes.`,
    lat,
    lng,
    color: getRandomPinColor(),
    icon: pinIcons[Math.floor(Math.random() * (pinIcons.length - 1))],
  };
}

/**
 * Generate embed code for a map
 */
export function generateEmbedCode(
  mapId: string,
  options: {
    width?: string;
    height?: string;
    responsive?: boolean;
    showAttribution?: boolean;
    allowFullscreen?: boolean;
  } = {}
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mapnest.app';
  
  // Extract userId and mapId from composite mapId
  const [userId, actualMapId] = mapId.includes('_') ? mapId.split('_', 2) : ['user', mapId];
  const url = `${baseUrl}/${userId}/${actualMapId}?embed=true`;
  
  const width = options.width || '100%';
  const height = options.height || '500px';
  const allowFullscreen = options.allowFullscreen !== false ? 'allowfullscreen' : '';
  
  return `<iframe 
  src="${url}" 
  width="${width}" 
  height="${height}" 
  style="border:0;" 
  ${allowFullscreen} 
  loading="lazy" 
  referrerpolicy="no-referrer-when-downgrade">
</iframe>`;
}

/**
 * Generate script embed code for a map
 */
export function generateScriptEmbedCode(
  mapId: string,
  options: {
    width?: string;
    height?: string;
    responsive?: boolean;
  } = {}
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mapnest.app';
  const width = options.width || '100%';
  const height = options.height || '500px';
  const responsive = options.responsive !== false ? 'data-responsive="true"' : '';
  
  return `<div id="mapnest-${mapId}" style="width:${width};height:${height};"></div>
<script src="${baseUrl}/api/embed.js" data-mapid="${mapId}" ${responsive} async></script>`;
}