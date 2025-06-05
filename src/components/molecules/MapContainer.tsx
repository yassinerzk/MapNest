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
  const [mapError, setMapError] = useState<string | null>(null);

  // Load Google Maps API
  useEffect(() => {
    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'marker'],
      mapIds: ['MAPNEST_MAP_ID'] // Required for AdvancedMarkerElement
    });

    loader.load().then(() => {
      setMapLoaded(true);
      setMapError(null);
      
      // Check for common Google Maps API errors after loading
      setTimeout(() => {
        const mapDiv = mapRef.current;
        if (mapDiv) {
          // Check if the map has the "For development purposes only" watermark
          const watermarkElements = document.querySelectorAll('.gm-style');
          watermarkElements.forEach(element => {
            if (element.textContent?.includes('For development purposes only')) {
              console.error('Google Maps API billing issue detected: "For development purposes only" watermark is present');
              setMapError(
                'Google Maps API billing issue detected. Please check:\n' +
                '1. Billing is enabled in Google Cloud Console\n' +
                '2. The API key is correctly configured\n' +
                '3. Maps JavaScript API is enabled in your project\n' +
                '4. Your billing account is active and valid'
              );
            }
          });
        }
      }, 2000); // Check after map has had time to render
    }).catch(err => {
        console.error('Error loading Google Maps API:', err);
        setMapError('Failed to load Google Maps API. Please check your API key and internet connection.');
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
      mapId: 'MAPNEST_MAP_ID', // Required for AdvancedMarkerElement
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
    // Ensure the marker library is loaded
    if (!window.google?.maps?.marker?.AdvancedMarkerElement) {
      console.error('AdvancedMarkerElement is not available. Falling back to standard Marker.');
      // Fall back to standard markers if AdvancedMarkerElement is not available
      pins.forEach((pin, index) => {
        // Determine pin color - use pin color, theme default, or fallback
        const pinColor = pin.color || theme?.primaryColor || '#3B82F6';
        
        // Create marker using legacy Marker API
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
      });
      return;
    }
    
    // Use AdvancedMarkerElement if available
    pins.forEach((pin, index) => {
      // Determine pin color - use pin color, theme default, or fallback
      const pinColor = pin.color || theme?.primaryColor || '#3B82F6';
      
      // Create pin element for the marker
      let pinElement;
      
      if (pin.icon) {
        // Use custom icon if provided
        const img = document.createElement('img');
        img.src = pin.icon;
        img.width = 32;
        img.height = 32;
        pinElement = img;
      } else {
        // Create a custom pin element with the specified color
        const pinDiv = document.createElement('div');
        pinDiv.className = 'custom-pin';
        pinDiv.style.width = '24px';
        pinDiv.style.height = '24px';
        pinDiv.style.borderRadius = '50%';
        pinDiv.style.backgroundColor = pinColor;
        pinDiv.style.border = '2px solid white';
        pinDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        pinDiv.style.cursor = 'pointer';
        pinDiv.style.opacity = (selectedPin && selectedPin.id !== pin.id) ? '0.6' : '1';
        
        if (pin.animation === 'bounce') {
          pinDiv.style.animation = 'bounce 0.5s infinite alternate';
        }
        
        pinElement = pinDiv;
      }
      
      // Create advanced marker
      const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: pin.lat, lng: pin.lng },
        map,
        title: pin.title,
        content: pinElement,
        zIndex: (selectedPin && selectedPin.id === pin.id) ? 1000 : index
      });

      // Add click event
      if (onPinClick) {
        advancedMarker.addListener('click', () => onPinClick(pin));
      }

      // Store marker reference (still using the same ref Map)
      markersRef.current.set(pin.id, advancedMarker as unknown as google.maps.Marker);
    });
  };

  // Note: Animation delay for drop effect is handled in the pin element creation

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
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-10">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md text-center">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Map Error</h3>
            <p className="text-red-600 dark:text-red-400 whitespace-pre-line">{mapError}</p>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              <p>If you recently updated billing:</p>
              <ul className="list-disc list-inside mt-2 text-left">
                <li>Ensure you've enabled the Maps JavaScript API</li>
                <li>Check for any API restrictions on your key</li>
                <li>Verify your billing account is properly linked to your project</li>
                <li>It may take up to 5 minutes for billing changes to propagate</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {!mapLoaded && !mapError && (
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