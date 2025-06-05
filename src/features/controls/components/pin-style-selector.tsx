"use client";

import { useMapStore } from '@/features/map/stores/map-store';
import { PinStyle } from '@/types/map-types';

interface PinStyleOption {
  value: PinStyle;
  label: string;
  description: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

const pinStyleOptions: PinStyleOption[] = [
  {
    value: 'classic',
    label: 'Classic',
    description: 'Simple circular pins',
    icon: ClassicPinIcon
  },
  {
    value: 'modern',
    label: 'Modern',
    description: 'Standard map pin design',
    icon: ModernPinIcon
  },
  {
    value: 'minimal',
    label: 'Minimal',
    description: 'Subtle dot indicators',
    icon: MinimalPinIcon
  },
  {
    value: 'animated',
    label: 'Animated',
    description: 'Pins with bounce effect',
    icon: AnimatedPinIcon
  },
];

export function PinStyleSelector() {
  const { pinStyle, setPinStyle } = useMapStore();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Pin Style</h3>
        <p className="text-sm text-muted-foreground">
          Choose how location pins appear on your map
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {pinStyleOptions.map((option) => (
          <PinStyleCard
            key={option.value}
            pinStyle={option}
            isSelected={pinStyle === option.value}
            onClick={() => setPinStyle(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

interface PinStyleCardProps {
  pinStyle: PinStyleOption;
  isSelected: boolean;
  onClick: () => void;
}

function PinStyleCard({ pinStyle, isSelected, onClick }: PinStyleCardProps) {
  const { icon: PinIcon } = pinStyle;
  
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
          <PinIcon className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium">{pinStyle.label}</h4>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {pinStyle.description}
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

function ClassicPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function ModernPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" fill="white" />
    </svg>
  );
}

function MinimalPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.7"
    >
      <circle cx="12" cy="12" r="6" />
    </svg>
  );
}

function AnimatedPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-bounce"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" fill="white" />
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