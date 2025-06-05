'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { cn } from '@/lib/utils';
import type { MapConfig, MapPin } from '@/types';

interface MapContainerProps {
  config: MapConfig;
  onPinClick?: (pin: MapPin) => void;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  onBoundsChanged?: (bounds: google.maps.LatLngBounds) => void;
  className?: string;
}

export function MapContainer({
  config,
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
    // In a real app, this would come from environment variables
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';
    
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
    const mapStyles = typeof config.theme === 'string' 
      ? [] // In a real app, we would fetch theme styles by ID
      : config.theme.styles;

    // Create the map instance
    const mapOptions: google.maps.MapOptions = {
      center: config.center,
      zoom: config.zoom,
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      styles: mapStyles,
      disableDefaultUI: true,
      zoomControl: config.showZoomControls,
      fullscreenControl: config.showFullscreenControl,
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
    addPinsToMap(config.pins, map);

    // Fit bounds to markers if specified
    if (config.fitBoundsToMarkers && config.pins.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      config.pins.forEach(pin => {
        bounds.extend({ lat: pin.lat, lng: pin.lng });
      });
      map.fitBounds(bounds);
    }

    return () => {
      // Clean up event listeners
      google.maps.event.clearInstanceListeners(map);
    };
  }, [mapLoaded, config, onMapClick, onBoundsChanged]);

  // Update pins when they change
  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current.clear();
    
    // Add new markers
    addPinsToMap(config.pins, googleMapRef.current);
  }, [mapLoaded, config.pins]);

  // Helper function to add pins to the map
  const addPinsToMap = (pins: MapPin[], map: google.maps.Map) => {
    pins.forEach((pin, index) => {
      // Determine pin color - use pin color, theme default, or fallback
      const pinColor = pin.color || 
        (typeof config.theme !== 'string' ? config.theme.pinColor : '#3B82F6');
      
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
        opacity: pin.isActive === false ? 0.6 : 1,
        zIndex: pin.isActive ? 1000 : index
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
        'map-container',
        config.borderRadius && `rounded-[${config.borderRadius}]`,
        className
      )}
    >
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[300px]"
        aria-label="Interactive map"
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}