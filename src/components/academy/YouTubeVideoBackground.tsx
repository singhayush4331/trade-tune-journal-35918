
import React, { useState, useEffect } from 'react';
import { getVideoInfo } from '@/utils/video-utils';
import { Play, AlertCircle } from 'lucide-react';

interface YouTubeVideoBackgroundProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string;
  onPlayClick?: () => void;
  className?: string;
}

const YouTubeVideoBackground: React.FC<YouTubeVideoBackgroundProps> = ({
  videoUrl,
  title,
  thumbnailUrl,
  onPlayClick,
  className = ""
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const videoInfo = getVideoInfo(videoUrl);

  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      if (videoInfo.embedUrl && videoInfo.platform === 'youtube') {
        setShowVideo(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [videoInfo.embedUrl, videoInfo.platform]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setVideoLoaded(false);
  };

  // If no valid video URL or video failed, show thumbnail fallback
  if (!videoInfo.embedUrl || videoInfo.platform !== 'youtube' || videoError) {
    return thumbnailUrl ? (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
            <Play className="text-white ml-0.5 h-6 w-6" />
          </div>
        </div>
        {videoError && (
          <div className="absolute top-2 left-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>
    ) : null;
  }

  const embedUrl = `${videoInfo.embedUrl}&autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=0`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Show thumbnail initially while video loads */}
      {!videoLoaded && thumbnailUrl && (
        <div className="absolute inset-0 z-10">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* YouTube video embed */}
      {showVideo && (
        <iframe
          src={embedUrl}
          className="w-full h-full absolute inset-0"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleVideoLoad}
          onError={handleVideoError}
          style={{ pointerEvents: 'none' }} // Prevent interaction with video
        />
      )}

      {/* Overlay for interaction */}
      <div 
        className="absolute inset-0 z-20 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        onClick={onPlayClick}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
            <Play className="text-white ml-0.5 h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeVideoBackground;
