import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Play,
  Pause,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { GalleryItem, GallerySettings } from '@/types/gallery';
import { loadGalleryData } from '@/utils/gallery-utils';

const TradersGallery = () => {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<GallerySettings>({ showTitles: false });
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    loadData();

    // Listen for gallery updates from admin page
    const handleGalleryUpdate = () => {
      loadData();
    };
    window.addEventListener('gallery-updated', handleGalleryUpdate);

    return () => {
      window.removeEventListener('gallery-updated', handleGalleryUpdate);
    };
  }, []);

  const loadData = async () => {
    try {
      const data = await loadGalleryData();
      setGalleryItems(data.items);
      setSettings(data.settings);
    } catch (error) {
      console.error('Error loading gallery data:', error);
      // Fallback to default items on error
      const { defaultGalleryItems, defaultGallerySettings } = await import('@/utils/gallery-utils');
      setGalleryItems(defaultGalleryItems);
      setSettings(defaultGallerySettings);
    }
  };

  useEffect(() => {
    // Auto-scroll for desktop view every 5 seconds
    if (!isMobile && galleryItems.length > 0 && isPlaying && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxItems = galleryItems.length;
          const itemsPerView = 4;
          const maxIndex = Math.max(0, maxItems - itemsPerView);
          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [galleryItems.length, isMobile, isPlaying, isPaused]);

  // Auto-scroll for mobile horizontal view
  useEffect(() => {
    const mobileContainer = document.getElementById('mobile-gallery-container');
    if (!isMobile || !mobileContainer || !isPlaying || isPaused || galleryItems.length === 0) return;

    const interval = setInterval(() => {
      const cardWidth = 280; // 260px + 20px gap
      const maxScroll = mobileContainer.scrollWidth - mobileContainer.clientWidth;
      const currentScroll = mobileContainer.scrollLeft;
      const nextScroll = currentScroll + cardWidth;

      if (nextScroll >= maxScroll) {
        // Reset to beginning for infinite loop
        mobileContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        mobileContainer.scrollTo({ left: nextScroll, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile, isPlaying, isPaused, galleryItems.length]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const togglePlayPause = () => setIsPlaying(!isPlaying);

  // Show loading state if no items
  if (galleryItems.length === 0) {
    return (
      <section className={`${isMobile ? 'py-12 px-4' : 'py-20 px-6'} bg-gradient-to-b from-background via-background/95 to-muted/30`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p className="text-muted-foreground">Loading community gallery...</p>
        </div>
      </section>
    );
  }

  const nextSlide = () => {
    const itemsPerView = isMobile ? 1 : 4;
    const maxIndex = Math.max(0, galleryItems.length - itemsPerView);
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const itemsPerView = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, galleryItems.length - itemsPerView);

  return (
    <section className={`${isMobile ? 'py-12 px-4' : 'py-20 px-6'} bg-gradient-to-b from-background via-background/95 to-muted/30 relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <Badge className={`${isMobile ? 'text-xs px-3 py-1' : 'text-sm px-4 py-2'} bg-blue-500/10 text-blue-600 border-blue-500/30 hover:bg-blue-500/20`}>
            <Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
            Community Showcase
          </Badge>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold tracking-tight`}>
            Meet Our{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Traders Community
            </span>
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className={`text-center text-muted-foreground mb-12 ${isMobile ? 'text-base px-4' : 'text-xl'} max-w-3xl mx-auto`}
        >
          Join thousands of successful traders sharing their journey and results
        </motion.p>

        {/* Gallery Container */}
        <div className="relative">
          {/* Navigation Buttons - Desktop Only */}
          {!isMobile && galleryItems.length > 4 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-primary/30 hover:border-primary hover:bg-primary/10"
                onClick={prevSlide}
                disabled={currentIndex <= 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-primary/30 hover:border-primary hover:bg-primary/10"
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Gallery Grid */}
          <div className="overflow-hidden rounded-3xl">
            {isMobile ? (
              /* Mobile: Horizontal Scroll */
              <div 
                id="mobile-gallery-container"
                className="overflow-x-auto overflow-y-hidden scrollbar-hide"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleMouseEnter}
                onTouchEnd={handleMouseLeave}
              >
                <div className="flex gap-5 pb-4" style={{ width: `${galleryItems.length * 2 * 280}px` }}>
                  {/* Duplicate items for seamless looping */}
                  {[...galleryItems, ...galleryItems].map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: (index % galleryItems.length) * 0.1 }}
                      viewport={{ once: true }}
                      className="group cursor-pointer flex-shrink-0"
                      style={{ width: '260px' }}
                    >
                      <Card className="overflow-hidden bg-card/40 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-xl">
                        {/* Fixed Container with Exact Dimensions */}
                        <div className="relative w-full h-64 overflow-hidden bg-muted/20">
                          
                          {/* Media Content */}
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={settings.showTitles ? item.title : 'Community gallery image'}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : (
                            <video
                              src={item.url}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              muted
                              loop
                              playsInline
                              autoPlay
                              preload="metadata"
                              style={{
                                objectFit: 'cover',
                                objectPosition: 'center'
                              }}
                              onError={(e) => {
                                console.error('Video error:', e);
                              }}
                            />
                          )}
                          
                          {/* Fallback for failed media */}
                          <div className="hidden absolute inset-0 bg-muted/20 flex items-center justify-center">
                            <div className="text-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Trading Media</p>
                            </div>
                          </div>
                          
                          {/* Title Overlay - Only if enabled */}
                          {settings.showTitles && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="text-white font-semibold text-sm mb-1">
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className="text-white/80 text-xs">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Type Badge */}
                          <div className="absolute top-3 right-3">
                            <Badge className={`${
                              item.type === 'video' 
                                ? 'bg-red-500/80 text-white border-red-500/30' 
                                : 'bg-blue-500/80 text-white border-blue-500/30'
                            } backdrop-blur-sm text-xs px-2 py-1`}>
                              {item.type === 'video' ? (
                                <Play className="h-2 w-2 mr-1" />
                              ) : (
                                <ImageIcon className="h-2 w-2 mr-1" />
                              )}
                              {item.type === 'video' ? 'Video' : 'Photo'}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              /* Desktop: 4-column Grid */
              <div className="grid grid-cols-4 gap-6">
                {galleryItems.slice(currentIndex, currentIndex + 4).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group cursor-pointer"
                  >
                    <Card className="overflow-hidden bg-card/40 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-xl">
                      {/* Fixed Container with Exact Dimensions */}
                      <div className="relative w-full h-80 overflow-hidden bg-muted/20">
                        
                        {/* Media Content */}
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={settings.showTitles ? item.title : 'Community gallery image'}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : (
                          <video
                            src={item.url}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            muted
                            loop
                            playsInline
                            autoPlay
                            preload="metadata"
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center'
                            }}
                            onError={(e) => {
                              console.error('Video error:', e);
                            }}
                          />
                        )}
                        
                        {/* Fallback for failed media */}
                        <div className="hidden absolute inset-0 bg-muted/20 flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Trading Media</p>
                          </div>
                        </div>
                        
                        {/* Title Overlay - Only if enabled */}
                        {settings.showTitles && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-white font-semibold text-lg mb-1">
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="text-white/80 text-sm">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Type Badge */}
                        <div className="absolute top-4 right-4">
                          <Badge className={`${
                            item.type === 'video' 
                              ? 'bg-red-500/80 text-white border-red-500/30' 
                              : 'bg-blue-500/80 text-white border-blue-500/30'
                          } backdrop-blur-sm`}>
                            {item.type === 'video' ? (
                              <Play className="h-3 w-3 mr-1" />
                            ) : (
                              <ImageIcon className="h-3 w-3 mr-1" />
                            )}
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className={`text-center ${isMobile ? 'mt-6' : 'mt-8'}`}
          >
            {isMobile ? (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    Swipe to see more traders
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayPause}
                  className="bg-card/80 backdrop-blur-sm border-2 hover:bg-card/90 transition-all duration-300"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Scroll to discover more amazing traders in our community
              </p>
            )}
            
            {/* Sleek Line Indicators - Mobile Only */}
            {isMobile && galleryItems.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                {galleryItems.map((_, index) => (
                  <button
                    key={index}
                    className="group"
                    onClick={() => setCurrentIndex(index)}
                  >
                    <div className={`transition-all duration-500 ease-out ${
                      index === currentIndex 
                        ? 'w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full' 
                        : 'w-2 h-2 bg-muted-foreground/40 rounded-full group-hover:bg-muted-foreground/60 group-hover:scale-110'
                    }`} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TradersGallery;