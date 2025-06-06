/**
 * Google Maps Style Presets for MapNest
 * Beautiful, curated map themes for different moods and use cases
 */

import type { MapStyleKey } from '../types';

// Validate map styles to ensure they're in the correct format for Google Maps API
const validateMapStyles = (styles: any[]) => {
  if (!Array.isArray(styles)) {
    console.error('Map styles must be an array');
    return [];
  }
  
  // Check if each style has the required properties
  return styles.map(style => {
    // Ensure each style has at least one of elementType or featureType
    if (!style.elementType && !style.featureType) {
      console.warn('Map style missing both elementType and featureType:', style);
    }
    
    // Ensure stylers is an array
    if (!Array.isArray(style.stylers)) {
      console.warn('Map style has invalid stylers (not an array):', style);
      style.stylers = [];
    }
    
    return style;
  });
};

export const mapStyles = {
  // Default Google Maps style
  default: validateMapStyles([]),

  // 🌌 Dark Nova - Deep dark theme with high-contrast neon elements
  darkNova: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
    { featureType: "road", stylers: [{ color: "#2c3e50" }] },
    { featureType: "water", stylers: [{ color: "#17263c" }] }
  ]),

  // 🍬 Pastel Pop - Light and colorful, inspired by candy tones
  pastelPop: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#fdf5f1" }] },
    { featureType: "water", stylers: [{ color: "#aee6f9" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#d28ab7" }] },
    { featureType: "road", stylers: [{ color: "#f7d9e3" }] }
  ]),

  // 🖤 Minimal Ink - Clean, black-and-white minimalistic look
  minimalInk: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#000000" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "road", stylers: [{ color: "#c0c0c0" }] }
  ]),

  // 🧬 Retro Wave - Muted and nostalgic, 80s-inspired
  retroWave: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
    { featureType: "road", stylers: [{ color: "#f5deb3" }] }
  ]),

  // 💜 Cyber Night - Inspired by synthwave and neon city vibes
  cyberNight: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#0f0c29" }] },
    { featureType: "road", stylers: [{ color: "#5f0f40" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#ff4ecd" }] },
    { featureType: "water", stylers: [{ color: "#2d0638" }] }
  ]),

  // ☕ Sepia Dust - Warm vintage tones and soft contrast
  sepiaDust: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#e9dac1" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#4a4238" }] },
    { featureType: "road", stylers: [{ color: "#d4c5a8" }] },
    { featureType: "water", stylers: [{ color: "#b5a992" }] }
  ]),

  // 🌊 Ocean Breeze - Cool blues and soft whites for coastal themes
  oceanBreeze: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#e0f7fa" }] },
    { featureType: "water", stylers: [{ color: "#0288d1" }] },
    { featureType: "road", stylers: [{ color: "#b3e5fc" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#006064" }] }
  ]),

  // 🌸 Sakura Blossom - Inspired by Japanese cherry blossoms
  sakuraBlossom: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#ffe4e1" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#d81b60" }] },
    { featureType: "road", stylers: [{ color: "#fce4ec" }] },
    { featureType: "water", stylers: [{ color: "#f8bbd0" }] }
  ]),

  // 🏜️ Desert Glow - Warm earthy tones with orange, tan, and muted red
  desertGlow: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#f5f0e1" }] },
    { featureType: "road", stylers: [{ color: "#e3c29b" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#a85b00" }] },
    { featureType: "water", stylers: [{ color: "#c2b280" }] }
  ]),

  // 🌌 Midnight Blues - Dark with cool blue accents
  midnightBlues: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#1e2a38" }] },
    { featureType: "water", stylers: [{ color: "#1a237e" }] },
    { featureType: "road", stylers: [{ color: "#3949ab" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#bbdefb" }] }
  ]),
  
  // 🌿 Forest Calm - Natural greens and earth tones
  forestCalm: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#e8f5e9" }] },
    { featureType: "water", stylers: [{ color: "#b9f6ca" }] },
    { featureType: "road", stylers: [{ color: "#c8e6c9" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#33691e" }] }
  ]),

  // 🌊 Ocean Blue - Calming blues and aqua tones
  oceanBlue: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#e3f2fd" }] },
    { featureType: "water", stylers: [{ color: "#0d47a1" }] },
    { featureType: "road", stylers: [{ color: "#bbdefb" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#1565c0" }] }
  ]),

  // 🔮 Mystic Purple - Deep purples and mystical vibes
  mysticPurple: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#ede7f6" }] },
    { featureType: "water", stylers: [{ color: "#9575cd" }] },
    { featureType: "road", stylers: [{ color: "#d1c4e9" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#4527a0" }] }
  ]),

  // 🍊 Citrus Zest - Bright and energetic orange tones
  citrusZest: validateMapStyles([
    { elementType: "geometry", stylers: [{ color: "#fff3e0" }] },
    { featureType: "water", stylers: [{ color: "#ffcc80" }] },
    { featureType: "road", stylers: [{ color: "#ffe0b2" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#e65100" }] }
  ])
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
  },
  forestCalm: {
    name: "Forest Calm",
    description: "Natural greens and earth tones",
    emoji: "🌿",
    category: "nature",
    isDark: false
  },
  oceanBlue: {
    name: "Ocean Blue",
    description: "Calming blues and aqua tones",
    emoji: "🌊",
    category: "nature",
    isDark: false
  },
  mysticPurple: {
    name: "Mystic Purple",
    description: "Deep purples and mystical vibes",
    emoji: "🔮",
    category: "colorful",
    isDark: false
  },
  citrusZest: {
    name: "Citrus Zest",
    description: "Bright and energetic orange tones",
    emoji: "🍊",
    category: "colorful",
    isDark: false
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

// Note: MapStyleKey type is imported from ../types