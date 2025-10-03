import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useUniversalPreloader } from '@/hooks/use-universal-preloader';
import { UniversalPreloader } from './UniversalPreloader';
import { PreloaderService } from '@/services/preloader-service';

interface PreloaderContextType {
  isPreloadComplete: boolean;
  startPreload: () => void;
  resetPreload: () => void;
}

const PreloaderContext = createContext<PreloaderContextType | null>(null);

export const usePreloader = () => {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error('usePreloader must be used within PreloaderProvider');
  }
  return context;
};

interface PreloaderProviderProps {
  children: React.ReactNode;
}

export const PreloaderProvider: React.FC<PreloaderProviderProps> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const [shouldShowPreloader, setShouldShowPreloader] = useState(false);

  // Routes where preloader should never show (landing pages, auth pages)
  const exemptRoutes = [
    '/',
    '/wiggly',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/email-verification',
    '/academy/signup',
    '/haven-ark/signup',
    '/haven-ark/login',
    '/not-found',
    // Feature showcase pages
    '/features/ai-assistant',
    '/features/calculator',
    '/features/emotions',
    '/features/time',
    '/features/trade-entry',
    '/features/playbooks',
    '/features/smart-trade-import'
  ];

  // Check if current route should be exempt from preloader
  const isExemptRoute = exemptRoutes.includes(location.pathname);
  // Avoid showing preloader if it was recently completed in this session
  const isPreloadAlreadyComplete = PreloaderService.isPreloadComplete();

  const {
    progress,
    currentStage,
    estimatedTime,
    tips,
    isPreloading,
    isComplete,
    startPreload,
    resetPreload
  } = useUniversalPreloader();

  // Determine if we should show the preloader
  useEffect(() => {
    // Only show preloader for authenticated routes that aren't exempt and not already completed
    const needsPreload = user && !authLoading && !isComplete && !isPreloading && !isExemptRoute && !isPreloadAlreadyComplete;
    
    if (needsPreload) {
      // Add small delay to ensure proper initialization
      const timer = setTimeout(() => {
        setShouldShowPreloader(true);
      }, 50);
      return () => clearTimeout(timer);
    } else if (isComplete || isExemptRoute || isPreloadAlreadyComplete) {
      setShouldShowPreloader(false);
    }
  }, [user, authLoading, isComplete, isPreloading, isExemptRoute, isPreloadAlreadyComplete]);

  // Force-start preload when UI becomes visible
  useEffect(() => {
    if (shouldShowPreloader) {
      startPreload();
    }
  }, [shouldShowPreloader, startPreload]);

  // Watchdog: if stuck at 0%, retry start after short delay
  useEffect(() => {
    if (!shouldShowPreloader) return;
    if (isPreloading) return;
    if (progress > 0 || isComplete) return;

    const timer = setTimeout(() => {
      if (!isPreloading && progress === 0 && !isComplete) {
        startPreload();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [shouldShowPreloader, isPreloading, progress, isComplete, startPreload]);

  const handlePreloaderComplete = () => {
    setShouldShowPreloader(false);
  };

  const contextValue: PreloaderContextType = {
    isPreloadComplete: isComplete,
    startPreload,
    resetPreload
  };

  return (
    <PreloaderContext.Provider value={contextValue}>
      {shouldShowPreloader && (
        <UniversalPreloader
          progress={progress}
          currentStage={currentStage}
          estimatedTime={estimatedTime}
          tips={tips}
          onComplete={handlePreloaderComplete}
        />
      )}
      {(!shouldShowPreloader || isComplete) && children}
    </PreloaderContext.Provider>
  );
};