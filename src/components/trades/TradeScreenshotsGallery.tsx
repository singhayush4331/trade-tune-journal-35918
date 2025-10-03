
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OptimizedTradeImage from './OptimizedTradeImage';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface TradeScreenshotsGalleryProps {
  screenshots: Array<{
    id: string;
    url: string;
    type: 'entry' | 'exit';
    timestamp?: Date;
  }>;
  maxThumbnails?: number;
  size?: 'default' | 'larger';
}

const TradeScreenshotsGallery: React.FC<TradeScreenshotsGalleryProps> = ({
  screenshots,
  maxThumbnails = 4,
  size = 'larger'
}) => {
  const [visibleImages, setVisibleImages] = useState<typeof screenshots>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    setVisibleImages(screenshots.slice(0, Math.min(2, maxThumbnails)));
    
    if (screenshots.length > 2) {
      const timer = setTimeout(() => {
        setVisibleImages(screenshots.slice(0, maxThumbnails));
        
        if (screenshots.length > maxThumbnails) {
          const finalTimer = setTimeout(() => {
            setVisibleImages(screenshots);
          }, 1000);
          return () => clearTimeout(finalTimer);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [screenshots, maxThumbnails]);
  
  const handleImageClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setIsDialogOpen(true);
  }, []);
  
  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex(prev => 
      prev === null ? null : prev <= 0 ? screenshots.length - 1 : prev - 1
    );
  }, [screenshots.length]);
  
  const handleNextImage = useCallback(() => {
    setSelectedImageIndex(prev => 
      prev === null ? null : prev >= screenshots.length - 1 ? 0 : prev + 1
    );
  }, [screenshots.length]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDialogOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        case 'Escape':
          setIsDialogOpen(false);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDialogOpen, handlePrevImage, handleNextImage]);
  
  const showMoreButton = screenshots.length > visibleImages.length;

  if (screenshots.length === 0) {
    return <div className="text-muted-foreground text-sm">No screenshots available</div>;
  }

  // Determine the grid layout based on number of screenshots and size
  const getGridLayout = () => {
    if (screenshots.length === 1) {
      return 'grid-cols-1';
    } else if (screenshots.length === 2) {
      return 'grid-cols-2';
    } else {
      return size === 'larger' ? 'grid-cols-2 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4';
    }
  };

  return (
    <div className="space-y-4">
      <div className={`grid ${getGridLayout()} gap-3 w-full`}>
        {visibleImages.slice(0, maxThumbnails).map((screenshot, index) => (
          <Card 
            key={screenshot.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-border/50 w-full"
            onClick={() => handleImageClick(index)}
          >
            <CardContent className={`p-1 relative group ${size === 'larger' ? 'h-64 sm:h-72' : 'h-32 sm:h-40'}`}>
              <OptimizedTradeImage
                src={screenshot.url}
                alt={`${screenshot.type} screenshot`}
                className="w-full h-full object-cover rounded"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                <ZoomIn className="text-white h-6 w-6" />
              </div>
              <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-background/80 text-xs font-medium rounded shadow-sm">
                {screenshot.type === 'entry' ? 'Entry' : 'Exit'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {showMoreButton && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setVisibleImages(screenshots)}
        >
          Show All ({screenshots.length - visibleImages.length} more)
        </Button>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur-md">
          {selectedImageIndex !== null && screenshots[selectedImageIndex] && (
            <div className="relative">
              <div className="flex items-center justify-between p-2 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
                <div className="text-white font-medium">
                  {screenshots[selectedImageIndex].type === 'entry' ? 'Entry' : 'Exit'} Screenshot
                  {screenshots[selectedImageIndex].timestamp && (
                    <span className="ml-2 text-xs opacity-80">
                      {new Date(screenshots[selectedImageIndex].timestamp!).toLocaleString()}
                    </span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center min-h-[60vh]">
                <OptimizedTradeImage 
                  src={screenshots[selectedImageIndex].url}
                  alt={`${screenshots[selectedImageIndex].type} screenshot`}
                  className="max-w-full max-h-[80vh] object-contain"
                  priority={true}
                />
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={handlePrevImage}
                  className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={handleNextImage}
                  className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="absolute bottom-4 right-4 text-xs bg-background/80 px-2 py-1 rounded-full backdrop-blur-sm">
                {selectedImageIndex + 1} / {screenshots.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(TradeScreenshotsGallery);
