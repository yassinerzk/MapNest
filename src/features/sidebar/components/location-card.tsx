import { cn } from '@/lib/utils';

interface LocationCardProps {
  location: {
    id: string;
    name: string;
    address: string;
    category: string;
    description?: string;
    image?: string;
  };
  isSelected: boolean;
  onClick: () => void;
  expanded?: boolean;
}

export function LocationCard({ 
  location, 
  isSelected, 
  onClick,
  expanded = false 
}: LocationCardProps) {
  const { name, address, category, description, image } = location;
  
  // Get category icon and color
  const { icon: CategoryIcon, color } = getCategoryDetails(category);

  return (
    <div 
      className={cn(
        "rounded-lg border overflow-hidden transition-all hover:shadow-md cursor-pointer",
        isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:border-border"
      )}
      onClick={onClick}
    >
      {image && expanded && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div 
            className="rounded-full p-2 flex-shrink-0" 
            style={{ backgroundColor: `${color}15` }}
          >
            <CategoryIcon className="h-4 w-4" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{name}</h3>
            <p className="text-xs text-muted-foreground truncate">{address}</p>
            {expanded && description && (
              <p className="text-xs mt-2 line-clamp-2">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryDetails(category: string) {
  switch (category) {
    case 'store':
      return { 
        icon: (props: React.SVGProps<SVGSVGElement>) => (
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
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
          </svg>
        ), 
        color: '#4CAF50' 
      };
    case 'office':
      return { 
        icon: (props: React.SVGProps<SVGSVGElement>) => (
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
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Z" />
            <path d="M9 9h6" />
            <path d="M9 13h6" />
            <path d="M9 17h6" />
          </svg>
        ), 
        color: '#2196F3' 
      };
    case 'event':
      return { 
        icon: (props: React.SVGProps<SVGSVGElement>) => (
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
            <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
            <path d="M16 3v4" />
            <path d="M8 3v4" />
            <path d="M3 11h18" />
            <path d="M16 19h6" />
            <path d="M19 16v6" />
          </svg>
        ), 
        color: '#FF9800' 
      };
    case 'restaurant':
      return { 
        icon: (props: React.SVGProps<SVGSVGElement>) => (
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
            <path d="M6 13.87A4 4 0 0 1 7.41 6a1 1 0 0 1 .87.5 1 1 0 0 1 .87-.5A4 4 0 0 1 12 13.87V21H6Z" />
            <path d="M15.3 13.69a3.6 3.6 0 0 1 0-7.38V21" />
          </svg>
        ), 
        color: '#F44336' 
      };
    case 'attraction':
      return { 
        icon: (props: React.SVGProps<SVGSVGElement>) => (
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
            <path d="M12 2a8 8 0 0 0-8 8c0 1.6.3 2.9.9 3.9.6 1.1 1.9 2.5 3.6 4.1l3.9 3.9c.2.2.6.2.8 0l3.8-3.9c1.7-1.6 3-3 3.6-4.1.6-1 .9-2.3.9-3.9a8 8 0 0 0-8-8" />
            <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          </svg>
        ), 
        color: '#9C27B0' 
      };
    default:
      return { 
        icon: (props: React.SVGProps<SVGSVGElement>) => (
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
        ), 
        color: '#757575' 
      };
  }
}