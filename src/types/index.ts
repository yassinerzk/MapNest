/**
 * Core type definitions for MapNest
 */

/**
 * Map Pin/Marker definition
 */
export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  icon?: string; // URL or icon name
  color?: string; // Tailwind color or hex
  category?: string;
  imageUrl?: string;
  url?: string; // Optional link when pin is clicked
  isActive?: boolean;
  animation?: 'drop' | 'bounce' | 'none';
}

/**
 * Map Theme definition
 */
export interface MapTheme {
  id: string;
  name: string;
  styles: google.maps.MapTypeStyle[];
  primaryColor: string; // Tailwind color
  secondaryColor: string; // Tailwind color
  pinColor: string; // Default pin color
  isDark: boolean;
}

/**
 * Map Layout options
 */
export type MapLayout = 
  | 'fullscreen' // Map takes full container
  | 'split' // Sidebar on left, map on right
  | 'sidebar-right' // Sidebar on right, map on left
  | 'floating-card' // Map with floating card overlay
  | 'list-mode'; // List view with small map preview

/**
 * Map Configuration
 */
export interface MapConfig {
  id: string;
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  theme: MapTheme | string; // Theme object or theme ID
  layout: MapLayout;
  pins: MapPin[];
  showSearch?: boolean;
  showZoomControls?: boolean;
  showFullscreenControl?: boolean;
  clusterPins?: boolean;
  fitBoundsToMarkers?: boolean;
  sidebarWidth?: number; // Width in pixels or percentage
  borderRadius?: string; // CSS border-radius value
  glassmorphism?: boolean; // Apply glass effect to UI elements
}

/**
 * Embed Code Options
 */
export interface EmbedOptions {
  mapId: string;
  width: string; // CSS width value
  height: string; // CSS height value
  responsive: boolean;
  showAttribution: boolean;
  allowFullscreen: boolean;
}

/**
 * User Theme Preferences
 */
export interface UserThemePreference {
  colorMode: 'light' | 'dark' | 'system';
  accentColor: string; // Tailwind color
}