'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { cn } from '@/lib/utils';
import type { MapPin, MapTheme } from '@/types';

interface MapContainerProps {
  apiKey: string;
  pins: MapPin[];
  theme?: MapTheme;
  selectedPin?: MapPin | null;
  onPinClick?: (pin: MapPin) => void;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  onBoundsChanged?: (bounds: google.maps.LatLngBounds) => void;
  className?: string;
}

export function MapContainer({
  apiKey,
  pins,
  theme,
  selectedPin,
  onPinClick,
  onMapClick,
  onBoundsChanged,
  className,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps API
  useEffect(() => {
    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'marker']
    });

    loader.load().then(() => {
      setMapLoaded(true);
    }).catch(err => {
      console.error('Error loading Google Maps API:', err);
    });

    return () => {
      // Clean up markers when component unmounts
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current.clear();
      }
    };
  }, []);

  // Initialize map when API is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    // Apply map theme styles
    const mapStyles = theme?.styles || [];

    // Create the map instance
    const mapOptions: google.maps.MapOptions = {
      center: pins.length > 0 
        ? { lat: pins[0].lat, lng: pins[0].lng } 
        : { lat: 40.7128, lng: -74.006 }, // Default to NYC if no pins
      zoom: 12,
      minZoom: 3,
      maxZoom: 18,
      styles: mapStyles,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      clickableIcons: false,
      backgroundColor: 'transparent',
      gestureHandling: 'cooperative',
    };

    const map = new google.maps.Map(mapRef.current, mapOptions);
    googleMapRef.current = map;

    // Add event listeners
    if (onMapClick) {
      map.addListener('click', (e: google.maps.MapMouseEvent) => onMapClick(e));
    }

    if (onBoundsChanged) {
      map.addListener('bounds_changed', () => {
        const bounds = map.getBounds();
        if (bounds) onBoundsChanged(bounds);
      });
    }

    // Add markers for pins
    addPinsToMap(pins, map);

    // Fit bounds to markers if there are multiple pins
    if (pins.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      pins.forEach(pin => {
        bounds.extend({ lat: pin.lat, lng: pin.lng });
      });
      map.fitBounds(bounds);
    }

    return () => {
      // Clean up event listeners
      google.maps.event.clearInstanceListeners(map);
    };
  }, [mapLoaded, pins, theme, onMapClick, onBoundsChanged]);

  // Update pins when they change
  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current.clear();
    
    // Add new markers
    addPinsToMap(pins, googleMapRef.current);
  }, [mapLoaded, pins]);

  // Helper function to add pins to the map
  const addPinsToMap = (pins: MapPin[], map: google.maps.Map) => {
    pins.forEach((pin, index) => {
      // Determine pin color - use pin color, theme default, or fallback
      const pinColor = pin.color || theme?.primaryColor || '#3B82F6';
      
      // Create marker
      const marker = new google.maps.Marker({
        position: { lat: pin.lat, lng: pin.lng },
        map,
        title: pin.title,
        animation: pin.animation === 'drop' 
          ? google.maps.Animation.DROP 
          : pin.animation === 'bounce' 
            ? google.maps.Animation.BOUNCE 
            : null,
        icon: pin.icon ? {
          url: pin.icon,
          scaledSize: new google.maps.Size(32, 32)
        } : {
          // Default SVG pin with custom color
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: pinColor,
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: '#FFFFFF',
          scale: 10
        },
        opacity: (selectedPin && selectedPin.id !== pin.id) ? 0.6 : 1,
        zIndex: (selectedPin && selectedPin.id === pin.id) ? 1000 : index
      });

      // Add click event
      if (onPinClick) {
        marker.addListener('click', () => onPinClick(pin));
      }

      // Store marker reference
      markersRef.current.set(pin.id, marker);

      // Add animation delay for drop effect
      if (pin.animation === 'drop') {
        setTimeout(() => {
          marker.setAnimation(null);
        }, 750);
      }
    });
  };

  return (
    <div 
      className={cn(
        'map-container relative w-full h-full',
        'rounded-lg overflow-hidden touch-manipulation',
        className
      )}
    >
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[300px] sm:min-h-[400px]"
        aria-label="Interactive map"
        style={{ touchAction: 'pan-x pan-y' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 p-4">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}