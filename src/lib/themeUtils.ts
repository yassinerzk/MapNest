/**
 * Theme utilities for MapNest
 * Converts map styles to MapTheme objects and provides theme management functions
 */

import { mapStyles, themeMetadata } from '@/themes/mapStyles';
import type { MapTheme, MapStyleKey } from '@/types';

/**
 * Color palettes for each theme to determine pin colors and UI colors
 */
const themeColorPalettes = {
  default: {
    primaryColor: 'blue-600',
    secondaryColor: 'gray-600',
    pinColor: '#EA4335' // Google's red
  },
  darkNova: {
    primaryColor: 'cyan-400',
    secondaryColor: 'slate-300',
    pinColor: '#8ec3b9'
  },
  pastelPop: {
    primaryColor: 'pink-400',
    secondaryColor: 'purple-300',
    pinColor: '#d28ab7'
  },
  minimalInk: {
    primaryColor: 'gray-900',
    secondaryColor: 'gray-600',
    pinColor: '#000000'
  },
  retroWave: {
    primaryColor: 'amber-600',
    secondaryColor: 'orange-400',
    pinColor: '#523735'
  },
  cyberNight: {
    primaryColor: 'fuchsia-400',
    secondaryColor: 'purple-400',
    pinColor: '#ff4ecd'
  },
  sepiaDust: {
    primaryColor: 'amber-700',
    secondaryColor: 'orange-600',
    pinColor: '#4a4238'
  },
  oceanBreeze: {
    primaryColor: 'blue-600',
    secondaryColor: 'cyan-500',
    pinColor: '#006064'
  },
  sakuraBlossom: {
    primaryColor: 'pink-600',
    secondaryColor: 'rose-400',
    pinColor: '#d81b60'
  },
  desertGlow: {
    primaryColor: 'orange-600',
    secondaryColor: 'amber-500',
    pinColor: '#a85b00'
  },
  midnightBlues: {
    primaryColor: 'blue-400',
    secondaryColor: 'indigo-300',
    pinColor: '#bbdefb'
  },
  forestCalm: {
    primaryColor: 'green-600',
    secondaryColor: 'emerald-400',
    pinColor: '#33691e'
  },
  oceanBlue: {
    primaryColor: 'blue-700',
    secondaryColor: 'blue-400',
    pinColor: '#1565c0'
  },
  mysticPurple: {
    primaryColor: 'purple-600',
    secondaryColor: 'violet-400',
    pinColor: '#4527a0'
  },
  citrusZest: {
    primaryColor: 'orange-500',
    secondaryColor: 'amber-400',
    pinColor: '#e65100'
  }
};

/**
 * Convert a map style key to a complete MapTheme object
 * Creates a deep clone to prevent object reference issues
 */
export function createThemeFromStyle(styleKey: MapStyleKey): MapTheme {
  const metadata = themeMetadata[styleKey];
  const colors = themeColorPalettes[styleKey];
  const styles = mapStyles[styleKey];

  // Create a deep clone of the theme object to prevent mutation issues
  const theme = {
    id: styleKey,
    name: metadata.name,
    description: metadata.description,
    emoji: metadata.emoji,
    category: metadata.category,
    styles: JSON.parse(JSON.stringify(styles)), // Deep clone styles array
    primaryColor: colors.primaryColor,
    secondaryColor: colors.secondaryColor,
    pinColor: colors.pinColor,
    isDark: metadata.isDark
  };

  console.log('ThemeUtils: Created theme:', { styleKey, theme });
  return theme;
}

/**
 * Get all available themes as MapTheme objects
 */
export function getAllThemes(): MapTheme[] {
  return Object.keys(mapStyles).map(key => 
    createThemeFromStyle(key as MapStyleKey)
  );
}

/**
 * Get themes filtered by category
 */
export function getThemesByCategory(category: string): MapTheme[] {
  return getAllThemes().filter(theme => theme.category === category);
}

/**
 * Get dark themes only
 */
export function getDarkThemes(): MapTheme[] {
  return getAllThemes().filter(theme => theme.isDark);
}

/**
 * Get light themes only
 */
export function getLightThemes(): MapTheme[] {
  return getAllThemes().filter(theme => !theme.isDark);
}

/**
 * Find theme by ID
 */
export function getThemeById(id: string): MapTheme | undefined {
  if (id in mapStyles) {
    return createThemeFromStyle(id as MapStyleKey);
  }
  return undefined;
}

/**
 * Get a random theme
 */
export function getRandomTheme(): MapTheme {
  const themes = getAllThemes();
  const randomIndex = Math.floor(Math.random() * themes.length);
  return themes[randomIndex];
}

/**
 * Get theme recommendations based on use case
 */
export function getRecommendedThemes(useCase: 'business' | 'travel' | 'creative' | 'minimal'): MapTheme[] {
  switch (useCase) {
    case 'business':
      return [getThemeById('default')!, getThemeById('minimalInk')!, getThemeById('oceanBreeze')!];
    case 'travel':
      return [getThemeById('sakuraBlossom')!, getThemeById('oceanBreeze')!, getThemeById('desertGlow')!];
    case 'creative':
      return [getThemeById('pastelPop')!, getThemeById('cyberNight')!, getThemeById('retroWave')!];
    case 'minimal':
      return [getThemeById('minimalInk')!, getThemeById('sepiaDust')!, getThemeById('default')!];
    default:
      return getAllThemes().slice(0, 3);
  }
}

/**
 * Check if a theme works well with a specific pin color
 */
export function isThemeCompatibleWithPinColor(theme: MapTheme, pinColor: string): boolean {
  // Simple contrast check - in a real app you might want more sophisticated color theory
  if (theme.isDark) {
    // Dark themes work better with bright pin colors
    const brightColors = ['#ff4ecd', '#8ec3b9', '#bbdefb', '#d28ab7'];
    return brightColors.some(color => color.toLowerCase() === pinColor.toLowerCase());
  } else {
    // Light themes work better with darker pin colors
    const darkColors = ['#000000', '#523735', '#795548', '#006064', '#d81b60', '#a85b00'];
    return darkColors.some(color => color.toLowerCase() === pinColor.toLowerCase());
  }
}

/**
 * Get the default theme (fallback)
 */
export function getDefaultTheme(): MapTheme {
  return createThemeFromStyle('default');
}

/**
 * Validate if a theme object is complete
 */
export function isValidTheme(theme: any): theme is MapTheme {
  return (
    theme &&
    typeof theme.id === 'string' &&
    typeof theme.name === 'string' &&
    Array.isArray(theme.styles) &&
    typeof theme.primaryColor === 'string' &&
    typeof theme.secondaryColor === 'string' &&
    typeof theme.pinColor === 'string' &&
    typeof theme.isDark === 'boolean'
  );
}