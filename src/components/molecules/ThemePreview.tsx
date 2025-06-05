'use client';

import { useEffect, useRef } from 'react';
import type { MapTheme } from '@/types';
import { cn } from '@/lib/utils';

interface ThemePreviewProps {
  theme: MapTheme;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  showDetails?: boolean;
}

export function ThemePreview({
  theme,
  isSelected = false,
  onClick,
  className,
  showDetails = true
}: ThemePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const size = 120;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw a simplified map preview based on theme colors
    drawMapPreview(ctx, theme, size);
  }, [theme]);

  const drawMapPreview = (ctx: CanvasRenderingContext2D, theme: MapTheme, size: number) => {
    // Background (land)
    const landColor = theme.isDark ? '#1a1a1a' : '#f5f5f5';
    ctx.fillStyle = landColor;
    ctx.fillRect(0, 0, size, size);

    // Water areas (simplified)
    ctx.fillStyle = getWaterColor(theme);
    ctx.beginPath();
    ctx.arc(size * 0.2, size * 0.3, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(size * 0.8, size * 0.7, size * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Roads (simplified)
    ctx.strokeStyle = getRoadColor(theme);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.5);
    ctx.lineTo(size, size * 0.5);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(size * 0.6, 0);
    ctx.lineTo(size * 0.6, size);
    ctx.stroke();

    // Pins (sample locations)
    const pinPositions = [
      { x: size * 0.3, y: size * 0.4 },
      { x: size * 0.7, y: size * 0.3 },
      { x: size * 0.5, y: size * 0.7 }
    ];

    pinPositions.forEach(pos => {
      drawPin(ctx, pos.x, pos.y, theme.pinColor);
    });
  };

  const getWaterColor = (theme: MapTheme): string => {
    // Extract water color from theme styles or use default
    const waterStyle = theme.styles.find(style => 
      style.featureType === 'water'
    );
    
    if (waterStyle?.stylers) {
      const colorStyler = waterStyle.stylers.find(styler => 
        styler && typeof styler === 'object' && 'color' in styler
      );
      if (colorStyler && 'color' in colorStyler && typeof colorStyler.color === 'string') {
        return colorStyler.color;
      }
    }
    
    return theme.isDark ? '#1a237e' : '#aee6f9';
  };

  const getRoadColor = (theme: MapTheme): string => {
    // Extract road color from theme styles or use default
    const roadStyle = theme.styles.find(style => 
      style.featureType === 'road'
    );
    
    if (roadStyle?.stylers) {
      const colorStyler = roadStyle.stylers.find(styler => 
        styler && typeof styler === 'object' && 'color' in styler
      );
      if (colorStyler && 'color' in colorStyler && typeof colorStyler.color === 'string') {
        return colorStyler.color;
      }
    }
    
    return theme.isDark ? '#3949ab' : '#c0c0c0';
  };

  const drawPin = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    // Pin shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x + 1, y + 8, 3, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pin body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Pin point
    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x - 4, y + 12);
    ctx.lineTo(x + 4, y + 12);
    ctx.closePath();
    ctx.fill();

    // Pin highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(x - 2, y - 2, 2, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative p-4 rounded-xl border-2 transition-all duration-200 text-left overflow-hidden',
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-lg bg-white dark:bg-gray-800',
        'hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      )}

      {/* Theme Preview Canvas */}
      <div className="relative mb-3">
        <canvas
          ref={canvasRef}
          className="w-full h-24 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Emoji Overlay */}
        {theme.emoji && (
          <div className="absolute top-2 left-2 text-lg opacity-80">
            {theme.emoji}
          </div>
        )}
      </div>

      {showDetails && (
        <>
          {/* Theme Name */}
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {theme.name}
          </h3>

          {/* Theme Description */}
          {theme.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
              {theme.description}
            </p>
          )}

          {/* Color Palette */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" 
                style={{ backgroundColor: theme.pinColor }}
                title="Pin Color"
              />
              <div 
                className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" 
                style={{ backgroundColor: theme.primaryColor }}
                title="Primary Color"
              />
              <div 
                className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" 
                style={{ backgroundColor: theme.secondaryColor }}
                title="Secondary Color"
              />
            </div>

            {/* Theme Category Badge */}
            {theme.category && (
              <span className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                theme.isDark 
                  ? 'bg-gray-800 text-gray-300 border border-gray-700'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              )}>
                {theme.category}
              </span>
            )}
          </div>
        </>
      )}
    </button>
  );
}