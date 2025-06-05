import { create } from 'zustand';
import { MapTheme, LayoutType, PinStyle } from '@/types/map-types';
import { mockLocations } from '@/lib/mock-data';

interface MapState {
  // Map configuration
  theme: MapTheme;
  layout: LayoutType;
  pinStyle: PinStyle;
  
  // Locations data
  locations: any[];
  selectedLocationId: string | null;
  
  // Embed configuration
  embedCode: string;
  embedWidth: string;
  embedHeight: string;
  
  // Actions
  setTheme: (theme: MapTheme) => void;
  setLayout: (layout: LayoutType) => void;
  setPinStyle: (style: PinStyle) => void;
  setLocations: (locations: any[]) => void;
  addLocation: (location: any) => void;
  removeLocation: (id: string) => void;
  setSelectedLocationId: (id: string | null) => void;
  generateEmbedCode: () => void;
  setEmbedDimensions: (width: string, height: string) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  // Default state
  theme: 'midnight',
  layout: 'split-view',
  pinStyle: 'modern',
  locations: mockLocations,
  selectedLocationId: null,
  embedCode: '',
  embedWidth: '100%',
  embedHeight: '500px',
  
  // Actions
  setTheme: (theme) => set({ theme }),
  
  setLayout: (layout) => set({ layout }),
  
  setPinStyle: (pinStyle) => set({ pinStyle }),
  
  setLocations: (locations) => set({ locations }),
  
  addLocation: (location) => set((state) => ({
    locations: [...state.locations, { ...location, id: Date.now().toString() }]
  })),
  
  removeLocation: (id) => set((state) => ({
    locations: state.locations.filter(location => location.id !== id)
  })),
  
  setSelectedLocationId: (id) => set({ selectedLocationId: id }),
  
  generateEmbedCode: () => {
    const { theme, layout, pinStyle, locations, embedWidth, embedHeight } = get();
    
    // Create a configuration object to pass to the embed
    const config = {
      theme,
      layout,
      pinStyle,
      locations: locations.map(({ id, name, lat, lng, category, address }) => ({
        id, name, lat, lng, category, address
      })),
    };
    
    // Base URL - in production this would be your actual domain
    const baseUrl = window.location.origin;
    
    // Create the embed code
    const embedCode = `<iframe 
  src="${baseUrl}/embed?config=${encodeURIComponent(JSON.stringify(config))}"
  width="${embedWidth}"
  height="${embedHeight}"
  style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
  title="MapNest Embed"
  allow="geolocation"
  loading="lazy">
</iframe>`;
    
    set({ embedCode });
  },
  
  setEmbedDimensions: (width, height) => set({ 
    embedWidth: width, 
    embedHeight: height 
  }),
}));