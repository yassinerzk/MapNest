'use client';

import type { MapPin, MapTheme, MapLayout, EmbedOptions } from '@/types';

interface SavedMapData {
  id: string;
  name: string;
  pins: MapPin[];
  theme?: MapTheme;
  layout: MapLayout;
  embedOptions: Partial<EmbedOptions>;
  createdAt: number;
  updatedAt: number;
}

interface FileStorageData {
  maps: Record<string, SavedMapData>;
  currentMapId: string | null;
}

const STORAGE_KEY = 'mapnest_data';

export class FileStorage {
  private static instance: FileStorage;
  private data: FileStorageData;

  private constructor() {
    this.data = this.loadFromStorage();
  }

  static getInstance(): FileStorage {
    if (!FileStorage.instance) {
      FileStorage.instance = new FileStorage();
    }
    return FileStorage.instance;
  }

  private loadFromStorage(): FileStorageData {
    if (typeof window === 'undefined') {
      return { maps: {}, currentMapId: null };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }

    return { maps: {}, currentMapId: null };
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  saveMap(mapData: {
    id: string;
    name: string;
    pins: MapPin[];
    theme?: MapTheme;
    layout: MapLayout;
    embedOptions: Partial<EmbedOptions>;
  }): void {
    const now = Date.now();
    const existingMap = this.data.maps[mapData.id];
    
    this.data.maps[mapData.id] = {
      ...mapData,
      createdAt: existingMap?.createdAt || now,
      updatedAt: now,
    };

    this.saveToStorage();
  }

  loadMap(mapId: string): SavedMapData | null {
    return this.data.maps[mapId] || null;
  }

  getAllMaps(): SavedMapData[] {
    return Object.values(this.data.maps);
  }

  deleteMap(mapId: string): void {
    delete this.data.maps[mapId];
    if (this.data.currentMapId === mapId) {
      this.data.currentMapId = null;
    }
    this.saveToStorage();
  }

  setCurrentMap(mapId: string): void {
    this.data.currentMapId = mapId;
    this.saveToStorage();
  }

  getCurrentMapId(): string | null {
    return this.data.currentMapId;
  }

  exportToFile(): void {
    const dataStr = JSON.stringify(this.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mapnest-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  importFromFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          
          // Validate the structure
          if (importedData.maps && typeof importedData.maps === 'object') {
            this.data = {
              maps: importedData.maps,
              currentMapId: importedData.currentMapId || null,
            };
            this.saveToStorage();
            resolve();
          } else {
            reject(new Error('Invalid file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  clearAll(): void {
    this.data = { maps: {}, currentMapId: null };
    this.saveToStorage();
  }
}

export const fileStorage = FileStorage.getInstance();