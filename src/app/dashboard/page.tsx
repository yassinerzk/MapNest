'use client';

import { useState } from 'react';
import { Dashboard } from '@/components/templates/Dashboard';

export default function DashboardPage() {
  // In a real app, this would come from environment variables
  const [apiKey] = useState<string>('YOUR_GOOGLE_MAPS_API_KEY');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="h-screen">
        <Dashboard apiKey={apiKey} />
      </div>
    </div>
  );
}