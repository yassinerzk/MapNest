'use client';

import { useState } from 'react';
import { Dashboard } from '@/components/templates/Dashboard';

export default function DashboardPage() {
  // Get API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <Dashboard apiKey={apiKey} />
    </div>
  );
}