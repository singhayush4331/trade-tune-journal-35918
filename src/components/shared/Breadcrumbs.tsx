
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface RouteMap {
  [key: string]: {
    label: string;
    parent?: string;
  };
}

const routeMap: RouteMap = {
  '': { label: 'Home' },
  'dashboard': { label: 'Dashboard' },
  'trades': { label: 'Trades' },
  'trade-form': { label: 'Trade Form', parent: 'trades' },
  'calendar': { label: 'Calendar' },
  'analytics': { label: 'Analytics' },
  'gallery': { label: 'Gallery' },
  'wiggly-AI': { label: 'Wiggly AI' },
  'notebook': { label: 'Notebook' },
  'playbooks': { label: 'Playbooks' },
  'playbook': { label: 'Playbook', parent: 'playbooks' },
  'funds': { label: 'Funds' },
  'position-sizing': { label: 'Position Sizing' },
  'features': { label: 'Features' },
  'ai-assistant': { label: 'AI Assistant', parent: 'features' },
  'feature-playbooks': { label: 'Playbooks', parent: 'features' },
  'emotions': { label: 'Emotions', parent: 'features' },
  'time': { label: 'Time Analysis', parent: 'features' },
  'trade-entry': { label: 'Trade Entry', parent: 'features' },
  'calculator': { label: 'Calculator', parent: 'features' },
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
  
  if (pathSegments.length === 0) return null; // Don't show breadcrumbs on homepage
  
  // Build breadcrumb trail
  type BreadcrumbItem = {
    path: string;
    label: string;
    isLast: boolean;
  };
  
  const breadcrumbItems: BreadcrumbItem[] = [];
  
  // Always start with home
  breadcrumbItems.push({
    path: '/',
    label: 'Home',
    isLast: pathSegments.length === 0,
  });
  
  // Add each path segment
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Special case for IDs in routes (e.g., /playbook/edit/123)
    if (!isNaN(Number(segment)) || (segment === 'edit' || segment === 'create')) {
      return;
    }
    
    // Find the route in our map
    const routeInfo = routeMap[segment] || { label: segment.charAt(0).toUpperCase() + segment.slice(1) };
    
    breadcrumbItems.push({
      path: currentPath,
      label: routeInfo.label,
      isLast: index === pathSegments.length - 1,
    });
  });
  
  // Generate JSON-LD schema for breadcrumbs
  const breadcrumbSchemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://wiggly.co.in${item.path}`
    }))
  };
  
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchemaData)}
        </script>
      </Helmet>
      
      <Breadcrumb className="mb-4 px-1">
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.path}>
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage className="text-sm">
                    {index === 0 ? <HomeIcon className="h-3.5 w-3.5 mr-1" /> : null}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.path} className="text-sm flex items-center">
                      {index === 0 ? <HomeIcon className="h-3.5 w-3.5 mr-1" /> : null}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!item.isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default Breadcrumbs;
