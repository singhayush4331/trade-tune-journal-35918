import { useEffect, useRef } from 'react';

export const useVideoAutoplay = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        // Ensure video is muted for autoplay to work
        video.muted = true;
        video.playsInline = true;
        
        // Try to play the video
        await video.play();
        
        // Hide fallback if video starts playing
        const fallback = video.parentElement?.querySelector('.video-fallback') as HTMLElement;
        if (fallback) {
          fallback.style.display = 'none';
        }
      } catch (error) {
        console.warn('Video autoplay failed:', error);
        // Show fallback if autoplay fails
        const fallback = video.parentElement?.querySelector('.video-fallback') as HTMLElement;
        if (fallback) {
          fallback.style.display = 'flex';
        }
      }
    };

    // Play video when it's loaded
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('loadeddata', playVideo);
    }

    // Also try to play on user interaction
    const handleInteraction = () => {
      playVideo();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      video.removeEventListener('loadeddata', playVideo);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return videoRef;
};