'use client';

import { useState, useEffect } from 'react';
import { MapWrapper } from '@/components/organisms/MapWrapper';
import { predefinedThemes } from '@/features/map/utils/mapUtils';
import type { MapPin } from '@/types';

interface EmbedPageProps {
  params: {
    mapId: string;
  };
  searchParams: {
    theme?: string;
    layout?: string;
  };
}

export default function EmbedPage({ params, searchParams }: EmbedPageProps) {
  // Get API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
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
  
  // Sample data for demonstration
  const [pins, setPins] = useState<MapPin[]>([
    {
      id: 'pin-1',
      title: 'Headquarters',
      description: 'Our main office location with customer service center',
      lat: 40.7128,
      lng: -74.006,
      color: '#4f46e5',
      icon: 'office',
    },
    {
      id: 'pin-2',
      title: 'Flagship Store',
      description: 'Our largest retail location with full product lineup',
      lat: 40.7282,
      lng: -73.9942,
      color: '#10b981',
      icon: 'store',
    },
  ]);

  // Get theme from search params or use default
  const theme = searchParams.theme && predefinedThemes[searchParams.theme] 
    ? predefinedThemes[searchParams.theme] 
    : predefinedThemes.light;

  // Get layout from search params or use default
  const layout = searchParams.layout && ['fullscreen', 'split', 'sidebar-right', 'floating-card', 'list-mode'].includes(searchParams.layout)
    ? searchParams.layout as any
    : 'fullscreen';

  return (
    <div className="h-screen w-screen overflow-hidden">
      <MapWrapper
        initialPins={pins}
        initialTheme={theme}
        initialLayout={layout}
        mapId={params.mapId}
        apiKey={apiKey}
        readOnly={true}
      />
    </div>
  );
}