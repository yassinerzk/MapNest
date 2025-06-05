'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { MapPin } from '@/types';

interface SidebarProps {
  pins: MapPin[];
  activePinId?: string;
  onPinClick: (pin: MapPin) => void;
  className?: string;
  isCollapsible?: boolean;
  showSearch?: boolean;
  glassmorphism?: boolean;
}

export function Sidebar({
  pins,
  activePinId,
  onPinClick,
  className,
  isCollapsible = true,
  showSearch = true,
  glassmorphism = true,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter pins based on search query
  const filteredPins = searchQuery
    ? pins.filter(pin => 
        pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pins;

  return (
    <div 
      className={cn(
        'flex flex-col h-full transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-12' : 'w-full md:w-80 lg:w-96',
        glassmorphism ? 'glass-effect' : 'bg-white dark:bg-gray-800',
        'border-r border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h2 className="font-semibold text-lg">Locations</h2>
        )}
        
        {isCollapsible && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Search */}
      {!isCollapsed && showSearch && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* Pin List */}
      {!isCollapsed ? (
        <div className="flex-1 overflow-y-auto">
          {filteredPins.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPins.map((pin) => (
                <li 
                  key={pin.id}
                  className={cn(
                    'transition-colors cursor-pointer',
                    pin.id === activePinId
                      ? 'bg-blue-50 dark:bg-blue-900/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  )}
                  onClick={() => onPinClick(pin)}
                >
                  <div className="flex p-4">
                    {pin.imageUrl && (
                      <div className="flex-shrink-0 mr-4">
                        <div 
                          className="w-16 h-16 rounded-md bg-cover bg-center" 
                          style={{ backgroundImage: `url(${pin.imageUrl})` }}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        {pin.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-2">
                            {pin.category}
                          </span>
                        )}
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {pin.title}
                        </h3>
                      </div>
                      {pin.description && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {pin.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: pin.color || '#3B82F6' }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No locations match your search' : 'No locations available'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center pt-4 space-y-4">
          {pins.slice(0, 5).map((pin) => (
            <button
              key={pin.id}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                pin.id === activePinId && 'ring-2 ring-primary'
              )}
              style={{ backgroundColor: pin.color || '#3B82F6' }}
              onClick={() => onPinClick(pin)}
              title={pin.title}
            >
              <span className="sr-only">{pin.title}</span>
            </button>
          ))}
          
          {pins.length > 5 && (
            <div 
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium"
              title="More locations"
            >
              +{pins.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
}