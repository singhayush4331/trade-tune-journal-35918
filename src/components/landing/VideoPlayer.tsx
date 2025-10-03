import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, className = "" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        // Ensure video is muted for autoplay to work
        video.muted = true;
        video.playsInline = true;
        
        // Wait for video to be loaded enough to play
        if (video.readyState < 3) {
          await new Promise((resolve) => {
            const handler = () => {
              video.removeEventListener('loadeddata', handler);
              resolve(void 0);
            };
            video.addEventListener('loadeddata', handler);
          });
        }
        
        // Try to play the video
        await video.play();
        setIsLoading(false);
        setHasError(false);
        
      } catch (error) {
        console.warn('Video autoplay failed for:', title, error);
        setIsLoading(false);
        setHasError(true);
      }
    };

    // Set up event listeners
    const handleLoadStart = () => setIsLoading(true);
    const handleLoadedData = () => {
      setIsLoading(false);
      playVideo();
    };
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    // Try to play if already loaded
    if (video.readyState >= 3) {
      playVideo();
    }

    // Retry playback on user interaction
    const handleUserInteraction = () => {
      if (hasError || video.paused) {
        playVideo();
      }
    };

    const interactionEvents = ['click', 'touchstart', 'scroll'];
    interactionEvents.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true, passive: true });
    });

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [src, title, hasError]);

  return (
    <div className={`relative w-full h-full bg-gray-900 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover object-center min-w-full min-h-full transition-transform duration-500 group-hover:scale-110"
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          minWidth: '100%',
          minHeight: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
      
      {/* Loading/Error State */}
      {(isLoading || hasError) && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
          <div className="text-center">
            {isLoading ? (
              <>
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-red-600">Loading video...</p>
              </>
            ) : (
              <>
                <Play className="h-12 w-12 text-red-500 mx-auto mb-2 cursor-pointer hover:scale-110 transition-transform" 
                     onClick={() => {
                       const video = videoRef.current;
                       if (video) {
                         video.muted = true;
                         video.play().catch(console.error);
                         setHasError(false);
                       }
                     }} />
                <p className="text-xs text-red-600">Click to play</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;