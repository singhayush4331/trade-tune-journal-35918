
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedTradeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

// Image cache with smaller size to reduce memory usage
const imageCache = new Map<string, string>();
const MAX_CACHE_SIZE = 20;

// Track loading images to prevent duplicate requests
const loadingImages = new Set<string>();

const OptimizedTradeImage: React.FC<OptimizedTradeImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [imageSrc, setImageSrc] = useState<string | null>(priority ? src : null);
  const [error, setError] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Check if data URL for immediate loading
  const isDataUrl = src.startsWith('data:');
  
  // Image load handler
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);
  
  // Error handler
  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setError(true);
    console.error(`Failed to load image: ${src}`);
  }, [src]);
  
  // Reset state on src change
  useEffect(() => {
    setError(false);
    
    if (imageCache.has(src)) {
      // Use cached image
      setImageSrc(imageCache.get(src) || null);
      setIsLoading(false);
    } else if (isDataUrl) {
      // Data URLs can be used directly
      setImageSrc(src);
      setIsLoading(false);
    } else if (priority) {
      // Priority images load immediately
      setImageSrc(src);
      
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        setIsLoading(false);
        
        // Cache the image
        if (imageCache.size >= MAX_CACHE_SIZE) {
          // Remove first item (oldest) if cache is full
          const firstKey = Array.from(imageCache.keys())[0];
          if (firstKey) imageCache.delete(firstKey);
        }
        imageCache.set(src, src);
      };
      
      img.onerror = handleImageError;
    }
  }, [src, isDataUrl, priority, handleImageError]);
  
  // Lazy loading with Intersection Observer for non-priority images
  useEffect(() => {
    if (!isDataUrl && !priority && !imageCache.has(src) && elementRef.current) {
      const element = elementRef.current;
      
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            // Check if already loading this image
            if (loadingImages.has(src)) {
              return;
            }
            
            loadingImages.add(src);
            const img = new Image();
            img.src = src;
            
            img.onload = () => {
              loadingImages.delete(src);
              
              // Cache the image if not already cached
              if (!imageCache.has(src)) {
                // Remove oldest item if cache is full
                if (imageCache.size >= MAX_CACHE_SIZE) {
                  const firstKey = Array.from(imageCache.keys())[0];
                  if (firstKey) imageCache.delete(firstKey);
                }
                imageCache.set(src, src);
              }
              
              setImageSrc(src);
              setIsLoading(false);
            };
            
            img.onerror = () => {
              loadingImages.delete(src);
              handleImageError();
            };
            
            observer.disconnect();
          }
        },
        {
          rootMargin: '200px', // Load when within 200px of viewport
          threshold: 0.01
        }
      );
      
      observer.observe(element);
      
      return () => {
        observer.disconnect();
      };
    }
  }, [src, isDataUrl, priority, handleImageError]);
  
  // Image attributes
  const imgAttributes = useMemo(() => ({
    src: imageSrc || '',
    alt,
    className,
    loading: priority ? 'eager' as const : 'lazy' as const,
    decoding: 'async' as const,
    onLoad: handleImageLoad,
    onError: handleImageError,
    width,
    height,
    style: { display: isLoading ? 'none' : 'block' }
  }), [imageSrc, alt, className, priority, handleImageLoad, handleImageError, width, height, isLoading]);
  
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-muted/20 ${className}`} style={{ width, height }}>
        <span className="text-xs text-muted-foreground">Image not available</span>
      </div>
    );
  }
  
  return (
    <>
      {isLoading && (
        <div ref={elementRef}>
          <Skeleton
            className={className}
            style={{ width, height }}
          />
        </div>
      )}
      {imageSrc && <img {...imgAttributes} />}
    </>
  );
};

export default React.memo(OptimizedTradeImage);
