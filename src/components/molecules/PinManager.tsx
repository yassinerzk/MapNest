'use client';

import { useState } from 'react';
import { cn, getRandomThemeColor } from '@/lib/utils';
import { AddressSearch } from './AddressSearch';
import type { MapPin } from '@/types';

interface PinManagerProps {
  pins: MapPin[];
  onPinAdd: (pin: Omit<MapPin, 'id'>) => void;
  onPinUpdate: (pin: MapPin) => void;
  onPinDelete: (pinId: string) => void;
  apiKey: string;
  className?: string;
}

export function PinManager({
  pins,
  onPinAdd,
  onPinUpdate,
  onPinDelete,
  apiKey,
  className,
}: PinManagerProps) {
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [editingPinId, setEditingPinId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MapPin>>({
    title: '',
    lat: 0,
    lng: 0,
    description: '',
    color: getRandomThemeColor(),
    category: '',
  });

  const editingPin = editingPinId ? pins.find(pin => pin.id === editingPinId) : null;
  const isEditing = Boolean(editingPinId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && editingPinId) {
      onPinUpdate({
        ...formData,
        id: editingPinId,
      } as MapPin);
    } else {
      onPinAdd(formData as Omit<MapPin, 'id'>);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      lat: 0,
      lng: 0,
      description: '',
      color: getRandomThemeColor(),
      category: '',
    });
    setIsAddingPin(false);
    setEditingPinId(null);
  };

  const handleEditPin = (pin: MapPin) => {
    setFormData(pin);
    setEditingPinId(pin.id);
    setIsAddingPin(true);
  };

  const handleDeletePin = (pinId: string) => {
    if (confirm('Are you sure you want to delete this pin?')) {
      onPinDelete(pinId);
      if (editingPinId === pinId) {
        resetForm();
      }
    }
  };

  const handleAddressSelect = (place: {
    address: string;
    lat: number;
    lng: number;
    placeId?: string;
  }) => {
    setFormData({
      ...formData,
      lat: place.lat,
      lng: place.lng,
      // If title is empty, use the address as title
      title: formData.title || place.address.split(',')[0] || '',
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Manage Pins</h2>
        <button
          type="button"
          onClick={() => setIsAddingPin(!isAddingPin)}
          className={cn(
            'px-4 py-2 rounded-md transition-colors',
            isAddingPin
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              : 'bg-primary text-white'
          )}
        >
          {isAddingPin ? 'Cancel' : '+ Add Pin'}
        </button>
      </div>

      {isAddingPin && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="font-medium">{isEditing ? 'Edit Pin' : 'Add New Pin'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="pin-title" className="block text-sm font-medium">
                Title *
              </label>
              <input
                id="pin-title"
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pin-category" className="block text-sm font-medium">
                Category
              </label>
              <input
                id="pin-category"
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pin-lat" className="block text-sm font-medium">
                Latitude *
              </label>
              <input
                id="pin-lat"
                type="number"
                step="any"
                required
                value={formData.lat || 0}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pin-lng" className="block text-sm font-medium">
                Longitude *
              </label>
              <input
                id="pin-lng"
                type="number"
                step="any"
                required
                value={formData.lng || 0}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Address Search */}
          <AddressSearch
            apiKey={apiKey}
            onPlaceSelect={handleAddressSelect}
            placeholder="Search for an address or place..."
          />

          <div className="space-y-2">
            <label htmlFor="pin-description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="pin-description"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="pin-color" className="block text-sm font-medium">
              Pin Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="pin-color"
                type="color"
                value={formData.color || '#3B82F6'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formData.color || '#3B82F6'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="pin-image" className="block text-sm font-medium">
              Image URL
            </label>
            <input
              id="pin-image"
              type="url"
              value={formData.imageUrl || ''}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              {isEditing ? 'Update Pin' : 'Add Pin'}
            </button>
          </div>
        </form>
      )}

      {/* Pin List */}
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">Your Pins ({pins.length})</h3>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {pins.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {pins.map((pin) => (
                <li key={pin.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: pin.color || '#3B82F6' }}
                      aria-hidden="true"
                    />
                    <div>
                      <h4 className="font-medium">{pin.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditPin(pin)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      aria-label={`Edit ${pin.title}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePin(pin.id)}
                      className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      aria-label={`Delete ${pin.title}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No pins added yet. Click "Add Pin" to create your first pin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}