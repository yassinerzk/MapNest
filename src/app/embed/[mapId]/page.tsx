'use client';

import { useState, useEffect } from 'react';
import { MapWrapper } from '@/components/organisms/MapWrapper';
import { getThemeById, getDefaultTheme } from '@/lib/themeUtils';
import { mapDatabase } from '@/lib/database';
import type { MapPin, MapTheme, MapLayout } from '@/types';

interface EmbedPageProps {
  params: {
    mapId: string;
  };
  searchParams: {
    theme?: string;
    layout?: string;
    fullInterface?: string;
  };
}

export default function EmbedPage({ params, searchParams }: EmbedPageProps) {
  // Get API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  // State for map data
  const [pins, setPins] = useState<MapPin[]>([]);
  const [theme, setTheme] = useState<MapTheme>(getDefaultTheme());
  const [layout, setLayout] = useState<MapLayout>('fullscreen');
  const [embedOptions, setEmbedOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Load map data from database
  useEffect(() => {
    const loadMapData = async () => {
      try {
        const mapData = mapDatabase.getMap(params.mapId);
        
        if (mapData) {
          // Apply URL overrides first, then set state
          const finalTheme = searchParams.theme 
            ? getThemeById(searchParams.theme) || mapData.theme || getDefaultTheme()
            : mapData.theme || getDefaultTheme();
            
          const finalLayout = searchParams.layout && ['fullscreen', 'split', 'sidebar-right', 'floating-card', 'list-mode'].includes(searchParams.layout)
            ? searchParams.layout as MapLayout
            : mapData.layout || 'fullscreen';
          
          // Set all state synchronously to avoid timing issues
          setPins(mapData.pins || []);
          setTheme(finalTheme);
          setLayout(finalLayout);
          setEmbedOptions(mapData.embedOptions || {});
          
          console.log('EmbedPage: Map data loaded successfully', {
            mapId: params.mapId,
            themeName: finalTheme.name,
            themeId: finalTheme.id,
            layout: finalLayout,
            pinsCount: mapData.pins?.length || 0
          });
        } else {
          console.warn('EmbedPage: Map not found for mapId:', params.mapId, 'using default data');
          // Use default data if map not found, but still apply URL overrides
          const finalTheme = searchParams.theme 
            ? getThemeById(searchParams.theme) || getDefaultTheme()
            : getDefaultTheme();
            
          const finalLayout = searchParams.layout && ['fullscreen', 'split', 'sidebar-right', 'floating-card', 'list-mode'].includes(searchParams.layout)
            ? searchParams.layout as MapLayout
            : 'fullscreen';
            
          setPins([]);
          setTheme(finalTheme);
          setLayout(finalLayout);
        }
      } catch (error) {
        console.error('EmbedPage: Error loading map data:', error);
        // Fallback to defaults with URL overrides
        const finalTheme = searchParams.theme 
          ? getThemeById(searchParams.theme) || getDefaultTheme()
          : getDefaultTheme();
          
        const finalLayout = searchParams.layout && ['fullscreen', 'split', 'sidebar-right', 'floating-card', 'list-mode'].includes(searchParams.layout)
          ? searchParams.layout as MapLayout
          : 'fullscreen';
          
        setPins([]);
        setTheme(finalTheme);
        setLayout(finalLayout);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMapData();
  }, [params.mapId, searchParams.theme, searchParams.layout]);
  
  // Show error if API key is missing
  if (!apiKey) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Google Maps API Key Missing</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please add your Google Maps API key to the environment variables.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create a .env.local file with NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </p>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading map...</p>
        </div>
      </div>
    );
  }

  // Check if full interface should be shown
  const showFullInterface = searchParams.fullInterface === 'true';

  return (
    <div className="h-screen w-screen overflow-hidden">
      <MapWrapper
        initialPins={pins}
        initialTheme={theme}
        initialLayout={layout}
        initialEmbedOptions={embedOptions}
        mapId={params.mapId}
        apiKey={apiKey}
        readOnly={!showFullInterface}
      />
    </div>
  );
}