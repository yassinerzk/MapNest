'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { MapLayout as MapLayoutType } from '@/types';

interface MapLayoutProps {
  layout: MapLayoutType;
  mapComponent: ReactNode;
  sidebarComponent?: ReactNode;
  className?: string;
}

export function MapLayout({
  layout,
  mapComponent,
  sidebarComponent,
  className,
}: MapLayoutProps) {
  const renderLayout = () => {
    switch (layout) {
      case 'fullscreen':
        return (
          <div className="w-full h-full min-h-[400px]">
            {mapComponent}
          </div>
        );

      case 'split':
        return (
          <div className="flex flex-col lg:flex-row w-full min-h-[400px]">
            <div className="flex-1 min-w-0 min-h-[300px] lg:min-h-[400px]">
              {mapComponent}
            </div>
            {sidebarComponent && (
              <div className="w-full lg:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[300px] lg:max-h-none">
                {sidebarComponent}
              </div>
            )}
          </div>
        );

      case 'sidebar-right':
        return (
          <div className="flex flex-col lg:flex-row w-full min-h-[400px]">
            <div className="flex-1 min-w-0 min-h-[300px] lg:min-h-[400px]">
              {mapComponent}
            </div>
            {sidebarComponent && (
              <div className="w-full lg:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[300px] lg:max-h-none">
                {sidebarComponent}
              </div>
            )}
          </div>
        );

      case 'floating-card':
        return (
          <div className="relative w-full min-h-[400px]">
            {mapComponent}
            {sidebarComponent && (
              <div className="absolute top-2 right-2 left-2 sm:top-4 sm:right-4 sm:left-auto w-auto sm:w-80 max-h-[50%] sm:max-h-[calc(100%-2rem)] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                {sidebarComponent}
              </div>
            )}
          </div>
        );

      case 'list-mode':
        return (
          <div className="flex flex-col w-full">
            <div className="flex-1 min-h-[250px] sm:min-h-[300px]">
              {mapComponent}
            </div>
            {sidebarComponent && (
              <div className="h-48 sm:h-64 flex-shrink-0 border-t border-gray-200 dark:border-gray-700 overflow-y-auto">
                {sidebarComponent}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="w-full h-full min-h-[400px]">
            {mapComponent}
          </div>
        );
    }
  };

  return (
    <div className={cn(className)}>
      {renderLayout()}
    </div>
  );
}