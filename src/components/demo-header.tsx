import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function DemoHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <MapPinIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">MapNest</span>
          </Link>
          <div className="hidden md:flex items-center space-x-1 text-sm font-medium">
            <Link 
              href="#features" 
              className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Features
            </Link>
            <Link 
              href="#layouts" 
              className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Layouts
            </Link>
            <Link 
              href="#themes" 
              className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Themes
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link 
            href="#" 
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
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