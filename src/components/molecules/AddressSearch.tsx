'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AddressSearchProps {
  apiKey: string;
  onPlaceSelect: (place: {
    address: string;
    lat: number;
    lng: number;
    placeId?: string;
  }) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

export function AddressSearch({
  apiKey,
  onPlaceSelect,
  placeholder = "Search for an address...",
  className,
  value = '',
}: AddressSearchProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      if (!inputRef.current || !window.google?.maps?.places) {
        return;
      }

      try {
        // Initialize the autocomplete
        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['establishment', 'geocode'],
            fields: ['place_id', 'geometry', 'name', 'formatted_address'],
          }
        );

        // Add place changed listener
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          
          if (!place || !place.geometry || !place.geometry.location) {
            console.warn('No valid place selected');
            return;
          }

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || place.name || '';
          const placeId = place.place_id;

          setInputValue(address);
          onPlaceSelect({
            address,
            lat,
            lng,
            placeId,
          });
        });
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
      }
    };

    // Load Google Maps API if not already loaded
    if (!window.google?.maps?.places) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    } else {
      initializeAutocomplete();
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [apiKey, onPlaceSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleGeocodeAddress = async () => {
    if (!inputValue.trim() || !window.google?.maps) {
      return;
    }

    setIsLoading(true);
    
    try {
      const geocoder = new google.maps.Geocoder();
      
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode(
          { address: inputValue },
          (results, status) => {
            if (status === 'OK' && results) {
              resolve(results);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          }
        );
      });

      if (result.length > 0) {
        const location = result[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const address = result[0].formatted_address;
        const placeId = result[0].place_id;

        onPlaceSelect({
          address,
          lat,
          lng,
          placeId,
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGeocodeAddress();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium">
        Address Search
      </label>
      <div className="flex space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={handleGeocodeAddress}
          disabled={isLoading || !inputValue.trim()}
          className={cn(
            'px-4 py-2 rounded-md transition-colors',
            'bg-primary text-white hover:bg-primary/90',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Start typing an address or place name, or click Search to geocode the entered text.
      </p>
    </div>
  );
}