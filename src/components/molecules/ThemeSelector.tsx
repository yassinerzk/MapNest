'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { MapTheme } from '@/types';
import { getAllThemes, getThemesByCategory, getDefaultTheme } from '@/lib/themeUtils';

interface ThemeSelectorProps {
  currentTheme?: MapTheme;
  onThemeChange: (theme: MapTheme) => void;
  className?: string;
}

export function ThemeSelector({
  currentTheme,
  onThemeChange,
  className,
}: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Get all themes
  const allThemes = getAllThemes();
  
  // Filter themes by category
  const filteredThemes = selectedCategory === 'all' 
    ? allThemes 
    : getThemesByCategory(selectedCategory);
  
  // Use current theme or default
  const selectedTheme = currentTheme || getDefaultTheme();
  
  // Categories for filtering
  const categories = [
    { key: 'all', name: 'All Themes', emoji: '🎨' },
    { key: 'standard', name: 'Standard', emoji: '🗺️' },
    { key: 'dark', name: 'Dark', emoji: '🌙' },
    { key: 'colorful', name: 'Colorful', emoji: '🌈' },
    { key: 'minimal', name: 'Minimal', emoji: '⚪' },
    { key: 'vintage', name: 'Vintage', emoji: '📸' },
    { key: 'nature', name: 'Nature', emoji: '🌿' }
  ];

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        className="flex items-center space-x-2 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-2" 
            style={{ backgroundColor: selectedTheme.primaryColor }}
            aria-hidden="true"
          />
          <span>{selectedTheme.name}</span>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={cn(
            'transition-transform',
            isOpen ? 'transform rotate-180' : ''
          )}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="theme-selector"
        >
          <div className="py-1" role="none">
            {filteredThemes.map((theme) => (
              <button
                key={theme.id}
                className={cn(
                  'flex items-center w-full text-left px-4 py-2 text-sm',
                  theme.id === selectedTheme.id
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
                role="menuitem"
                onClick={() => {
                onThemeChange(theme);
                setIsOpen(false);
              }}
              >
                <div 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: theme.pinColor }}
                  aria-hidden="true"
                />
                <div className="flex-1">{theme.name}</div>
                {theme.id === selectedTheme.id && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}