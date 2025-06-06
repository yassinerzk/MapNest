'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { mapDatabase } from '@/lib/database';
import type { MapPin, MapTheme, MapLayout, EmbedOptions } from '@/types';

interface SaveButtonProps {
  mapId: string;
  mapName: string;
  pins: MapPin[];
  theme?: MapTheme;
  layout: MapLayout;
  embedOptions: Partial<EmbedOptions>;
  onSaveSuccess?: () => void;
  onSaveError?: (error: string) => void;
  className?: string;
}

export function SaveButton({
  mapId,
  mapName,
  pins,
  theme,
  layout,
  embedOptions,
  onSaveSuccess,
  onSaveError,
  className,
}: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Get the current map data to preserve other fields
      const currentMap = mapDatabase.getMap(mapId);
      if (!currentMap) {
        throw new Error('Map not found');
      }
      
      // Update the map with new data
      const updatedMap = mapDatabase.updateMap(mapId, {
        name: mapName,
        pins,
        theme,
        layout,
        embedOptions: {
          ...currentMap.embedOptions,
          ...embedOptions,
          mapId: mapId, // Ensure mapId is always set
        },
      });
      
      setLastSaved(new Date());
      onSaveSuccess?.();
    } catch (error) {
      console.error('Save error:', error);
      onSaveError?.(error instanceof Error ? error.message : 'Failed to save map');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    try {
      mapDatabase.exportToFile();
    } catch (error) {
      console.error('Export error:', error);
      onSaveError?.(error instanceof Error ? error.message : 'Failed to export data');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          mapDatabase.importFromJson(content);
          onSaveSuccess?.();
        } catch (error) {
          console.error('Import error:', error);
          onSaveError?.(error instanceof Error ? error.message : 'Failed to import data');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className={cn('flex flex-col space-y-3', className)}>
      <h3 className="text-lg font-medium">Save & Export</h3>
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'flex items-center justify-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            isSaving && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSaving ? 'Saving...' : 'Save Map'}
        </button>
        
        {lastSaved && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
        
        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleExport}
            className="flex-1 px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Export
          </button>
          <button
            onClick={handleImport}
            className="flex-1 px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}