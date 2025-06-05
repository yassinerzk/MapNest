import type { MapTheme, MapPin } from '@/types';

/**
 * Predefined map themes
 */
export const predefinedThemes: Record<string, MapTheme> = {
  default: {
    name: 'Default',
    styles: [],
  },
  light: {
    name: 'Light',
    styles: [
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#dbeafe' }] },
      { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: '#f9fafb' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e5e7eb' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#d1fae5' }] },
    ],
  },
  dark: {
    name: 'Dark',
    styles: [
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#d1d5db' }] },
      { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#1f2937' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#0f172a' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#374151' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#312e81' }] },
    ],
  },
  sunset: {
    name: 'Sunset',
    styles: [
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#713f12' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#fef3c7' }] },
      { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: '#fef2f2' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#fecaca' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#fed7aa' }] },
    ],
  },
  aqua: {
    name: 'Aqua Pop',
    styles: [
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#0f766e' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#a5f3fc' }] },
      { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: '#f0fdfa' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ccfbf1' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#99f6e4' }] },
    ],
  },
  grayscale: {
    name: 'Grayscale',
    styles: [
      { featureType: 'all', elementType: 'all', stylers: [{ saturation: -100 }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#e5e7eb' }] },
    ],
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
  const url = `${baseUrl}/embed/${mapId}`;
  
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