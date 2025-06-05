'use client';

import { useState, useCallback } from 'react';
import type { MapPin, MapTheme, MapLayout, EmbedOptions } from '@/types';

interface UseMapStateProps {
  initialPins?: MapPin[];
  initialTheme?: MapTheme;
  initialLayout?: MapLayout;
  initialEmbedOptions?: Partial<EmbedOptions>;
}

export function useMapState({
  initialPins = [],
  initialTheme,
  initialLayout = 'fullscreen',
  initialEmbedOptions = {
    width: '100%',
    height: '500px',
    responsive: true,
    showAttribution: true,
    allowFullscreen: true,
  },
}: UseMapStateProps = {}) {
  // State for pins, theme, layout, and selected pin
  const [pins, setPins] = useState<MapPin[]>(initialPins);
  const [theme, setTheme] = useState<MapTheme | undefined>(initialTheme);
  const [layout, setLayout] = useState<MapLayout>(initialLayout);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [embedOptions, setEmbedOptions] = useState<Partial<EmbedOptions>>(initialEmbedOptions);

  // Handle pin selection
  const selectPin = useCallback((pin: MapPin | null) => {
    setSelectedPin(pin);
  }, []);

  // Handle pin toggle selection
  const togglePinSelection = useCallback((pin: MapPin) => {
    setSelectedPin((current) => (current?.id === pin.id ? null : pin));
  }, []);

  // Handle pin creation
  const createPin = useCallback((pin: MapPin) => {
    setPins((current) => [...current, pin]);
    return pin;
  }, []);

  // Handle pin update
  const updatePin = useCallback((updatedPin: MapPin) => {
    setPins((current) =>
      current.map((pin) => (pin.id === updatedPin.id ? updatedPin : pin))
    );
    setSelectedPin((current) =>
      current?.id === updatedPin.id ? updatedPin : current
    );
    return updatedPin;
  }, []);

  // Handle pin deletion
  const deletePin = useCallback((pinId: string) => {
    setPins((current) => current.filter((pin) => pin.id !== pinId));
    setSelectedPin((current) => (current?.id === pinId ? null : current));
  }, []);

  // Handle theme change
  const changeTheme = useCallback((newTheme: MapTheme | undefined) => {
    setTheme(newTheme);
  }, []);

  // Handle layout change
  const changeLayout = useCallback((newLayout: MapLayout) => {
    setLayout(newLayout);
  }, []);

  // Handle embed options change
  const updateEmbedOptions = useCallback((options: Partial<EmbedOptions>) => {
    setEmbedOptions((current) => ({ ...current, ...options }));
  }, []);

  // Generate a unique ID for new pins
  const generatePinId = useCallback(() => {
    return `pin-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }, []);

  return {
    // State
    pins,
    theme,
    layout,
    selectedPin,
    embedOptions,

    // Actions
    selectPin,
    togglePinSelection,
    createPin,
    updatePin,
    deletePin,
    changeTheme,
    changeLayout,
    updateEmbedOptions,
    generatePinId,

    // Setters (for direct state manipulation if needed)
    setPins,
    setTheme,
    setLayout,
    setSelectedPin,
    setEmbedOptions,
  };
}