'use client';

import { useState } from 'react';
import { Dashboard } from '@/components/templates/Dashboard';

export default function DashboardPage() {
  // Get API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Show error if API key is missing
  if (!apiKey) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Google Maps API Key Missing</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please add your Google Maps API key to the environment variables.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create a <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">.env.local</code> file and add:
            <br />
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-2 block">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <Dashboard apiKey={apiKey} />
    </div>
  );
}