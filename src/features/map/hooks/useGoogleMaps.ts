'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { MapTheme } from '@/types';

interface UseGoogleMapsProps {
  apiKey: string;
  mapId?: string;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  theme?: MapTheme;
  options?: google.maps.MapOptions;
}

export function useGoogleMaps({
  apiKey,
  mapId = 'map',
  center = { lat: 40.7128, lng: -74.006 },
  zoom = 12,
  theme,
  options = {},
}: UseGoogleMapsProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  // Initialize the map
  const initializeMap = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      setIsLoading(true);

      const loader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['places', 'visualization'],
      });

      await loader.load();
      setIsLoaded(true);

      // Apply theme if provided
      const mapOptions: google.maps.MapOptions = {
        center,
        zoom,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        ...options,
      };

      if (theme?.styles) {
        mapOptions.styles = theme.styles;
      }

      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load Google Maps'));
      console.error('Error loading Google Maps:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, center, zoom, theme, options]);

  // Update map center
  const panTo = useCallback(
    (newCenter: google.maps.LatLngLiteral) => {
      if (map) {
        map.panTo(newCenter);
      }
    },
    [map]
  );

  // Update map zoom
  const setZoom = useCallback(
    (newZoom: number) => {
      if (map) {
        map.setZoom(newZoom);
      }
    },
    [map]
  );

  // Update map theme
  const setTheme = useCallback(
    (newTheme?: MapTheme) => {
      if (map) {
        map.setOptions({
          styles: newTheme?.styles || [],
        });
      }
    },
    [map]
  );

  // Initialize map when component mounts
  useEffect(() => {
    if (!isLoaded && !isLoading && !error) {
      initializeMap();
    }
  }, [initializeMap, isLoaded, isLoading, error]);

  // Update map when theme changes
  useEffect(() => {
    if (map && theme) {
      setTheme(theme);
    }
  }, [map, theme, setTheme]);

  return {
    map,
    mapRef,
    isLoaded,
    isLoading,
    error,
    panTo,
    setZoom,
    setTheme,
  };
}