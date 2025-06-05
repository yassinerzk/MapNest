"use client";

import { useRef, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useMapStore } from '../stores/map-store';
import { MapTheme } from '@/types/map-types';
import { mapThemeStyles } from '@/lib/map-theme-styles';

export function MapContainer() {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { theme, locations, selectedLocationId, setSelectedLocationId, pinStyle } = useMapStore();

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      // Get API key from environment variable
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('Google Maps API key is missing');
        return;
      }

      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
        const { Map } = google.maps;

        if (!mapRef.current) return;

        // Create the map instance
        const map = new Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.006 }, // Default to NYC
          zoom: 12,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          styles: mapThemeStyles[theme as MapTheme] || [],
        });

        googleMapRef.current = map;
        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    if (!mapLoaded) {
      initMap();
    }

    return () => {
      // Clean up markers when component unmounts
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }
    };
  }, [mapLoaded, theme]);

  // Update map when locations change
  useEffect(() => {
    if (!googleMapRef.current || !mapLoaded || !locations.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    const map = googleMapRef.current;

    // Add markers for each location
    locations.forEach(location => {
      const position = { lat: location.lat, lng: location.lng };
      bounds.extend(position);

      // Create custom marker icon based on pinStyle
      const icon = createCustomMarkerIcon(location.category, pinStyle);

      const marker = new google.maps.Marker({
        position,
        map,
        title: location.name,
        icon,
        animation: google.maps.Animation.DROP,
      });

      // Add click event to marker
      marker.addListener('click', () => {
        setSelectedLocationId(location.id);
        
        // Create info window content
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-medium text-base">${location.name}</h3>
              <p class="text-sm">${location.address}</p>
            </div>
          `,
        });

        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    // Fit map to bounds if we have locations
    if (locations.length > 0) {
      map.fitBounds(bounds);
      
      // Don't zoom in too far on only one marker
      if (map.getZoom() > 16) {
        map.setZoom(16);
      }
    }
  }, [locations, mapLoaded, pinStyle, setSelectedLocationId]);

  // Update map theme when theme changes
  useEffect(() => {
    if (!googleMapRef.current || !mapLoaded) return;
    
    googleMapRef.current.setOptions({
      styles: mapThemeStyles[theme as MapTheme] || [],
    });
  }, [theme, mapLoaded]);

  // Center map on selected location
  useEffect(() => {
    if (!googleMapRef.current || !mapLoaded || !selectedLocationId) return;
    
    const location = locations.find(loc => loc.id === selectedLocationId);
    if (!location) return;
    
    googleMapRef.current.panTo({ lat: location.lat, lng: location.lng });
    googleMapRef.current.setZoom(15);
  }, [selectedLocationId, locations, mapLoaded]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border shadow-sm">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full" 
        style={{ opacity: mapLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
      />
    </div>
  );
}

function createCustomMarkerIcon(category: string, pinStyle: string) {
  // Default colors for different categories
  const categoryColors: Record<string, string> = {
    store: '#4CAF50',    // Green
    office: '#2196F3',   // Blue
    event: '#FF9800',    // Orange
    restaurant: '#F44336', // Red
    attraction: '#9C27B0', // Purple
    default: '#757575',  // Gray
  };

  const color = categoryColors[category] || categoryColors.default;
  
  // Different pin styles
  switch (pinStyle) {
    case 'classic':
      return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff',
        scale: 10,
      };
    
    case 'modern':
      // SVG path for a modern pin
      return {
        path: 'M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z',
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff',
        scale: 1.5,
        anchor: new google.maps.Point(12, 22),
      };
    
    case 'minimal':
      return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 0.7,
        strokeWeight: 1,
        strokeColor: '#ffffff',
        scale: 8,
      };
      
    case 'animated':
      return {
        path: 'M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z',
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff',
        scale: 1.5,
        anchor: new google.maps.Point(12, 22),
      };
      
    default:
      return {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff',
        scale: 5,
      };
  }
}