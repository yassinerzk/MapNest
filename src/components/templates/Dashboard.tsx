'use client';

import { useState, useEffect } from 'react';
import { MapWrapper } from '@/components/organisms/MapWrapper';
import { cn } from '@/lib/utils';
import { getDefaultTheme } from '@/lib/themeUtils';
import { mapDatabase, type MapData } from '@/lib/database';
import type { MapPin } from '@/types';

interface DashboardProps {
  apiKey: string;
  className?: string;
}

export function Dashboard({ apiKey, className }: DashboardProps) {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load maps from database on component mount
  useEffect(() => {
    const loadMaps = () => {
      const allMaps = mapDatabase.getAllMaps();
      
      // If no maps exist, create sample maps
      if (allMaps.length === 0) {
        createSampleMaps();
        return;
      }
      
      setMaps(allMaps);
      setSelectedMapId(allMaps[0]?.id || null);
      setIsLoading(false);
    };

    loadMaps();
  }, []);

  // Create sample maps if database is empty
  const createSampleMaps = () => {
    const defaultTheme = getDefaultTheme();
    
    // Create Business Locations map
    const businessMap = mapDatabase.createMap({
      name: 'Business Locations',
      description: 'Our company locations and facilities',
      pins: [
        {
          id: 'pin-1',
          title: 'Headquarters',
          description: 'Our main office location with customer service center',
          lat: 40.7128,
          lng: -74.006,
          color: '#4f46e5',
          icon: '/office.svg',
        },
        {
          id: 'pin-2',
          title: 'Flagship Store',
          description: 'Our largest retail location with full product lineup',
          lat: 40.7282,
          lng: -73.9942,
          color: '#10b981',
          icon: '/store.svg',
        },
        {
          id: 'pin-3',
          title: 'Distribution Center',
          description: 'Main warehouse and distribution facility',
          lat: 40.6892,
          lng: -74.0445,
          color: '#f59e0b',
          icon: '/warehouse.svg',
        },
      ],
      theme: defaultTheme,
      layout: 'split',
      center: { lat: 40.7128, lng: -74.006 },
      zoom: 12,
      embedOptions: {
        mapId: '',
        width: '100%',
        height: '500px',
        responsive: true,
        showAttribution: true,
        allowFullscreen: true,
        showFullInterface: false,
      },
      isPublic: false,
      tags: ['business', 'locations'],
    });

    // Create Tourist Attractions map
    const touristMap = mapDatabase.createMap({
      name: 'Tourist Attractions',
      description: 'Popular tourist destinations in New York City',
      pins: [
        {
          id: 'pin-4',
          title: 'Central Park',
          description: 'Beautiful urban park in Manhattan',
          lat: 40.7829,
          lng: -73.9654,
          color: '#22c55e',
        },
        {
          id: 'pin-5',
          title: 'Times Square',
          description: 'The crossroads of the world',
          lat: 40.7580,
          lng: -73.9855,
          color: '#ef4444',
        },
      ],
      theme: defaultTheme,
      layout: 'fullscreen',
      center: { lat: 40.7704, lng: -73.9755 },
      zoom: 13,
      embedOptions: {
        mapId: '',
        width: '100%',
        height: '500px',
        responsive: true,
        showAttribution: true,
        allowFullscreen: true,
        showFullInterface: false,
      },
      isPublic: true,
      tags: ['tourism', 'nyc'],
    });

    // Update embed options with actual map IDs
    mapDatabase.updateMap(businessMap.id, {
      embedOptions: { ...businessMap.embedOptions, mapId: businessMap.id }
    });
    mapDatabase.updateMap(touristMap.id, {
      embedOptions: { ...touristMap.embedOptions, mapId: touristMap.id }
    });

    const allMaps = mapDatabase.getAllMaps();
    setMaps(allMaps);
    setSelectedMapId(allMaps[0]?.id || null);
    setIsLoading(false);
  };

  const selectedMap = maps.find(map => map.id === selectedMapId);

  return (
    <div className={cn('flex flex-col min-h-screen w-full', className)}>
      {/* Header */}
      <header className="flex-shrink-0 p-3 sm:p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            MapNest Dashboard
          </h1>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <select
              value={selectedMapId || ''}
              onChange={(e) => setSelectedMapId(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            >
              {maps.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.name}
                </option>
              ))}
            </select>
            
            <button
              type="button"
              onClick={() => {
                const defaultTheme = getDefaultTheme();
                const newMap = mapDatabase.createMap({
                  name: `New Map ${maps.length + 1}`,
                  description: '',
                  pins: [],
                  theme: defaultTheme,
                  layout: 'fullscreen',
                  center: { lat: 40.7128, lng: -74.006 },
                  zoom: 10,
                  embedOptions: {
                    mapId: '',
                    width: '100%',
                    height: '500px',
                    responsive: true,
                    showAttribution: true,
                    allowFullscreen: true,
                    showFullInterface: false,
                  },
                  isPublic: false,
                  tags: [],
                });
                mapDatabase.updateMap(newMap.id, {
                  embedOptions: { ...newMap.embedOptions, mapId: newMap.id }
                });
                const updatedMaps = mapDatabase.getAllMaps();
                setMaps(updatedMaps);
                setSelectedMapId(newMap.id);
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base whitespace-nowrap"
            >
              Create New Map
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading maps...</p>
            </div>
          </div>
        ) : selectedMap ? (
          <MapWrapper
            initialPins={selectedMap.pins}
            initialTheme={selectedMap.theme}
            mapId={selectedMap.id}
            apiKey={apiKey}
            className="min-h-[calc(100vh-120px)] w-full"
          />
        ) : (
          <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No maps found.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}