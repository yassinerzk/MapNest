"use client";

import { useState } from 'react';
import { useMapStore } from '@/features/map/stores/map-store';

interface LocationFormData {
  name: string;
  address: string;
  lat: string;
  lng: string;
  category: string;
  description: string;
}

const initialFormData: LocationFormData = {
  name: '',
  address: '',
  lat: '',
  lng: '',
  category: 'default',
  description: '',
};

const categoryOptions = [
  { value: 'store', label: 'Store' },
  { value: 'office', label: 'Office' },
  { value: 'event', label: 'Event' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'attraction', label: 'Attraction' },
  { value: 'default', label: 'Other' },
];

export function LocationManager() {
  const { locations, addLocation, removeLocation } = useMapStore();
  const [formData, setFormData] = useState<LocationFormData>(initialFormData);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.lat || !formData.lng) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Add location to store
    addLocation({
      name: formData.name,
      address: formData.address,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      category: formData.category,
      description: formData.description,
    });
    
    // Reset form
    setFormData(initialFormData);
    setIsAddingLocation(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;
    
    setIsUploading(true);
    
    try {
      // In a real app, you would process the CSV file here
      // For demo purposes, we'll simulate adding a few locations after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate adding locations from CSV
      const mockCsvLocations = [
        {
          name: 'CSV Location 1',
          address: '123 CSV Street, New York',
          lat: 40.7128,
          lng: -74.006,
          category: 'store',
          description: 'Imported from CSV',
        },
        {
          name: 'CSV Location 2',
          address: '456 CSV Avenue, New York',
          lat: 40.7228,
          lng: -73.996,
          category: 'office',
          description: 'Imported from CSV',
        },
      ];
      
      mockCsvLocations.forEach(location => addLocation(location));
      
      // Reset file input
      setCsvFile(null);
      alert('CSV imported successfully!');
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('Error importing CSV');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Locations</h3>
          <p className="text-sm text-muted-foreground">
            Manage the locations displayed on your map
          </p>
        </div>
        <button
          onClick={() => setIsAddingLocation(!isAddingLocation)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {isAddingLocation ? (
            <>
              <XIcon className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Location
            </>
          )}
        </button>
      </div>
      
      {isAddingLocation && (
        <div className="rounded-lg border p-4 space-y-4">
          <h4 className="font-medium">Add New Location</h4>
          <form onSubmit={handleAddLocation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Location name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Street address"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="lat" className="text-sm font-medium">
                  Latitude *
                </label>
                <input
                  id="lat"
                  name="lat"
                  type="text"
                  value={formData.lat}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="40.7128"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lng" className="text-sm font-medium">
                  Longitude *
                </label>
                <input
                  id="lng"
                  name="lng"
                  type="text"
                  value={formData.lng}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="-74.0060"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter a description for this location"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                <SaveIcon className="mr-2 h-4 w-4" />
                Save Location
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="rounded-lg border">
        <div className="p-4 border-b">
          <h4 className="font-medium">Location List</h4>
        </div>
        <div className="divide-y">
          {locations.length > 0 ? (
            locations.map((location) => (
              <div key={location.id} className="p-4 flex items-center justify-between">
                <div>
                  <h5 className="font-medium">{location.name}</h5>
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                </div>
                <button
                  onClick={() => removeLocation(location.id)}
                  className="p-2 rounded-md hover:bg-muted"
                  aria-label={`Remove ${location.name}`}
                >
                  <TrashIcon className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <MapPinOffIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h5 className="font-medium">No locations added</h5>
              <p className="text-sm text-muted-foreground mt-1">
                Add locations manually or import from CSV
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="rounded-lg border p-4 space-y-4">
        <h4 className="font-medium">Bulk Import</h4>
        <form onSubmit={handleCsvUpload} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="csv-file" className="text-sm font-medium">
              Import from CSV
            </label>
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              CSV should have columns: name, address, lat, lng, category (optional), description (optional)
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!csvFile || isUploading}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Import CSV
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SaveIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function LoaderIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function MapPinOffIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m9.5 14.5 3-3" />
      <path d="M14.5 9.5 16 8" />
      <path d="m3 3 18 18" />
      <path d="M7.1 7.1C7 7.4 7 7.7 7 8c0 3 4 8 5 8.5 1-0.5 5-5.5 5-8.5 0-.3 0-.6-.1-.9" />
      <path d="M13.1 13.1 12 17l-1.1-3.9" />
      <path d="M12 6c.7 0 1.4.3 1.9.8" />
      <path d="M12 6c-.3 0-.5 0-.8.1" />
    </svg>
  );
}