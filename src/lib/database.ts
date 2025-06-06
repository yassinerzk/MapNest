/**
 * Database simulation for MapNest
 * Stores maps with complete metadata including pins, location, theme, and layout
 */

import type { MapPin, MapTheme, MapLayout, EmbedOptions } from '@/types';

export interface MapData {
  id: string;
  name: string;
  description?: string;
  pins: MapPin[];
  theme: MapTheme;
  layout: MapLayout;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  embedOptions: EmbedOptions;
  isPublic: boolean;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  createdBy?: string; // Future user system
}

export interface DatabaseData {
  maps: Record<string, MapData>;
  metadata: {
    version: string;
    lastBackup?: number;
    totalMaps: number;
  };
}

const STORAGE_KEY = 'mapnest_database';
const DB_VERSION = '1.0.0';

export class MapDatabase {
  private static instance: MapDatabase;
  private data: DatabaseData;

  private constructor() {
    this.data = this.loadFromStorage();
  }

  static getInstance(): MapDatabase {
    if (!MapDatabase.instance) {
      MapDatabase.instance = new MapDatabase();
    }
    return MapDatabase.instance;
  }

  private loadFromStorage(): DatabaseData {
    if (typeof window === 'undefined') {
      return this.getDefaultData();
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old data if needed
        return this.migrateData(parsed);
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }

    return this.getDefaultData();
  }

  private getDefaultData(): DatabaseData {
    return {
      maps: {},
      metadata: {
        version: DB_VERSION,
        totalMaps: 0,
      },
    };
  }

  private migrateData(data: any): DatabaseData {
    // Handle migration from old fileStorage format
    if (data.maps && !data.metadata) {
      const migratedMaps: Record<string, MapData> = {};
      
      Object.entries(data.maps).forEach(([id, oldMap]: [string, any]) => {
        migratedMaps[id] = {
          id,
          name: oldMap.name || `Map ${id}`,
          description: '',
          pins: oldMap.pins || [],
          theme: oldMap.theme || { id: 'default', name: 'Default', styles: [], primaryColor: 'blue', secondaryColor: 'gray', pinColor: 'red', isDark: false },
          layout: oldMap.layout || 'fullscreen',
          center: {
            lat: 40.7128,
            lng: -74.006,
          },
          zoom: 10,
          embedOptions: {
            mapId: id,
            width: '100%',
            height: '500px',
            responsive: true,
            showAttribution: true,
            allowFullscreen: true,
            showFullInterface: false,
            ...oldMap.embedOptions,
          },
          isPublic: false,
          tags: [],
          createdAt: oldMap.createdAt || Date.now(),
          updatedAt: oldMap.updatedAt || Date.now(),
        };
      });

      return {
        maps: migratedMaps,
        metadata: {
          version: DB_VERSION,
          totalMaps: Object.keys(migratedMaps).length,
        },
      };
    }

    return data;
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      this.data.metadata.totalMaps = Object.keys(this.data.maps).length;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  // Generate unique ID for new maps
  generateMapId(): string {
    return `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create a new map
  createMap(mapData: Omit<MapData, 'id' | 'createdAt' | 'updatedAt'>): MapData {
    const id = this.generateMapId();
    const now = Date.now();
    
    const newMap: MapData = {
      ...mapData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.data.maps[id] = newMap;
    this.saveToStorage();
    
    return newMap;
  }

  // Update existing map
  updateMap(id: string, updates: Partial<Omit<MapData, 'id' | 'createdAt'>>): MapData | null {
    const existingMap = this.data.maps[id];
    if (!existingMap) {
      return null;
    }

    const updatedMap: MapData = {
      ...existingMap,
      ...updates,
      id, // Ensure ID doesn't change
      createdAt: existingMap.createdAt, // Preserve creation date
      updatedAt: Date.now(),
    };

    this.data.maps[id] = updatedMap;
    this.saveToStorage();
    
    return updatedMap;
  }

  // Get map by ID
  getMap(id: string): MapData | null {
    return this.data.maps[id] || null;
  }

  // Get all maps
  getAllMaps(): MapData[] {
    return Object.values(this.data.maps).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // Get maps by criteria
  getMaps(criteria: {
    isPublic?: boolean;
    tags?: string[];
    search?: string;
    limit?: number;
  } = {}): MapData[] {
    let maps = this.getAllMaps();

    if (criteria.isPublic !== undefined) {
      maps = maps.filter(map => map.isPublic === criteria.isPublic);
    }

    if (criteria.tags && criteria.tags.length > 0) {
      maps = maps.filter(map => 
        criteria.tags!.some(tag => map.tags.includes(tag))
      );
    }

    if (criteria.search) {
      const searchLower = criteria.search.toLowerCase();
      maps = maps.filter(map => 
        map.name.toLowerCase().includes(searchLower) ||
        map.description?.toLowerCase().includes(searchLower) ||
        map.pins.some(pin => 
          pin.title.toLowerCase().includes(searchLower) ||
          pin.description?.toLowerCase().includes(searchLower)
        )
      );
    }

    if (criteria.limit) {
      maps = maps.slice(0, criteria.limit);
    }

    return maps;
  }

  // Delete map
  deleteMap(id: string): boolean {
    if (this.data.maps[id]) {
      delete this.data.maps[id];
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Duplicate map
  duplicateMap(id: string, newName?: string): MapData | null {
    const originalMap = this.getMap(id);
    if (!originalMap) {
      return null;
    }

    const duplicatedMap = this.createMap({
      ...originalMap,
      name: newName || `${originalMap.name} (Copy)`,
      pins: originalMap.pins.map(pin => ({
        ...pin,
        id: `pin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
    });

    return duplicatedMap;
  }

  // Get database statistics
  getStats() {
    const maps = this.getAllMaps();
    const totalPins = maps.reduce((sum, map) => sum + map.pins.length, 0);
    const publicMaps = maps.filter(map => map.isPublic).length;
    const themes = [...new Set(maps.map(map => map.theme.id))];
    const layouts = [...new Set(maps.map(map => map.layout))];

    return {
      totalMaps: maps.length,
      totalPins,
      publicMaps,
      privateMaps: maps.length - publicMaps,
      uniqueThemes: themes.length,
      uniqueLayouts: layouts.length,
      oldestMap: maps.length > 0 ? Math.min(...maps.map(m => m.createdAt)) : null,
      newestMap: maps.length > 0 ? Math.max(...maps.map(m => m.createdAt)) : null,
    };
  }

  // Export database
  exportDatabase(): string {
    return JSON.stringify(this.data, null, 2);
  }

  // Import database
  importDatabase(jsonData: string): void {
    try {
      const importedData = JSON.parse(jsonData);
      this.data = this.migrateData(importedData);
      this.saveToStorage();
    } catch (error) {
      throw new Error('Invalid database format');
    }
  }

  // Clear all data
  clearDatabase(): void {
    this.data = this.getDefaultData();
    this.saveToStorage();
  }

  // Backup database
  createBackup(): void {
    const backup = this.exportDatabase();
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mapnest-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    this.data.metadata.lastBackup = Date.now();
    this.saveToStorage();
  }
}

// Export singleton instance
export const mapDatabase = MapDatabase.getInstance();