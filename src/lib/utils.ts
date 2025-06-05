import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 * Useful for conditional classes and maintaining Tailwind's utility priority
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a latitude/longitude position for display
 */
export function formatLatLng(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

/**
 * Generates a random color from our theme palette
 * Used for pin generation when user doesn't specify a color
 */
export function getRandomThemeColor(): string {
  const colors = [
    "primary",
    "secondary",
    "accent",
    "blue-500",
    "emerald-500",
    "violet-500",
    "amber-500",
    "rose-500"
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Debounce function to limit how often a function can be called
 * Useful for search inputs and map interactions
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}