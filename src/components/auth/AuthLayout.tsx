
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footerText?: React.ReactNode;
}

// Helper function to determine if current context is Wiggly platform
const isWigglyContext = (pathname: string): boolean => {
  const wigglyRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const isHavenArkAuth = pathname.startsWith('/haven-ark/');
  
  // If it's Haven ARK auth, it's not Wiggly context
  if (isHavenArkAuth) {
    return false;
  }
  
  // If it's basic auth routes, consider it Wiggly context
  return wigglyRoutes.some(route => pathname === route || pathname.startsWith(route));
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  footerText
}) => {
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Define logo URLs for light and dark modes
  const lightLogoUrl = "/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png";
  const darkLogoUrl = "/lovable-uploads/dacda39a-48ba-4f33-813b-c570e9686ae3.png";
  const logoUrl = mounted && resolvedTheme === 'dark' ? darkLogoUrl : lightLogoUrl;

  // Determine the logo link destination based on context
  const getLogoDestination = () => {
    // For Haven ARK auth pages, go to Haven ARK landing
    if (location.pathname.startsWith('/haven-ark/')) {
      return '/';
    }
    
    // For Wiggly auth context, go to Wiggly landing page
    if (isWigglyContext(location.pathname)) {
      return '/wiggly';
    }
    
    // Default fallback to Haven ARK landing
    return '/';
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-background via-background/90 to-background">
      {/* Background decorations - scaled based on screen size */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[60vw] max-w-[600px] h-[60vw] max-h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full filter blur-3xl opacity-50 animate-pulse" 
             style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 left-0 w-[60vw] max-w-[600px] h-[60vw] max-h-[600px] bg-gradient-to-t from-blue-500/5 to-transparent rounded-full filter blur-3xl opacity-50 animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 left-1/4 w-[40vw] max-w-[400px] h-[40vw] max-h-[400px] bg-gradient-to-r from-green-500/5 to-transparent rounded-full filter blur-3xl opacity-40 animate-pulse" 
             style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        
        {/* Floating elements - responsive sizing */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[15%] w-[20vw] max-w-24 h-[20vw] max-h-24 bg-blue-500/10 rounded-full filter blur-2xl">
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[25%] w-[25vw] max-w-32 h-[25vw] max-h-32 bg-primary/10 rounded-full filter blur-2xl">
        </motion.div>
        
        <motion.div 
          animate={{ x: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] left-[10%] w-[22vw] max-w-28 h-[22vw] max-h-28 bg-green-500/10 rounded-full filter blur-2xl">
        </motion.div>
      </div>
      
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 mx-auto">
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-4"
          >
            <Link to={getLogoDestination()}>
              {mounted ? (
                <img 
                  src={logoUrl} 
                  alt="Wiggly Logo" 
                  className={`${isMobile ? 'h-12' : 'h-16'} object-contain`}
                />
              ) : (
                <div className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} bg-primary/10 animate-pulse rounded-md`}></div>
              )}
            </Link>
          </motion.div>
          
          <motion.h1 
            className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2 bg-gradient-to-r from-primary via-blue-500 to-green-500 bg-clip-text text-transparent`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p 
              className="text-muted-foreground text-sm mb-6"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg shadow-lg shadow-primary/5 p-4 sm:p-6"
        >
          {children}
        </motion.div>
        
        {footerText && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 text-sm text-muted-foreground"
          >
            {footerText}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
