import { MapDashboard } from '@/features/dashboard/components/map-dashboard';
import { DemoHeader } from '@/components/demo-header';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <DemoHeader />
      <div className="flex-1 container mx-auto py-8 px-4">
        <MapDashboard />
      </div>
    </main>
  );
}