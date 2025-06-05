'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { MapPin } from '@/types';

interface UsePinManagerProps {
  map: google.maps.Map | null;
  pins: MapPin[];
  selectedPin: MapPin | null;
  onPinClick?: (pin: MapPin) => void;
}

export function usePinManager({
  map,
  pins,
  selectedPin,
  onPinClick,
}: UsePinManagerProps) {
  const [markers, setMarkers] = useState<Record<string, google.maps.Marker>>({});
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Initialize info window
  useEffect(() => {
    if (window.google && !infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow();
    }

    return () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, []);

  // Create or update markers when pins change
  useEffect(() => {
    if (!map || !window.google) return;

    // Track which pins are still present
    const currentPinIds = new Set(pins.map((pin) => pin.id));
    const updatedMarkers: Record<string, google.maps.Marker> = {};

    // Create or update markers for each pin
    pins.forEach((pin) => {
      const existingMarker = markers[pin.id];

      if (existingMarker) {
        // Update existing marker position
        existingMarker.setPosition({ lat: pin.lat, lng: pin.lng });
        updatedMarkers[pin.id] = existingMarker;
      } else {
        // Create new marker
        const marker = new google.maps.Marker({
          position: { lat: pin.lat, lng: pin.lng },
          map,
          title: pin.title,
          animation: google.maps.Animation.DROP,
          icon: createPinIcon(pin),
        });

        // Add click listener
        marker.addListener('click', () => {
          if (onPinClick) {
            onPinClick(pin);
          }
        });

        updatedMarkers[pin.id] = marker;
      }

      // Update marker icon (for color changes)
      if (updatedMarkers[pin.id]) {
        updatedMarkers[pin.id].setIcon(createPinIcon(pin));
      }
    });

    // Remove markers that no longer exist
    Object.keys(markers).forEach((markerId) => {
      if (!currentPinIds.has(markerId)) {
        markers[markerId].setMap(null);
      }
    });

    setMarkers(updatedMarkers);
  }, [map, pins, markers, onPinClick]);

  // Update selected pin state
  useEffect(() => {
    if (!map || !infoWindowRef.current) return;

    // Close any open info window
    infoWindowRef.current.close();

    if (selectedPin && markers[selectedPin.id]) {
      const marker = markers[selectedPin.id];
      
      // Create info window content
      const content = `
        <div class="p-2">
          <h3 class="font-bold text-base">${selectedPin.title}</h3>
          ${selectedPin.description ? `<p class="text-sm mt-1">${selectedPin.description}</p>` : ''}
        </div>
      `;
      
      infoWindowRef.current.setContent(content);
      infoWindowRef.current.open(map, marker);

      // Pan to the selected pin
      map.panTo({ lat: selectedPin.lat, lng: selectedPin.lng });
    }
  }, [map, selectedPin, markers]);

  // Create custom pin icon
  const createPinIcon = useCallback((pin: MapPin) => {
    const isSelected = selectedPin?.id === pin.id;
    const scale = isSelected ? 1.2 : 1;
    const strokeWeight = isSelected ? 2 : 1;
    
    // Default SVG pin icon with customizable color
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: pin.color || '#4f46e5',
      fillOpacity: 0.9,
      strokeColor: '#ffffff',
      strokeWeight,
      scale: 10 * scale,
    };
  }, [selectedPin]);

  // Clear all markers
  const clearMarkers = useCallback(() => {
    Object.values(markers).forEach((marker) => {
      marker.setMap(null);
    });
    setMarkers({});
  }, [markers]);

  return {
    markers,
    clearMarkers,
  };
}