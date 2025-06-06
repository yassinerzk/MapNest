'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MapContainer } from '@/components/molecules/MapContainer';
import { Sidebar } from '@/components/molecules/Sidebar';
import { ThemeSelector } from '@/components/molecules/ThemeSelector';
import { ThemePicker } from '@/components/organisms/ThemePicker';
import { getDefaultTheme, getThemeById } from '@/lib/themeUtils';
import { LayoutSelector } from '@/components/molecules/LayoutSelector';
import { PinManager } from '@/components/molecules/PinManager';
import { EmbedCode } from '@/components/molecules/EmbedCode';
import { SaveButton } from '@/components/molecules/SaveButton';
import { MapLayout as MapLayoutComponent } from '@/components/layouts/MapLayout';
import type { MapPin, MapTheme, MapLayout, EmbedOptions } from '@/types';

interface MapWrapperProps {
  initialPins?: MapPin[];
  initialTheme?: MapTheme;
  initialLayout?: MapLayout;
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
  const [theme, setTheme] = useState<MapTheme>(
    initialTheme || getDefaultTheme()
  );

  // Handle theme changes with proper object creation
  const handleThemeChange = (newTheme: MapTheme) => {
    console.log('MapWrapper: Theme change requested:', { 
      from: theme.name, 
      to: newTheme.name, 
      fromId: theme.id,
      toId: newTheme.id,
      stylesCount: newTheme.styles?.length || 0
    });
    
    // Alert for debugging
    alert(`Theme Change:\nFrom: ${theme.name} (${theme.id})\nTo: ${newTheme.name} (${newTheme.id})\nStyles Count: ${newTheme.styles?.length || 0}`);
    
    // Always create a completely new theme object with deep-cloned styles
    const brandNewTheme = {
      ...newTheme,
      styles: JSON.parse(JSON.stringify(newTheme.styles || [])),
    };
    
    console.log('MapWrapper: Created brand new theme object with deep-cloned styles');
    
    // Always set the new theme to force a re-render and style application
    setTheme(brandNewTheme);
    
    // Force a re-render by updating a timestamp
    setThemeUpdateTimestamp(Date.now());
  };
  
  // Track theme updates with timestamp
  const [themeUpdateTimestamp, setThemeUpdateTimestamp] = useState<number>(Date.now());
  const [layout, setLayout] = useState<MapLayout>(initialLayout);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [embedOptions, setEmbedOptions] = useState<Partial<EmbedOptions>>({
    width: '100%',
    height: '500px',
    responsive: true,
  });
  const [saveMessage, setSaveMessage] = useState<string>('');
  
  // Ref to access map instance for centering
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Handle pin selection with map centering
  const handlePinSelect = (pin: MapPin) => {
    const newSelectedPin = pin === selectedPin ? null : pin;
    setSelectedPin(newSelectedPin);
    
    // Center map on selected pin
    if (newSelectedPin && mapRef.current) {
      mapRef.current.panTo({ lat: newSelectedPin.lat, lng: newSelectedPin.lng });
      // Optionally zoom in a bit
      const currentZoom = mapRef.current.getZoom() || 12;
      if (currentZoom < 15) {
        mapRef.current.setZoom(15);
      }
    }
  };
  
  // Handle map instance reference
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
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
      onMapLoad={handleMapLoad}
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
              onThemeChange={handleThemeChange}
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
        <MapLayoutComponent
          layout={layout}
          mapComponent={mapComponent}
          sidebarComponent={sidebarComponent}
          className="min-h-[400px] sm:min-h-[500px] w-full"
        />
      </div>

      {/* Pin manager, save button, and embed code */}
      {!readOnly && (
        <div className="flex-shrink-0 p-3 sm:p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            <PinManager
              pins={pins}
              onPinAdd={handlePinCreate}
              onPinUpdate={handlePinUpdate}
              onPinDelete={handlePinDelete}
              apiKey={apiKey}
            />
            <SaveButton
              mapId={mapId}
              mapName={`Map ${mapId}`}
              pins={pins}
              theme={theme}
              layout={layout}
              embedOptions={embedOptions}
              onSaveSuccess={() => setSaveMessage('Map saved successfully!')}
              onSaveError={(error) => setSaveMessage(`Save failed: ${error}`)}
            />
            <EmbedCode
              mapId={mapId}
              options={embedOptions}
              onOptionsChange={setEmbedOptions}
            />
          </div>
          {saveMessage && (
            <div className={cn(
              'mt-3 p-2 rounded-md text-sm',
              saveMessage.includes('failed') 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            )}>
              {saveMessage}
              <button 
                onClick={() => setSaveMessage('')}
                className="ml-2 text-xs underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}