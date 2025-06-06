'use client';

import { useState, useEffect } from 'react';
import { MapWrapper } from '@/components/organisms/MapWrapper';
import { getDefaultTheme } from '@/lib/themeUtils';
import { mapDatabase } from '@/lib/database';
import type { MapPin, MapTheme, MapLayout } from '@/types';

interface MapPageProps {
  params: {
    userId: string;
    mapId: string;
  };
  searchParams: {
    embed?: string;
    fullInterface?: string;
  };
}

export default function MapPage({ params, searchParams }: MapPageProps) {
  // Get API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  // State for map data
  const [pins, setPins] = useState<MapPin[]>([]);
  const [theme, setTheme] = useState<MapTheme>(getDefaultTheme());
  const [layout, setLayout] = useState<MapLayout>('fullscreen');
  const [embedOptions, setEmbedOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [mapNotFound, setMapNotFound] = useState(false);
  
  // Check if this is an embed view
  const isEmbedView = searchParams.embed === 'true';
  const showFullInterface = searchParams.fullInterface === 'true';
  
  // Load map data from database using the clean URL structure
  useEffect(() => {
    const loadMapData = async () => {
      try {
        setIsLoading(true);
        
        // Get map data from database using userId and mapId
        const mapData = mapDatabase.getMapByUserAndId(params.userId, params.mapId);
        
        if (!mapData) {
          console.log('Map not found for user:', params.userId, 'mapId:', params.mapId);
          setMapNotFound(true);
          return;
        }
        
        console.log('Loaded map data:', mapData);
        
        // Set all states synchronously
        setPins(mapData.pins || []);
        setTheme(mapData.theme);
        setLayout(mapData.layout || 'sidebar');
        setEmbedOptions(mapData.embedOptions || {
          mapId: mapData.id,
          width: '100%',
          height: '500px',
          responsive: true,
          showAttribution: true,
          allowFullscreen: true,
          showFullInterface: false,
        });
        
      } catch (error) {
        console.error('Error loading map data:', error);
        setMapNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMapData();
  }, [params.userId, params.mapId]);
  
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
  
  // Show not found state
  if (mapNotFound) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Map Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The requested map could not be found.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            User ID: {params.userId}<br/>
            Map ID: {params.mapId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={isEmbedView ? "h-screen w-screen overflow-hidden" : "min-h-screen"}>
      <MapWrapper
        initialPins={pins}
        initialTheme={theme}
        initialLayout={layout}
        initialEmbedOptions={embedOptions}
        mapId={`${params.userId}_${params.mapId}`}
        apiKey={apiKey}
        readOnly={isEmbedView && !showFullInterface}
      />
    </div>
  );
}