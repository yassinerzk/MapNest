"use client";

import { useState } from 'react';
import { useMapStore } from '@/features/map/stores/map-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeSelector } from './theme-selector';
import { LayoutSelector } from './layout-selector';
import { PinStyleSelector } from './pin-style-selector';
import { EmbedCodeGenerator } from './embed-code-generator';
import { LocationManager } from './location-manager';

export function ControlPanel() {
  const [activeTab, setActiveTab] = useState('customize');
  
  return (
    <div className="border rounded-xl shadow-sm bg-background">
      <Tabs defaultValue="customize" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b px-4">
          <TabsList className="h-12">
            <TabsTrigger value="customize" className="data-[state=active]:bg-background">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Customize
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-background">
              <MapPinIcon className="h-4 w-4 mr-2" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="embed" className="data-[state=active]:bg-background">
              <CodeIcon className="h-4 w-4 mr-2" />
              Embed
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="customize" className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ThemeSelector />
            <LayoutSelector />
            <PinStyleSelector />
          </div>
        </TabsContent>
        
        <TabsContent value="locations" className="p-4">
          <LocationManager />
        </TabsContent>
        
        <TabsContent value="embed" className="p-4">
          <EmbedCodeGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
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