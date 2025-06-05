"use client";

import { useState } from 'react';
import { MapContainer } from '@/features/map/components/map-container';
import { Sidebar } from '@/features/sidebar/components/sidebar';
import { ControlPanel } from '@/features/controls/components/control-panel';
import { useMapStore } from '@/features/map/stores/map-store';
import { MapTheme, LayoutType } from '@/types/map-types';

export function MapDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, layout, locations } = useMapStore();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Map Customizer</h1>
        <p className="text-muted-foreground">
          Create and customize your map with various layouts, themes, and pin styles.
        </p>
      </div>

      <ControlPanel />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-300px)] min-h-[500px]">
        {renderLayout(layout, theme, sidebarOpen, setSidebarOpen, locations)}
      </div>
    </div>
  );
}

function renderLayout(
  layout: LayoutType,
  theme: MapTheme,
  sidebarOpen: boolean,
  setSidebarOpen: (open: boolean) => void,
  locations: any[]
) {
  switch (layout) {
    case 'split-view':
      return (
        <>
          <div className={`${sidebarOpen ? 'lg:col-span-4' : 'lg:col-span-1'} transition-all duration-300 ease-in-out`}>
            <Sidebar 
              isOpen={sidebarOpen} 
              onToggle={() => setSidebarOpen(!sidebarOpen)} 
              locations={locations} 
            />
          </div>
          <div className={`${sidebarOpen ? 'lg:col-span-8' : 'lg:col-span-11'} transition-all duration-300 ease-in-out`}>
            <MapContainer />
          </div>
        </>
      );
    
    case 'full-screen':
      return (
        <>
          <div className="lg:col-span-12 relative">
            <MapContainer />
            {sidebarOpen && (
              <div className="absolute top-4 left-4 w-80 max-h-[calc(100%-32px)] z-10">
                <Sidebar 
                  isOpen={sidebarOpen} 
                  onToggle={() => setSidebarOpen(!sidebarOpen)} 
                  locations={locations} 
                  floating 
                />
              </div>
            )}
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="absolute top-4 left-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-md shadow-md"
                aria-label="Open sidebar"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </>
      );
    
    case 'card-overlay':
      return (
        <>
          <div className="lg:col-span-12 relative">
            <MapContainer />
            {locations.length > 0 && (
              <div className="absolute bottom-4 left-0 right-0 mx-auto w-full max-w-3xl px-4 z-10">
                <div className="glass-effect rounded-xl p-4 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Featured Locations</h3>
                    <button 
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground"
                      aria-label={sidebarOpen ? "Show less" : "Show more"}
                    >
                      {sidebarOpen ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  {sidebarOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 max-h-60 overflow-y-auto">
                      {locations.slice(0, 6).map((location) => (
                        <div key={location.id} className="bg-background/50 backdrop-blur-sm p-3 rounded-lg">
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-muted-foreground">{location.address}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      );
    
    case 'list-mode':
      return (
        <>
          <div className="lg:col-span-6">
            <Sidebar 
              isOpen={true} 
              onToggle={() => {}} 
              locations={locations} 
              expanded 
            />
          </div>
          <div className="lg:col-span-6">
            <MapContainer />
          </div>
        </>
      );
    
    default:
      return (
        <>
          <div className="lg:col-span-4">
            <Sidebar 
              isOpen={sidebarOpen} 
              onToggle={() => setSidebarOpen(!sidebarOpen)} 
              locations={locations} 
            />
          </div>
          <div className="lg:col-span-8">
            <MapContainer />
          </div>
        </>
      );
  }
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function ChevronUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}