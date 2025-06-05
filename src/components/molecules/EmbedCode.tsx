'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { EmbedOptions } from '@/types';

interface EmbedCodeProps {
  mapId: string;
  options: Partial<EmbedOptions>;
  onOptionsChange?: (options: Partial<EmbedOptions>) => void;
  className?: string;
}

export function EmbedCode({
  mapId,
  options,
  onOptionsChange,
  className,
}: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const [embedType, setEmbedType] = useState<'iframe' | 'script'>('iframe');

  // Default options
  const defaultOptions: EmbedOptions = {
    mapId,
    width: '100%',
    height: '500px',
    responsive: true,
    showAttribution: true,
    allowFullscreen: true,
  };

  // Merge with provided options
  const embedOptions: EmbedOptions = {
    ...defaultOptions,
    ...options,
  };

  // Generate iframe embed code
  const generateIframeCode = (): string => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mapnest.app';
    const url = `${baseUrl}/embed/${mapId}`;
    
    return `<iframe 
  src="${url}" 
  width="${embedOptions.width}" 
  height="${embedOptions.height}" 
  style="border:0;" 
  ${embedOptions.allowFullscreen ? 'allowfullscreen' : ''} 
  loading="lazy" 
  referrerpolicy="no-referrer-when-downgrade">
</iframe>`;
  };

  // Generate script embed code
  const generateScriptCode = (): string => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mapnest.app';
    
    return `<div id="mapnest-${mapId}" style="width:${embedOptions.width};height:${embedOptions.height};"></div>
<script src="${baseUrl}/api/embed.js" data-mapid="${mapId}" ${embedOptions.responsive ? 'data-responsive="true"' : ''} async></script>`;
  };

  // Get the appropriate code based on selected type
  const embedCode = embedType === 'iframe' ? generateIframeCode() : generateScriptCode();

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle option changes
  const handleOptionChange = (key: keyof EmbedOptions, value: any) => {
    if (onOptionsChange) {
      onOptionsChange({
        ...options,
        [key]: value,
      });
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Embed Code</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setEmbedType('iframe')}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors',
              embedType === 'iframe'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            iFrame
          </button>
          <button
            type="button"
            onClick={() => setEmbedType('script')}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors',
              embedType === 'script'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            JavaScript
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="embed-width" className="block text-sm font-medium">
            Width
          </label>
          <input
            id="embed-width"
            type="text"
            value={embedOptions.width}
            onChange={(e) => handleOptionChange('width', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="embed-height" className="block text-sm font-medium">
            Height
          </label>
          <input
            id="embed-height"
            type="text"
            value={embedOptions.height}
            onChange={(e) => handleOptionChange('height', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <input
            id="embed-responsive"
            type="checkbox"
            checked={embedOptions.responsive}
            onChange={(e) => handleOptionChange('responsive', e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="embed-responsive" className="ml-2 block text-sm">
            Responsive
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="embed-attribution"
            type="checkbox"
            checked={embedOptions.showAttribution}
            onChange={(e) => handleOptionChange('showAttribution', e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="embed-attribution" className="ml-2 block text-sm">
            Show Attribution
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="embed-fullscreen"
            type="checkbox"
            checked={embedOptions.allowFullscreen}
            onChange={(e) => handleOptionChange('allowFullscreen', e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="embed-fullscreen" className="ml-2 block text-sm">
            Allow Fullscreen
          </label>
        </div>
      </div>

      {/* Code Display */}
      <div className="relative">
        <pre className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto text-sm">
          <code className="text-gray-800 dark:text-gray-200">{embedCode}</code>
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Preview</h3>
        <div 
          className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
          style={{ width: embedOptions.width, height: embedOptions.height, maxWidth: '100%' }}
        >
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
            Map Preview
          </div>
        </div>
      </div>
    </div>
  );
}