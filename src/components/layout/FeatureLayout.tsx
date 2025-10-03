import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface FeatureLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
}

// Helper function to determine if current context is Wiggly platform
const isWigglyContext = (pathname: string): boolean => {
  const wigglyRoutes = [
    '/wiggly', '/wiggly-AI'
  ];
  
  return wigglyRoutes.some(route => pathname.startsWith(route));
};

const FeatureLayout: React.FC<FeatureLayoutProps> = ({ 
  children, 
  title, 
  showBackButton = true 
}) => {
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const lightLogoUrl = "/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png";
  const darkLogoUrl = "/lovable-uploads/dacda39a-48ba-4f33-813b-c570e9686ae3.png";
  const logoUrl = mounted && resolvedTheme === 'dark' ? darkLogoUrl : lightLogoUrl;

  // Determine the logo link destination based on context
  const getLogoDestination = () => {
    // For Wiggly platform context (including features), go to Wiggly landing page
    if (isWigglyContext(location.pathname)) {
      return '/wiggly';
    }
    
    // Default fallback to Haven ARK landing
    return '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>
                </Button>
              )}
              <div className="flex items-center gap-3">
                <Link to={getLogoDestination()} className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                    {mounted ? (
                      <img 
                        src={logoUrl} 
                        alt="Wiggly Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 animate-pulse rounded-md"></div>
                    )}
                  </div>
                </Link>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default FeatureLayout;
