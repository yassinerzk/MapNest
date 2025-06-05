"use client";

import { useMapStore } from '@/features/map/stores/map-store';
import { LayoutType } from '@/types/map-types';

interface LayoutOption {
  value: LayoutType;
  label: string;
  description: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

const layoutOptions: LayoutOption[] = [
  {
    value: 'split-view',
    label: 'Split View',
    description: 'Map with sidebar for location details',
    icon: SplitViewIcon
  },
  {
    value: 'full-screen',
    label: 'Full Screen',
    description: 'Maximized map with collapsible overlay',
    icon: FullScreenIcon
  },
  {
    value: 'card-overlay',
    label: 'Card Overlay',
    description: 'Map with floating cards for locations',
    icon: CardOverlayIcon
  },
  {
    value: 'list-mode',
    label: 'List Mode',
    description: 'Equal split between list and map',
    icon: ListModeIcon
  },
];

export function LayoutSelector() {
  const { layout, setLayout } = useMapStore();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Layout</h3>
        <p className="text-sm text-muted-foreground">
          Choose how your map and location list are displayed
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {layoutOptions.map((option) => (
          <LayoutCard
            key={option.value}
            layout={option}
            isSelected={layout === option.value}
            onClick={() => setLayout(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

interface LayoutCardProps {
  layout: LayoutOption;
  isSelected: boolean;
  onClick: () => void;
}

function LayoutCard({ layout, isSelected, onClick }: LayoutCardProps) {
  const { icon: LayoutIcon } = layout;
  
  return (
    <div
      className={`
        relative rounded-lg border p-3 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:border-border'}
      `}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-md bg-muted">
          <LayoutIcon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium">{layout.label}</h4>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {layout.description}
          </p>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-3 right-3 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
          <CheckIcon className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}

function SplitViewIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

function FullScreenIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect width="10" height="8" x="7" y="8" rx="1" />
    </svg>
  );
}

function CardOverlayIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <rect width="10" height="6" x="7" y="13" rx="1" />
    </svg>
  );
}

function ListModeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M12 3v18" />
      <path d="M3 9h9" />
      <path d="M3 15h9" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}