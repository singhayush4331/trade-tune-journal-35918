
import { useState, useEffect } from 'react';

export const useIsMobile = (breakpoint = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Add event listener with debounce for performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };
    
    // Listen for both resize and orientation change events
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Initial check
    handleResize();
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [breakpoint]);

  return isMobile;
};

// Export additional breakpoint helpers based on common device sizes
export const useIsXXSmall = () => useIsMobile(375); // For very small devices like iPhone SE
export const useIsXSmall = () => useIsMobile(480); // For small phones
export const useIsSmall = () => useIsMobile(640); // For medium phones
export const useIsMedium = () => useIsMobile(768); // For tablets and large phones
export const useIsLarge = () => useIsMobile(1024); // For small laptops
export const useIsXLarge = () => useIsMobile(1280); // For laptops and desktops

export default useIsMobile;
