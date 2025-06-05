'use client';

import { useState, useEffect } from 'react';
import { MapWrapper } from '@/components/organisms/MapWrapper';
import { useMapStore } from '@/features/map/store/mapStore';
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
  // In a real app, this would come from environment variables
  const [apiKey] = useState<string>('YOUR_GOOGLE_MAPS_API_KEY');
  
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