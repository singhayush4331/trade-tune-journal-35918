import React, { useState, useEffect } from 'react';
import { Instagram, Mail, FileJson } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useLocation } from 'react-router-dom';

// Helper function to determine if current context is Wiggly platform
const isWigglyContext = (pathname: string): boolean => {
  const wigglyRoutes = [
    '/wiggly', '/wiggly-AI'
  ];
  
  return wigglyRoutes.some(route => pathname.startsWith(route));
};

const Footer = () => {
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();

  // Define logo URLs for light and dark modes
  const lightLogoUrl = "/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png";
  const darkLogoUrl = "/lovable-uploads/dacda39a-48ba-4f33-813b-c570e9686ae3.png";
  const logoUrl = mounted && resolvedTheme === 'dark' ? darkLogoUrl : lightLogoUrl;
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the logo link destination based on context
  const getLogoDestination = () => {
    // For Wiggly platform context, go to Wiggly landing page
    if (isWigglyContext(location.pathname)) {
      return '/wiggly';
    }
    
    // Default fallback to Haven ARK landing
    return '/';
  };

  return (
    <footer className={`bg-card/30 backdrop-blur-sm border-t border-border/20 ${isMobile ? 'py-6' : 'py-12'} px-4 relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col md:flex-row items-center md:items-start md:justify-between ${isMobile ? 'gap-4' : 'gap-6'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-2 sm:space-y-4 flex flex-col items-center md:items-start"
          >
            <Link to={getLogoDestination()} className="flex items-center">
              {mounted ? (
                <img 
                  src={logoUrl} 
                  alt="Wiggly Logo" 
                  className={`${isMobile ? 'h-8' : 'h-12'} object-contain`} 
                />
              ) : (
                <div className={`${isMobile ? 'h-8 w-28' : 'h-12 w-36'} bg-primary/10 animate-pulse rounded-md`}></div>
              )}
            </Link>
            
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground max-w-md text-center md:text-left`}>
              AI-powered trading journal and analytics platform helping traders make data-driven decisions.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-end space-y-2 sm:space-y-4"
          >
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-foreground/80`}>Follow us</p>
            <div className="flex items-center space-x-3">
              <a 
                href="https://www.instagram.com/wiggly_ai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`group flex items-center justify-center ${isMobile ? 'p-2' : 'p-3'} rounded-full bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 transition-all duration-300 backdrop-blur-sm`}
                aria-label="Instagram"
              >
                <Instagram className={`${isMobile ? 'h-3.5 w-3.5' : 'h-5 w-5'} text-primary group-hover:scale-110 transition-transform`} />
              </a>
              <a 
                href="mailto:support@wiggly.co.in" 
                className={`group flex items-center justify-center ${isMobile ? 'p-2' : 'p-3'} rounded-full bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 transition-all duration-300 backdrop-blur-sm`}
                aria-label="Email"
              >
                <Mail className={`${isMobile ? 'h-3.5 w-3.5' : 'h-5 w-5'} text-primary group-hover:scale-110 transition-transform`} />
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Policy Links - Individual animations for each link */}
        <div className={`flex flex-wrap justify-center md:justify-center gap-x-6 gap-y-2 ${isMobile ? 'mt-6' : 'mt-8'} mb-4`}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <Link 
              to="/terms" 
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground hover:text-primary transition-colors cursor-pointer relative z-10 hover:underline`}
            >
              Terms & Conditions
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <Link 
              to="/privacy" 
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground hover:text-primary transition-colors cursor-pointer relative z-10 hover:underline`}
            >
              Privacy Policy
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <Link 
              to="/shipping" 
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground hover:text-primary transition-colors cursor-pointer relative z-10 hover:underline`}
            >
              Shipping Policy
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <Link 
              to="/refund" 
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground hover:text-primary transition-colors cursor-pointer relative z-10 hover:underline`}
            >
              Cancellation & Refund
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <Link 
              to="/contact" 
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground hover:text-primary transition-colors cursor-pointer relative z-10 hover:underline`}
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className={`${isMobile ? 'mt-6 pt-3' : 'mt-8 pt-6'} border-t border-border/10 text-center ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}
        >
          <p>© {currentYear} Wiggly. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
