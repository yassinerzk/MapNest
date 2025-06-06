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
      mapDatabase.updateMap(mapId, {
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
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        await mapDatabase.importFromFile(file);
        onSaveSuccess?.();
        // Reload the page to reflect imported data
        window.location.reload();
      } catch (error) {
        console.error('Import error:', error);
        onSaveError?.(error instanceof Error ? error.message : 'Failed to import data');
      }
    };
    
    input.click();
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Save Map</h3>
        {lastSaved && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Last saved: {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'flex-1 px-4 py-2 rounded-md font-medium transition-colors',
            'bg-green-600 hover:bg-green-700 text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-green-500'
          )}
        >
          {isSaving ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save Map'
          )}
        </button>
        
        <button
          onClick={handleExport}
          className={cn(
            'px-4 py-2 rounded-md font-medium transition-colors',
            'bg-blue-600 hover:bg-blue-700 text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500'
          )}
        >
          Export
        </button>
        
        <button
          onClick={handleImport}
          className={cn(
            'px-4 py-2 rounded-md font-medium transition-colors',
            'bg-purple-600 hover:bg-purple-700 text-white',
            'focus:outline-none focus:ring-2 focus:ring-purple-500'
          )}
        >
          Import
        </button>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>• Save: Stores map data locally in browser storage</p>
        <p>• Export: Downloads map data as JSON file</p>
        <p>• Import: Loads map data from JSON file</p>
      </div>
    </div>
  );
}