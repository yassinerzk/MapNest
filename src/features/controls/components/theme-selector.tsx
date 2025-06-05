"use client";

import { useMapStore } from '@/features/map/stores/map-store';
import { MapTheme } from '@/types/map-types';

interface ThemeOption {
  value: MapTheme;
  label: string;
  description: string;
  preview: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: 'midnight',
    label: 'Midnight',
    description: 'Dark blue theme with vibrant accents',
    preview: 'linear-gradient(to right, #0f172a, #1e293b)'
  },
  {
    value: 'sunset',
    label: 'Sunset',
    description: 'Warm orange and pink gradients',
    preview: 'linear-gradient(to right, #f97316, #ec4899)'
  },
  {
    value: 'aqua',
    label: 'Aqua Pop',
    description: 'Bright teal and blue tones',
    preview: 'linear-gradient(to right, #06b6d4, #3b82f6)'
  },
  {
    value: 'forest',
    label: 'Forest',
    description: 'Natural green and earth tones',
    preview: 'linear-gradient(to right, #16a34a, #65a30d)'
  },
  {
    value: 'lavender',
    label: 'Lavender',
    description: 'Soft purple and pink hues',
    preview: 'linear-gradient(to right, #8b5cf6, #d946ef)'
  },
  {
    value: 'silver',
    label: 'Silver',
    description: 'Minimalist grayscale design',
    preview: 'linear-gradient(to right, #94a3b8, #cbd5e1)'
  },
];

export function ThemeSelector() {
  const { theme, setTheme } = useMapStore();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Map Theme</h3>
        <p className="text-sm text-muted-foreground">
          Choose a color theme for your map
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {themeOptions.map((option) => (
          <ThemeCard
            key={option.value}
            theme={option}
            isSelected={theme === option.value}
            onClick={() => setTheme(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

interface ThemeCardProps {
  theme: ThemeOption;
  isSelected: boolean;
  onClick: () => void;
}

function ThemeCard({ theme, isSelected, onClick }: ThemeCardProps) {
  return (
    <div
      className={`
        relative rounded-lg border p-2 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:border-border'}
      `}
      onClick={onClick}
    >
      <div 
        className="h-16 rounded-md mb-2" 
        style={{ background: theme.preview }}
      />
      <div className="space-y-1">
        <h4 className="text-sm font-medium">{theme.label}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {theme.description}
        </p>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
          <CheckIcon className="h-3 w-3" />
        </div>
      )}
    </div>
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