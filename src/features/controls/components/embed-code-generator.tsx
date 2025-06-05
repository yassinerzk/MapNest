"use client";

import { useState } from 'react';
import { useMapStore } from '@/features/map/stores/map-store';

export function EmbedCodeGenerator() {
  const { 
    embedCode, 
    generateEmbedCode, 
    embedWidth, 
    embedHeight, 
    setEmbedDimensions 
  } = useMapStore();
  
  const [copied, setCopied] = useState(false);
  const [width, setWidth] = useState(embedWidth);
  const [height, setHeight] = useState(embedHeight);

  const handleGenerateCode = () => {
    setEmbedDimensions(width, height);
    generateEmbedCode();
  };

  const handleCopyCode = () => {
    if (!embedCode) return;
    
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Embed Your Map</h3>
        <p className="text-sm text-muted-foreground">
          Generate an embed code to add your map to any website
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="width" className="text-sm font-medium">
                Width
              </label>
              <input
                id="width"
                type="text"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="100%"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-medium">
                Height
              </label>
              <input
                id="height"
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="500px"
              />
            </div>
          </div>
          
          <button
            onClick={handleGenerateCode}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full"
          >
            <CodeIcon className="mr-2 h-4 w-4" />
            Generate Embed Code
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="embed-code" className="text-sm font-medium">
              Embed Code
            </label>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
              disabled={!embedCode}
            >
              {copied ? (
                <>
                  <CheckIcon className="mr-1 h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon className="mr-1 h-3 w-3" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <textarea
              id="embed-code"
              readOnly
              value={embedCode || '// Click "Generate Embed Code" to create your embed code'}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border p-4 bg-muted/50">
        <h4 className="text-sm font-medium mb-2">Preview</h4>
        <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center">
          {embedCode ? (
            <div className="text-sm text-muted-foreground">
              Your map will appear here when embedded
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Generate embed code to see a preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
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