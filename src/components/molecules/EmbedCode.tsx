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
    showFullInterface: false,
  };

  // Merge with provided options
  const embedOptions: EmbedOptions = {
    ...defaultOptions,
    ...options,
  };

  // Generate iframe embed code
  const generateIframeCode = (): string => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mapnest.app';
    const params = new URLSearchParams();
    
    // Add theme ID to URL if available in options
    if (options.theme?.id) {
      params.set('theme', options.theme.id);
    }
    
    if (embedOptions.showFullInterface) {
      params.set('fullInterface', 'true');
    }
    
    const url = `${baseUrl}/embed/${mapId}${params.toString() ? '?' + params.toString() : ''}`;
    
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
    
    // Add theme data attribute if available
    const themeAttr = options.theme?.id ? `data-theme="${options.theme.id}"` : '';
    
    return `<div id="mapnest-${mapId}" style="width:${embedOptions.width};height:${embedOptions.height};"></div>
<script src="${baseUrl}/api/embed.js" data-mapid="${mapId}" ${themeAttr} ${embedOptions.responsive ? 'data-responsive="true"' : ''} ${embedOptions.showFullInterface ? 'data-full-interface="true"' : ''} async></script>`;
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
    <div className={cn('flex flex-col space-y-3', className)}>
      <h3 className="text-lg font-medium">Embed Code</h3>
      
      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => setEmbedType('iframe')}
          className={cn(
            'px-3 py-1 text-sm rounded-md',
            embedType === 'iframe'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          iFrame
        </button>
        <button
          onClick={() => setEmbedType('script')}
          className={cn(
            'px-3 py-1 text-sm rounded-md',
            embedType === 'script'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          JavaScript
        </button>
      </div>
      
      <div className="relative">
        <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm overflow-x-auto whitespace-pre-wrap break-all">
          {embedCode}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-white dark:bg-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Dimensions
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width</label>
              <input
                type="text"
                value={embedOptions.width}
                onChange={(e) => handleOptionChange('width', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Height</label>
              <input
                type="text"
                value={embedOptions.height}
                onChange={(e) => handleOptionChange('height', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={embedOptions.responsive}
              onChange={(e) => handleOptionChange('responsive', e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Responsive (adjust to container)</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={embedOptions.allowFullscreen}
              onChange={(e) => handleOptionChange('allowFullscreen', e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Allow fullscreen</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={embedOptions.showFullInterface}
              onChange={(e) => handleOptionChange('showFullInterface', e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show full interface (controls & sidebar)</span>
          </label>
        </div>
      </div>
    </div>
  );
}