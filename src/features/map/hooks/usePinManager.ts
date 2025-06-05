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
  const [markers, setMarkers] = useState<Record<string, google.maps.marker.AdvancedMarkerElement | google.maps.Marker>>({});
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
    const updatedMarkers: Record<string, google.maps.marker.AdvancedMarkerElement | google.maps.Marker> = {};

    // Create or update markers for each pin
    pins.forEach((pin) => {
      const existingMarker = markers[pin.id];

      if (existingMarker) {
        // Update existing marker position
        // Handle different marker types
        if ('setPosition' in existingMarker) {
          // Legacy Marker has setPosition method
          (existingMarker as google.maps.Marker).setPosition({ lat: pin.lat, lng: pin.lng });
        } else {
          // AdvancedMarkerElement has position property
          (existingMarker as google.maps.marker.AdvancedMarkerElement).position = { lat: pin.lat, lng: pin.lng };
        }
        updatedMarkers[pin.id] = existingMarker;
      } else {
        // Check if AdvancedMarkerElement is available
        if (window.google?.maps?.marker?.AdvancedMarkerElement) {
          // Create pin element
          const pinElement = createPinElement(pin);
          
          // Create advanced marker
          const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: pin.lat, lng: pin.lng },
            map,
            title: pin.title,
            content: pinElement,
          });

          // Add click listener
          advancedMarker.addListener('click', () => {
            if (onPinClick) {
              onPinClick(pin);
            }
          });

          updatedMarkers[pin.id] = advancedMarker;
        } else {
          // Fallback to legacy Marker
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
      }

      // Update marker appearance (for color changes)
      if (updatedMarkers[pin.id]) {
        if ('setIcon' in updatedMarkers[pin.id]) {
          // Legacy marker - update icon
          (updatedMarkers[pin.id] as google.maps.Marker).setIcon(createPinIcon(pin));
        } else {
          // Advanced marker - update content
          const advancedMarker = updatedMarkers[pin.id] as google.maps.marker.AdvancedMarkerElement;
          advancedMarker.content = createPinElement(pin);
        }
      }
    });

    // Remove markers that no longer exist
    Object.keys(markers).forEach((markerId) => {
      if (!currentPinIds.has(markerId)) {
        const marker = markers[markerId];
        // Handle different marker types
        if ('setMap' in marker) {
          // Legacy Marker has setMap method
          (marker as google.maps.Marker).setMap(null);
        } else {
          // AdvancedMarkerElement uses map property
          (marker as google.maps.marker.AdvancedMarkerElement).map = null;
        }
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

  // Create custom pin icon (for legacy markers)
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

  // Create pin element (for advanced markers)
  const createPinElement = useCallback((pin: MapPin) => {
    const isSelected = selectedPin?.id === pin.id;
    
    if (pin.icon) {
      // Use custom icon if provided
      const img = document.createElement('img');
      img.src = pin.icon;
      img.width = 32;
      img.height = 32;
      img.style.cursor = 'pointer';
      img.style.opacity = isSelected ? '1' : '0.8';
      img.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
      img.style.transition = 'all 0.2s ease';
      return img;
    } else {
      // Create a custom pin element with the specified color
      const pinDiv = document.createElement('div');
      pinDiv.className = 'custom-advanced-pin';
      pinDiv.style.width = isSelected ? '28px' : '24px';
      pinDiv.style.height = isSelected ? '28px' : '24px';
      pinDiv.style.borderRadius = '50%';
      pinDiv.style.backgroundColor = pin.color || '#4f46e5';
      pinDiv.style.border = '2px solid white';
      pinDiv.style.boxShadow = isSelected 
        ? '0 4px 12px rgba(0,0,0,0.4)' 
        : '0 2px 6px rgba(0,0,0,0.3)';
      pinDiv.style.cursor = 'pointer';
      pinDiv.style.transition = 'all 0.2s ease';
      
      if (pin.animation === 'bounce') {
        pinDiv.style.animation = 'bounce 0.5s infinite alternate';
      }
      
      return pinDiv;
    }
  }, [selectedPin]);

  // Clear all markers
  const clearMarkers = useCallback(() => {
    Object.values(markers).forEach((marker) => {
      // Handle different marker types
      if ('setMap' in marker) {
        // Legacy Marker has setMap method
        (marker as google.maps.Marker).setMap(null);
      } else {
        // AdvancedMarkerElement uses map property
        (marker as google.maps.marker.AdvancedMarkerElement).map = null;
      }
    });
    setMarkers({});
  }, [markers]);

  return {
    markers,
    clearMarkers,
  };
}