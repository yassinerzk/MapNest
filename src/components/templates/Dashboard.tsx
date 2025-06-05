'use client';

import { useState } from 'react';
import { MapWrapper } from '@/components/organisms/MapWrapper';
import { cn } from '@/lib/utils';
import type { MapPin, MapTheme } from '@/types';

interface DashboardProps {
  apiKey: string;
  className?: string;
}

export function Dashboard({ apiKey, className }: DashboardProps) {
  // Sample data for demonstration
  const sampleMaps = [
    {
      id: 'map-1',
      name: 'Store Locations',
      pins: [
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
        {
          id: 'pin-3',
          title: 'Distribution Center',
          description: 'Main warehouse and shipping facility',
          lat: 40.6892,
          lng: -74.0445,
          color: '#f59e0b',
          icon: 'warehouse',
        },
      ] as MapPin[],
      theme: {
        name: 'Corporate',
        styles: [
          { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
          { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#dbeafe' }] },
          { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: '#f9fafb' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e5e7eb' }] },
          { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#d1fae5' }] },
        ],
      } as MapTheme,
    },
    {
      id: 'map-2',
      name: 'Event Locations',
      pins: [
        {
          id: 'pin-4',
          title: 'Conference Center',
          description: 'Annual industry conference venue',
          lat: 34.0522,
          lng: -118.2437,
          color: '#8b5cf6',
          icon: 'event',
        },
        {
          id: 'pin-5',
          title: 'Workshop Location',
          description: 'Technical workshops and training sessions',
          lat: 34.0654,
          lng: -118.2363,
          color: '#ec4899',
          icon: 'workshop',
        },
      ] as MapPin[],
      theme: {
        name: 'Night Mode',
        styles: [
          { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#d1d5db' }] },
          { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#1f2937' }] },
          { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#0f172a' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#374151' }] },
          { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#312e81' }] },
        ],
      } as MapTheme,
    },
  ];

  // State for selected map
  const [selectedMapId, setSelectedMapId] = useState(sampleMaps[0].id);
  const selectedMap = sampleMaps.find((map) => map.id === selectedMapId) || sampleMaps[0];

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <header className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            MapNest Dashboard
          </h1>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedMapId}
              onChange={(e) => setSelectedMapId(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sampleMaps.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.name}
                </option>
              ))}
            </select>
            
            <button
              type="button"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Create New Map
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <MapWrapper
          initialPins={selectedMap.pins}
          initialTheme={selectedMap.theme}
          mapId={selectedMap.id}
          apiKey={apiKey}
          className="h-full"
        />
      </main>
    </div>
  );
}