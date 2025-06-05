'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { MapTheme } from '@/types';
import { 
  getAllThemes, 
  getThemesByCategory, 
  getDarkThemes, 
  getLightThemes,
  getRecommendedThemes,
  getDefaultTheme 
} from '@/lib/themeUtils';
import { ThemePreview } from '@/components/molecules/ThemePreview';

interface ThemePickerProps {
  currentTheme?: MapTheme;
  onThemeChange: (theme: MapTheme) => void;
  className?: string;
  showSearch?: boolean;
  showRecommendations?: boolean;
  layout?: 'grid' | 'list';
}

export function ThemePicker({
  currentTheme,
  onThemeChange,
  className,
  showSearch = true,
  showRecommendations = true,
  layout = 'grid'
}: ThemePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'dark' | 'light'>('all');
  
  const selectedTheme = currentTheme || getDefaultTheme();
  
  // Categories for filtering
  const categories = [
    { key: 'all', name: 'All Themes', emoji: '🎨', count: 0 },
    { key: 'standard', name: 'Standard', emoji: '🗺️', count: 0 },
    { key: 'dark', name: 'Dark', emoji: '🌙', count: 0 },
    { key: 'colorful', name: 'Colorful', emoji: '🌈', count: 0 },
    { key: 'minimal', name: 'Minimal', emoji: '⚪', count: 0 },
    { key: 'vintage', name: 'Vintage', emoji: '📸', count: 0 },
    { key: 'nature', name: 'Nature', emoji: '🌿', count: 0 }
  ];

  // Filter themes based on search, category, and dark/light filter
  const filteredThemes = useMemo(() => {
    let themes = getAllThemes();
    
    // Apply dark/light filter
    if (selectedFilter === 'dark') {
      themes = getDarkThemes();
    } else if (selectedFilter === 'light') {
      themes = getLightThemes();
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      themes = themes.filter(theme => theme.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      themes = themes.filter(theme => 
        theme.name.toLowerCase().includes(query) ||
        theme.description?.toLowerCase().includes(query) ||
        theme.category?.toLowerCase().includes(query)
      );
    }
    
    return themes;
  }, [searchQuery, selectedCategory, selectedFilter]);

  // Update category counts
  const categoriesWithCounts = useMemo(() => {
    const allThemes = getAllThemes();
    return categories.map(category => ({
      ...category,
      count: category.key === 'all' 
        ? allThemes.length 
        : allThemes.filter(theme => theme.category === category.key).length
    }));
  }, []);

  // Recommended themes
  const recommendedThemes = useMemo(() => {
    if (!showRecommendations) return [];
    return {
      business: getRecommendedThemes('business'),
      travel: getRecommendedThemes('travel'),
      creative: getRecommendedThemes('creative'),
      minimal: getRecommendedThemes('minimal')
    };
  }, [showRecommendations]);

  return (
    <div className={cn('w-full max-w-6xl mx-auto', className)}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Choose Your Map Theme
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select from our collection of beautiful map styles to match your brand and use case.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        {showSearch && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search themes by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4">
          {/* Dark/Light Filter */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['all', 'light', 'dark'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  selectedFilter === filter
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                {filter === 'all' ? 'All' : filter === 'light' ? '☀️ Light' : '🌙 Dark'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categoriesWithCounts.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  selectedCategory === category.key
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
                <span className="text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Themes */}
      {showRecommendations && searchQuery === '' && selectedCategory === 'all' && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recommended for You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(recommendedThemes).map(([useCase, themes]) => (
              <div key={useCase} className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {useCase === 'business' ? '💼 Business' : 
                   useCase === 'travel' ? '✈️ Travel' :
                   useCase === 'creative' ? '🎨 Creative' : '⚪ Minimal'}
                </h4>
                <div className="space-y-2">
                  {themes.slice(0, 2).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => onThemeChange(theme)}
                      className={cn(
                        'w-full p-2 rounded-lg border text-left transition-all duration-200',
                        theme.id === selectedTheme.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: theme.pinColor }}
                        />
                        <span className="text-sm font-medium">{theme.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Theme Grid/List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {searchQuery ? `Search Results (${filteredThemes.length})` : 
             selectedCategory === 'all' ? `All Themes (${filteredThemes.length})` :
             `${categories.find(c => c.key === selectedCategory)?.name} Themes (${filteredThemes.length})`}
          </h3>
        </div>

        {filteredThemes.length > 0 ? (
          <div className={cn(
            layout === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-3'
          )}>
            {filteredThemes.map((theme) => (
              <ThemePreview
                key={theme.id}
                theme={theme}
                isSelected={theme.id === selectedTheme.id}
                onClick={() => onThemeChange(theme)}
                showDetails={layout === 'grid'}
                className={layout === 'list' ? 'flex items-center space-x-4 p-3' : ''}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No themes found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedFilter('all');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Current Selection Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600" 
              style={{ 
                background: `linear-gradient(135deg, ${selectedTheme.pinColor}, ${selectedTheme.primaryColor})` 
              }}
            />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Current Theme: {selectedTheme.name}
              </h4>
              {selectedTheme.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedTheme.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedTheme.emoji && (
              <span className="text-2xl">{selectedTheme.emoji}</span>
            )}
            <div className="flex space-x-1">
              <div 
                className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" 
                style={{ backgroundColor: selectedTheme.pinColor }}
                title="Pin Color"
              />
              <div 
                className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" 
                style={{ backgroundColor: selectedTheme.primaryColor }}
                title="Primary Color"
              />
              <div 
                className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" 
                style={{ backgroundColor: selectedTheme.secondaryColor }}
                title="Secondary Color"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}