/**
 * Google Maps Style Presets for MapNest
 * Beautiful, curated map themes for different moods and use cases
 */

import type { MapStyleKey } from '../types';

export const mapStyles = {
  // Default Google Maps style
  default: [],

  // 🌌 Dark Nova - Deep dark theme with high-contrast neon elements
  darkNova: [
    { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
    { featureType: "road", stylers: [{ color: "#2c3e50" }] },
    { featureType: "water", stylers: [{ color: "#17263c" }] }
  ],

  // 🍬 Pastel Pop - Light and colorful, inspired by candy tones
  pastelPop: [
    { elementType: "geometry", stylers: [{ color: "#fdf5f1" }] },
    { featureType: "water", stylers: [{ color: "#aee6f9" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#d28ab7" }] },
    { featureType: "road", stylers: [{ color: "#f7d9e3" }] }
  ],

  // 🖤 Minimal Ink - Clean, black-and-white minimalistic look
  minimalInk: [
    { elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#000000" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "road", stylers: [{ color: "#c0c0c0" }] }
  ],

  // 🧬 Retro Wave - Muted and nostalgic, 80s-inspired
  retroWave: [
    { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
    { featureType: "road", stylers: [{ color: "#f5deb3" }] }
  ],

  // 💜 Cyber Night - Inspired by synthwave and neon city vibes
  cyberNight: [
    { elementType: "geometry", stylers: [{ color: "#0f0c29" }] },
    { featureType: "road", stylers: [{ color: "#5f0f40" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#ff4ecd" }] },
    { featureType: "water", stylers: [{ color: "#2d0638" }] }
  ],

  // ☕ Sepia Dust - Warm vintage tones and soft contrast
  sepiaDust: [
    { elementType: "geometry", stylers: [{ color: "#f3ecd9" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#795548" }] },
    { featureType: "road", stylers: [{ color: "#e6ccb2" }] },
    { featureType: "water", stylers: [{ color: "#c8b8a0" }] }
  ],

  // 🌊 Ocean Breeze - Cool blues and soft whites for coastal themes
  oceanBreeze: [
    { elementType: "geometry", stylers: [{ color: "#e0f7fa" }] },
    { featureType: "water", stylers: [{ color: "#0288d1" }] },
    { featureType: "road", stylers: [{ color: "#b3e5fc" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#006064" }] }
  ],

  // 🌸 Sakura Blossom - Inspired by Japanese cherry blossoms
  sakuraBlossom: [
    { elementType: "geometry", stylers: [{ color: "#ffe4e1" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#d81b60" }] },
    { featureType: "road", stylers: [{ color: "#fce4ec" }] },
    { featureType: "water", stylers: [{ color: "#f8bbd0" }] }
  ],

  // 🏜️ Desert Glow - Warm earthy tones with orange, tan, and muted red
  desertGlow: [
    { elementType: "geometry", stylers: [{ color: "#f5f0e1" }] },
    { featureType: "road", stylers: [{ color: "#e3c29b" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#a85b00" }] },
    { featureType: "water", stylers: [{ color: "#c2b280" }] }
  ],

  // 🌌 Midnight Blues - Dark with cool blue accents
  midnightBlues: [
    { elementType: "geometry", stylers: [{ color: "#1e2a38" }] },
    { featureType: "water", stylers: [{ color: "#1a237e" }] },
    { featureType: "road", stylers: [{ color: "#3949ab" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#bbdefb" }] }
  ]
};

// Theme metadata for UI display
export const themeMetadata: Record<MapStyleKey, {
  name: string;
  description: string;
  emoji: string;
  category: 'standard' | 'dark' | 'colorful' | 'minimal' | 'vintage' | 'nature';
  isDark: boolean;
}> = {
  default: {
    name: "Default",
    description: "Google's standard map style",
    emoji: "🗺️",
    category: "standard",
    isDark: false
  },
  darkNova: {
    name: "Dark Nova",
    description: "Deep dark theme with neon elements",
    emoji: "🌌",
    category: "dark",
    isDark: true
  },
  pastelPop: {
    name: "Pastel Pop",
    description: "Light and colorful candy tones",
    emoji: "🍬",
    category: "colorful",
    isDark: false
  },
  minimalInk: {
    name: "Minimal Ink",
    description: "Clean black-and-white minimalism",
    emoji: "🖤",
    category: "minimal",
    isDark: false
  },
  retroWave: {
    name: "Retro Wave",
    description: "Muted 80s-inspired nostalgia",
    emoji: "🧬",
    category: "vintage",
    isDark: false
  },
  cyberNight: {
    name: "Cyber Night",
    description: "Synthwave and neon city vibes",
    emoji: "💜",
    category: "dark",
    isDark: true
  },
  sepiaDust: {
    name: "Sepia Dust",
    description: "Warm vintage tones",
    emoji: "☕",
    category: "vintage",
    isDark: false
  },
  oceanBreeze: {
    name: "Ocean Breeze",
    description: "Cool blues for coastal themes",
    emoji: "🌊",
    category: "nature",
    isDark: false
  },
  sakuraBlossom: {
    name: "Sakura Blossom",
    description: "Romantic cherry blossom inspired",
    emoji: "🌸",
    category: "nature",
    isDark: false
  },
  desertGlow: {
    name: "Desert Glow",
    description: "Warm earthy desert tones",
    emoji: "🏜️",
    category: "nature",
    isDark: false
  },
  midnightBlues: {
    name: "Midnight Blues",
    description: "Dark with cool blue accents",
    emoji: "🌌",
    category: "dark",
    isDark: true
  }
};

// Helper function to get theme by key
export function getThemeStyles(themeKey: keyof typeof mapStyles): google.maps.MapTypeStyle[] {
  return mapStyles[themeKey] || mapStyles.default;
}

// Helper function to get all theme keys
export function getAllThemeKeys(): (keyof typeof mapStyles)[] {
  return Object.keys(mapStyles) as (keyof typeof mapStyles)[];
}

// Helper function to get themes by category
export function getThemesByCategory(category: string) {
  return Object.entries(themeMetadata)
    .filter(([_, meta]) => meta.category === category)
    .map(([key, meta]) => ({ key, ...meta }));
}

// Export type for theme keys
export type MapStyleKey = keyof typeof mapStyles;