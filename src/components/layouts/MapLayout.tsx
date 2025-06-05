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
  // Render different layouts based on the layout type
  switch (layout) {
    case 'fullscreen':
      return (
        <div className={cn('w-full h-full relative', className)}>
          {mapComponent}
        </div>
      );

    case 'split':
      return (
        <div className={cn('w-full h-full flex flex-col md:flex-row', className)}>
          <div className="w-full md:w-1/3 lg:w-1/4 h-80 md:h-full overflow-auto">
            {sidebarComponent}
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 h-[calc(100%-20rem)] md:h-full">
            {mapComponent}
          </div>
        </div>
      );

    case 'sidebar-right':
      return (
        <div className={cn('w-full h-full flex flex-col md:flex-row', className)}>
          <div className="w-full md:w-2/3 lg:w-3/4 h-[calc(100%-20rem)] md:h-full">
            {mapComponent}
          </div>
          <div className="w-full md:w-1/3 lg:w-1/4 h-80 md:h-full overflow-auto">
            {sidebarComponent}
          </div>
        </div>
      );

    case 'floating-card':
      return (
        <div className={cn('w-full h-full relative', className)}>
          {mapComponent}
          {sidebarComponent && (
            <div className="absolute top-4 left-4 w-80 max-h-[calc(100%-2rem)] overflow-auto rounded-lg shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              {sidebarComponent}
            </div>
          )}
        </div>
      );

    case 'list-mode':
      return (
        <div className={cn('w-full h-full flex flex-col', className)}>
          <div className="w-full h-64 md:h-72">{mapComponent}</div>
          <div className="w-full flex-1 overflow-auto">{sidebarComponent}</div>
        </div>
      );

    default:
      return (
        <div className={cn('w-full h-full relative', className)}>
          {mapComponent}
          {sidebarComponent}
        </div>
      );
  }
}