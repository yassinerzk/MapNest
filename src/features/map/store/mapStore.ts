import { create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import type { MapPin, MapTheme, MapLayout, EmbedOptions } from '@/types';

interface MapState {
  // Map data
  maps: Record<string, {
    id: string;
    name: string;
    pins: MapPin[];
    theme?: MapTheme;
    layout: MapLayout;
    embedOptions: Partial<EmbedOptions>;
    createdAt: number;
    updatedAt: number;
  }>;
  
  // Current selections
  currentMapId: string | null;
  selectedPinId: string | null;
  
  // Actions
  createMap: (name: string, theme?: MapTheme) => string;
  updateMap: (mapId: string, data: Partial<{
    name: string;
    theme?: MapTheme;
    layout: MapLayout;
    embedOptions: Partial<EmbedOptions>;
  }>) => void;
  deleteMap: (mapId: string) => void;
  setCurrentMap: (mapId: string) => void;
  
  // Pin management
  addPin: (mapId: string, pin: Omit<MapPin, 'id'>) => string;
  updatePin: (mapId: string, pinId: string, data: Partial<Omit<MapPin, 'id'>>) => void;
  deletePin: (mapId: string, pinId: string) => void;
  selectPin: (pinId: string | null) => void;
  
  // Theme management
  setTheme: (mapId: string, theme?: MapTheme) => void;
  
  // Layout management
  setLayout: (mapId: string, layout: MapLayout) => void;
  
  // Embed options
  updateEmbedOptions: (mapId: string, options: Partial<EmbedOptions>) => void;
}

// Define a proper type for the persist middleware with correct generics
type MapPersist = (
  config: StateCreator<MapState, [], []>,
  options: PersistOptions<MapState, Partial<Pick<MapState, 'maps' | 'currentMapId'>>>
) => StateCreator<MapState, [], []>;

export const useMapStore = create<MapState>(
  (persist as MapPersist)(
    (set, get) => ({
      // Initial state
      maps: {},
      currentMapId: null,
      selectedPinId: null,
      
      // Map actions
      createMap: (name, theme) => {
        const id = `map-${Date.now()}`;
        const timestamp = Date.now();
        
        set((state) => ({
          maps: {
            ...state.maps,
            [id]: {
              id,
              name,
              pins: [],
              theme,
              layout: 'fullscreen' as MapLayout,
              embedOptions: {
                width: '100%',
                height: '500px',
                responsive: true,
                showAttribution: true,
                allowFullscreen: true,
              },
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          },
          currentMapId: id,
        }));
        
        return id;
      },
      
      updateMap: (mapId, data) => {
        set((state) => {
          const map = state.maps[mapId];
          if (!map) return state;
          
          return {
            maps: {
              ...state.maps,
              [mapId]: {
                ...map,
                ...data,
                updatedAt: Date.now(),
              },
            },
          };
        });
      },
      
      deleteMap: (mapId) => {
        set((state) => {
          const { [mapId]: _, ...restMaps } = state.maps;
          
          // If deleting the current map, set current to null or another map
          let currentMapId = state.currentMapId;
          if (currentMapId === mapId) {
            const mapIds = Object.keys(restMaps);
            currentMapId = mapIds.length > 0 ? mapIds[0] : null;
          }
          
          return {
            maps: restMaps,
            currentMapId,
            selectedPinId: null,
          };
        });
      },
      
      setCurrentMap: (mapId) => {
        set({ currentMapId: mapId, selectedPinId: null });
      },
      
      // Pin actions
      addPin: (mapId, pinData) => {
        const pinId = `pin-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        set((state) => {
          const map = state.maps[mapId];
          if (!map) return state;
          
          return {
            maps: {
              ...state.maps,
              [mapId]: {
                ...map,
                pins: [...map.pins, { id: pinId, ...pinData }],
                updatedAt: Date.now(),
              },
            },
          };
        });
        
        return pinId;
      },
      
      updatePin: (mapId, pinId, data) => {
        set((state) => {
          const map = state.maps[mapId];
          if (!map) return state;
          
          return {
            maps: {
              ...state.maps,
              [mapId]: {
                ...map,
                pins: map.pins.map((pin) =>
                  pin.id === pinId ? { ...pin, ...data } : pin
                ),
                updatedAt: Date.now(),
              },
            },
          };
        });
      },
      
      deletePin: (mapId, pinId) => {
        set((state) => {
          const map = state.maps[mapId];
          if (!map) return state;
          
          return {
            maps: {
              ...state.maps,
              [mapId]: {
                ...map,
                pins: map.pins.filter((pin) => pin.id !== pinId),
                updatedAt: Date.now(),
              },
            },
            selectedPinId: state.selectedPinId === pinId ? null : state.selectedPinId,
          };
        });
      },
      
      selectPin: (pinId) => {
        set({ selectedPinId: pinId });
      },
      
      // Theme actions
      setTheme: (mapId, theme) => {
        set((state) => {
          const map = state.maps[mapId];
          if (!map) return state;
          
          return {
            maps: {
              ...state.maps,
              [mapId]: {
                ...map,
                theme,
                updatedAt: Date.now(),
              },
            },
          };
        });
      },
      
      // Layout actions
      setLayout: (mapId, layout) => {
        set((state) => {
          const map = state.maps[mapId];
          if (!map) return state;
          
          return {
            maps: {
              ...state.maps,
              [mapId]: {
                ...map,
                layout,
                updatedAt: Date.now(),
              },
            },
          };
        });
      },
      
      // Embed options actions
      updateEmbedOptions: (mapId, options) => {
        set((state) => {
          const map = state.maps[mapId];
          if (!map) return state;
          
          return {
            maps: {
              ...state.maps,
              [mapId]: {
                ...map,
                embedOptions: {
                  ...map.embedOptions,
                  ...options,
                },
                updatedAt: Date.now(),
              },
            },
          };
        });
      },
    }),
    {
      name: 'mapnest-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Return a mock storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        };
      }),
      partialize: (state) => ({
        maps: state.maps,
        currentMapId: state.currentMapId,
      }),
    }
  )
);