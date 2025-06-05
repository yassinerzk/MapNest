"use client";

import { useMapStore } from '@/features/map/stores/map-store';
import { LocationCard } from './location-card';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  locations: any[];
  floating?: boolean;
  expanded?: boolean;
}

export function Sidebar({ 
  isOpen, 
  onToggle, 
  locations, 
  floating = false,
  expanded = false 
}: SidebarProps) {
  const { selectedLocationId, setSelectedLocationId } = useMapStore();

  return (
    <div 
      className={cn(
        "h-full flex flex-col transition-all duration-300 ease-in-out",
        floating ? "glass-effect rounded-xl shadow-lg" : "bg-background border rounded-xl",
        !isOpen && !floating && "w-10"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className={cn("font-semibold transition-opacity", !isOpen && !floating && "opacity-0")}>
          Locations
        </h2>
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Locations List */}
      {isOpen && (
        <div className={cn(
          "flex-1 overflow-y-auto p-4",
          expanded ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"
        )}>
          {locations.length > 0 ? (
            locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                isSelected={selectedLocationId === location.id}
                onClick={() => setSelectedLocationId(location.id)}
                expanded={expanded}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <MapPinOffIcon className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="font-medium">No locations</h3>
              <p className="text-sm text-muted-foreground">
                Add locations to see them here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function MapPinOffIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m9.5 14.5 3-3" />
      <path d="M14.5 9.5 16 8" />
      <path d="m3 3 18 18" />
      <path d="M7.1 7.1C7 7.4 7 7.7 7 8c0 3 4 8 5 8.5 1-0.5 5-5.5 5-8.5 0-.3 0-.6-.1-.9" />
      <path d="M13.1 13.1 12 17l-1.1-3.9" />
      <path d="M12 6c.7 0 1.4.3 1.9.8" />
      <path d="M12 6c-.3 0-.5 0-.8.1" />
    </svg>
  );
}