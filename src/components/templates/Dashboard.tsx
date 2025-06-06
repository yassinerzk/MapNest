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
    }, 'demo-user');

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
    }, 'demo-user');

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

  // Handle creating a new map
  const handleCreateNewMap = () => {
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
    }, 'demo-user');

    // Update embed options with actual map ID
    mapDatabase.updateMap(newMap.id, {
      embedOptions: { ...newMap.embedOptions, mapId: newMap.id }
    });

    // Refresh maps list and select the new map
    const updatedMaps = mapDatabase.getAllMaps();
    setMaps(updatedMaps);
    setSelectedMapId(newMap.id);
  };

  // Handle loading sample maps
  const handleLoadSampleMaps = () => {
    createSampleMaps();
  };

  // Handle deleting a map
  const handleDeleteMap = (mapId: string) => {
    if (maps.length <= 1) {
      alert('Cannot delete the last map. At least one map must exist.');
      return;
    }

    if (confirm('Are you sure you want to delete this map? This action cannot be undone.')) {
      mapDatabase.deleteMap(mapId);
      const updatedMaps = mapDatabase.getAllMaps();
      setMaps(updatedMaps);
      
      // If deleted map was selected, select the first available map
      if (selectedMapId === mapId) {
        setSelectedMapId(updatedMaps[0]?.id || null);
      }
    }
  };

  // Handle duplicating a map
  const handleDuplicateMap = (mapId: string) => {
    const duplicatedMap = mapDatabase.duplicateMap(mapId);
    if (duplicatedMap) {
      const updatedMaps = mapDatabase.getAllMaps();
      setMaps(updatedMaps);
      setSelectedMapId(duplicatedMap.id);
    }
  };

  const selectedMap = maps.find(map => map.id === selectedMapId);

  if (isLoading) {
    return (
      <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center', className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading maps...</p>
        </div>
      </div>
    );
  }

  // Don't render if no map is selected
  if (!selectedMap) {
    return (
      <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center', className)}>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No map selected</p>
        </div>
      </div>
    );
  }

  if (maps.length === 0) {
    return (
      <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center', className)}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to MapNest</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by creating your first map or loading sample data to explore the features.</p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleCreateNewMap}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Map</span>
            </button>
            
            <button 
              onClick={handleLoadSampleMaps}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Load Sample Maps</span>
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
            Sample maps include business locations and tourist attractions to help you get started.
          </p>
        </div>
      </div>
    );
  }

  if (!selectedMap) {
    return (
      <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center', className)}>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Map not found.</p>
          <button 
            onClick={() => setSelectedMapId(maps[0]?.id || null)}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Select First Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-screen bg-gray-50 dark:bg-gray-900', className)}>
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                MapNest Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {maps.length} map{maps.length !== 1 ? 's' : ''} total
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="flex-shrink-0 p-3 sm:p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 flex items-center gap-2">
              <select
                value={selectedMapId || ''}
                onChange={(e) => setSelectedMapId(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              >
                {maps.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.name} ({map.pins.length} pins)
                  </option>
                ))}
              </select>
              
              {/* Map Actions */}
              {selectedMap && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicateMap(selectedMap.id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    title="Duplicate Map"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteMap(selectedMap.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Delete Map"
                    disabled={maps.length <= 1}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={handleCreateNewMap}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base whitespace-nowrap"
            >
              Create New Map
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <MapWrapper
          initialPins={selectedMap.pins}
          initialTheme={selectedMap.theme}
          initialLayout={selectedMap.layout}
          initialEmbedOptions={selectedMap.embedOptions}
          mapId={selectedMap.id}
          mapName={selectedMap.name}
          apiKey={apiKey}
          onMapUpdate={() => {
            // Refresh maps when data is saved
            const updatedMaps = mapDatabase.getAllMaps();
            setMaps(updatedMaps);
          }}
          className="min-h-[calc(100vh-120px)] w-full"
        />
      </main>
    </div>
  );
}