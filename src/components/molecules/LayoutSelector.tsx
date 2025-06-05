'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { MapLayout } from '@/types';

interface LayoutOption {
  id: MapLayout;
  name: string;
  icon: React.ReactNode;
}

interface LayoutSelectorProps {
  currentLayout: MapLayout;
  onLayoutChange: (layout: MapLayout) => void;
  className?: string;
}

export function LayoutSelector({
  currentLayout,
  onLayoutChange,
  className,
}: LayoutSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Layout options with icons
  const layoutOptions: LayoutOption[] = [
    {
      id: 'fullscreen',
      name: 'Fullscreen',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        </svg>
      ),
    },
    {
      id: 'split',
      name: 'Split View',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      ),
    },
    {
      id: 'sidebar-right',
      name: 'Right Sidebar',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
      ),
    },
    {
      id: 'floating-card',
      name: 'Floating Card',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <rect x="5" y="5" width="8" height="8" rx="1" ry="1"></rect>
        </svg>
      ),
    },
    {
      id: 'list-mode',
      name: 'List Mode',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      ),
    },
  ];

  // Find current layout option
  const currentOption = layoutOptions.find((option) => option.id === currentLayout) || layoutOptions[0];

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <span className="mr-2">{currentOption.icon}</span>
          <span>{currentOption.name}</span>
        </div>
        <svg
          className={cn('h-5 w-5 text-gray-400 transition-transform', isOpen ? 'rotate-180' : '')}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {layoutOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onLayoutChange(option.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center w-full px-4 py-2 text-sm text-left',
                  currentLayout === option.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
                role="menuitem"
              >
                <span className="mr-2">{option.icon}</span>
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}