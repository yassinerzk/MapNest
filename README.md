# MapNest

A SaaS platform that lets users customize Google Maps with multiple layouts, pin locations, and vibrant styles, and embed those maps into their websites.

## Features

- **Map Embed Widget**: Customizable maps with various layout presets, color themes, pin clustering, and interactive elements
- **Pin Management**: Add pins manually or via CSV upload/API, tag pins with categories, customize pin icons
- **Layout Presets**: Gallery of layouts for different use cases with customization options
- **Location Sidebar**: Expandable/collapsible list view with location details and interactive features
- **Embed & Integration**: Easy embedding via code snippets or plugins for popular platforms
- **User Dashboard**: Create and manage multiple maps with analytics

## Tech Stack

- **Frontend**: React/Next.js with TypeScript and TailwindCSS
- **Maps API**: Google Maps JavaScript API
- **UI Components**: Modular component system with Shadcn/ui integration
- **Styling**: TailwindCSS with extended theme for gradients and glass effects
- **State Management**: Zustand for global state

## Project Structure

The project follows an atomic design pattern with feature-based organization:

```
src/
├── app/                 # Next.js App Router pages
├── assets/              # Static assets like images
├── components/          # UI components
│   ├── atoms/           # Basic UI elements
│   ├── molecules/       # Composite components
│   ├── organisms/       # Complex components
│   ├── layouts/         # Layout components
│   └── templates/       # Page templates
├── features/            # Feature-based modules
│   ├── auth/            # Authentication feature
│   └── map/             # Map feature
│       ├── components/  # Map-specific components
│       ├── hooks/       # Map-related hooks
│       ├── store/       # Map state management
│       ├── types/       # Map type definitions
│       └── utils/       # Map utility functions
├── lib/                 # Shared utilities and helpers
└── types/               # Global TypeScript types
```

## Core Components

- **MapContainer**: The main component for displaying Google Maps with customizable pins
- **Sidebar**: Collapsible sidebar for displaying location information
- **PinManager**: Interface for adding, editing, and deleting map pins
- **ThemeSelector**: Component for selecting and customizing map themes
- **LayoutSelector**: Component for choosing different map layouts
- **EmbedCode**: Generator for embed code to use on websites
- **MapWrapper**: Container component that combines all map features

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Usage

### Basic Map Integration

```tsx
import { MapWrapper } from '@/components/organisms/MapWrapper';

export default function MyPage() {
  return (
    <div className="h-screen">
      <MapWrapper
        apiKey="YOUR_GOOGLE_MAPS_API_KEY"
        mapId="my-map"
        initialPins={[/* your pins here */]}
        initialTheme={/* optional theme */}
        initialLayout="fullscreen"
      />
    </div>
  );
}
```

### Using the Map Store

```tsx
import { useMapStore } from '@/features/map/store/mapStore';

export default function MapManager() {
  const { maps, createMap, addPin } = useMapStore();
  
  const handleCreateMap = () => {
    const mapId = createMap('My New Map');
    addPin(mapId, {
      title: 'New Location',
      description: 'This is a new location',
      lat: 40.7128,
      lng: -74.006,
      color: '#4f46e5',
    });
  };
  
  return (
    <div>
      <button onClick={handleCreateMap}>Create Map</button>
      {/* Rest of your component */}
    </div>
  );
}
```