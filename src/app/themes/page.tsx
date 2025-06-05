'use client';

import { useState } from 'react';
import { ThemePicker } from '@/components/organisms/ThemePicker';
import { MapContainer } from '@/components/molecules/MapContainer';
import { getDefaultTheme } from '@/lib/themeUtils';
import type { MapTheme, MapPin } from '@/types';

// Sample pins for demonstration
const samplePins: MapPin[] = [
  {
    id: '1',
    lat: 40.7589,
    lng: -73.9851,
    title: 'Times Square',
    description: 'The heart of NYC',
    color: '#EA4335'
  },
  {
    id: '2',
    lat: 40.7505,
    lng: -73.9934,
    title: 'Empire State Building',
    description: 'Iconic NYC skyscraper',
    color: '#4285F4'
  },
  {
    id: '3',
    lat: 40.7614,
    lng: -73.9776,
    title: 'Central Park',
    description: 'Green oasis in Manhattan',
    color: '#34A853'
  }
];

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState<MapTheme>(getDefaultTheme());
  const [showMap, setShowMap] = useState(true);

  // Get API key from environment
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                🎨 MapNest Theme Gallery
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Explore our beautiful collection of map themes and see them in action
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMap(!showMap)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {showMap ? '🎨 Theme Picker Only' : '🗺️ Show Live Preview'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showMap ? (
          /* Split View: Theme Picker + Live Map Preview */
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Theme Picker */}
            <div className="space-y-6">
              <ThemePicker
                currentTheme={selectedTheme}
                onThemeChange={setSelectedTheme}
                showSearch={true}
                showRecommendations={true}
                layout="grid"
              />
            </div>

            {/* Live Map Preview */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    🗺️ Live Preview: {selectedTheme.name}
                    {selectedTheme.emoji && (
                      <span className="ml-2 text-xl">{selectedTheme.emoji}</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedTheme.description || 'See how your selected theme looks on a real map'}
                  </p>
                </div>
                
                <div className="h-96">
                  {apiKey ? (
                    <MapContainer
                      apiKey={apiKey}
                      pins={samplePins}
                      theme={selectedTheme}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <div className="text-center">
                        <div className="text-4xl mb-4">🗺️</div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Google Maps API key required for live preview
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                          Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Theme Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Theme Details
                </h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Theme ID
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {selectedTheme.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {selectedTheme.category || 'Standard'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Color Palette
                    </label>
                    <div className="flex space-x-4">
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded-lg border-2 border-white dark:border-gray-800 shadow-md mb-2" 
                          style={{ backgroundColor: selectedTheme.pinColor }}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pin</p>
                        <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                          {selectedTheme.pinColor}
                        </p>
                      </div>
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded-lg border-2 border-white dark:border-gray-800 shadow-md mb-2" 
                          style={{ backgroundColor: selectedTheme.primaryColor }}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Primary</p>
                        <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                          {selectedTheme.primaryColor}
                        </p>
                      </div>
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded-lg border-2 border-white dark:border-gray-800 shadow-md mb-2" 
                          style={{ backgroundColor: selectedTheme.secondaryColor }}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Secondary</p>
                        <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                          {selectedTheme.secondaryColor}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Theme Type
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedTheme.isDark 
                          ? 'bg-gray-800 text-gray-300 border border-gray-700'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {selectedTheme.isDark ? '🌙 Dark Theme' : '☀️ Light Theme'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Full Width Theme Picker */
          <ThemePicker
            currentTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
            showSearch={true}
            showRecommendations={true}
            layout="grid"
          />
        )}
      </div>
    </div>
  );
}