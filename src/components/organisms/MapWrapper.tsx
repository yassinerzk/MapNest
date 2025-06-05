'use client';

import { useState, useEffect } from 'react';
import { MapContainer } from '@/components/molecules/MapContainer';
import { Sidebar } from '@/components/molecules/Sidebar';
import { ThemeSelector } from '@/components/molecules/ThemeSelector';
import { PinManager } from '@/components/molecules/PinManager';
import { LayoutSelector } from '@/components/molecules/LayoutSelector';
import { EmbedCode } from '@/components/molecules/EmbedCode';
import { MapLayout } from '@/components/layouts/MapLayout';
import { cn } from '@/lib/utils';
import type { MapPin, MapTheme, MapLayout as MapLayoutType, EmbedOptions } from '@/types';

interface MapWrapperProps {
  initialPins?: MapPin[];
  initialTheme?: MapTheme;
  initialLayout?: MapLayoutType;
  mapId: string;
  apiKey: string;
  className?: string;
  readOnly?: boolean;
}

export function MapWrapper({
  initialPins = [],
  initialTheme,
  initialLayout = 'fullscreen',
  mapId,
  apiKey,
  className,
  readOnly = false,
}: MapWrapperProps) {
  // State for pins, theme, layout, and selected pin
  const [pins, setPins] = useState<MapPin[]>(initialPins);
  const [theme, setTheme] = useState<MapTheme | undefined>(initialTheme);
  const [layout, setLayout] = useState<MapLayoutType>(initialLayout);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [embedOptions, setEmbedOptions] = useState<Partial<EmbedOptions>>({
    width: '100%',
    height: '500px',
    responsive: true,
  });
  
  // Handle pin selection
  const handlePinSelect = (pin: MapPin) => {
    setSelectedPin(pin === selectedPin ? null : pin);
  };

  // Handle pin creation
  const handlePinCreate = (pin: Omit<MapPin, 'id'>) => {
    const newPin: MapPin = {
      ...pin,
      id: `pin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setPins([...pins, newPin]);
  };

  // Handle pin update
  const handlePinUpdate = (updatedPin: MapPin) => {
    setPins(pins.map((pin) => (pin.id === updatedPin.id ? updatedPin : pin)));
    if (selectedPin?.id === updatedPin.id) {
      setSelectedPin(updatedPin);
    }
  };

  // Handle pin deletion
  const handlePinDelete = (pinId: string) => {
    setPins(pins.filter((pin) => pin.id !== pinId));
    if (selectedPin?.id === pinId) {
      setSelectedPin(null);
    }
  };

  // Render the map component
  const mapComponent = (
    <MapContainer
      apiKey={apiKey}
      pins={pins}
      theme={theme}
      onPinClick={handlePinSelect}
      selectedPin={selectedPin}
      className="w-full h-full"
    />
  );

  // Render the sidebar component
  const sidebarComponent = (
    <Sidebar
      pins={pins}
      activePinId={selectedPin?.id}
      onPinClick={handlePinSelect}
      className="w-full h-full"
    />
  );

  return (
    <div className={cn('flex flex-col w-full', className)}>
      {/* Controls */}
      {!readOnly && (
        <div className="flex-shrink-0 p-3 sm:p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
            <ThemeSelector
              currentTheme={theme}
              onThemeChange={setTheme}
              className="w-full sm:w-48"
            />
            <LayoutSelector
              currentLayout={layout}
              onLayoutChange={setLayout}
              className="w-full sm:w-48"
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <MapLayout
          layout={layout}
          mapComponent={mapComponent}
          sidebarComponent={sidebarComponent}
          className="min-h-[400px] sm:min-h-[500px] w-full"
        />
      </div>

      {/* Pin manager and embed code */}
      {!readOnly && (
        <div className="flex-shrink-0 p-3 sm:p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <PinManager
              pins={pins}
              onPinAdd={handlePinCreate}
              onPinUpdate={handlePinUpdate}
              onPinDelete={handlePinDelete}
            />
            <EmbedCode
              mapId={mapId}
              options={embedOptions}
              onOptionsChange={setEmbedOptions}
            />
          </div>
        </div>
      )}
    </div>
  );
}