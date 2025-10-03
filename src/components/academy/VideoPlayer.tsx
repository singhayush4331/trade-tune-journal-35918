
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { getVideoInfo } from '@/utils/video-utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Play, Loader2, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onProgressUpdate?: (progress: number, watchTime: number) => void;
  onComplete?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    youtubeAPILoaded?: boolean;
    youtubeAPIPromise?: Promise<void>;
  }
}

// Global YouTube API management
const loadYouTubeAPI = (): Promise<void> => {
  if (window.youtubeAPILoaded) {
    return Promise.resolve();
  }

  if (window.youtubeAPIPromise) {
    return window.youtubeAPIPromise;
  }

  window.youtubeAPIPromise = new Promise((resolve, reject) => {
    // Set up the callback before loading the script
    window.onYouTubeIframeAPIReady = () => {
      window.youtubeAPILoaded = true;
      resolve();
    };

    // Add timeout for API loading
    const timeout = setTimeout(() => {
      reject(new Error('YouTube API loading timeout'));
    }, 10000);

    // Clear timeout when API loads
    const originalCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      originalCallback();
    };

    // Load the YouTube API script if not already present
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load YouTube API'));
      };
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  });

  return window.youtubeAPIPromise;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  title, 
  onProgressUpdate,
  onComplete 
}) => {
  const [player, setPlayer] = useState<any>(null);
  const [duration, setDuration] = useState(0);
  const [watchedSegments, setWatchedSegments] = useState<Set<number>>(new Set());
  const [totalWatchTime, setTotalWatchTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef(0);

  // Memoize video info to prevent recalculation
  const videoInfo = useMemo(() => getVideoInfo(videoUrl), [videoUrl]);

  // Get YouTube thumbnail
  const thumbnailUrl = useMemo(() => {
    if (videoInfo.platform === 'youtube' && videoInfo.videoId) {
      return `https://img.youtube.com/vi/${videoInfo.videoId}/maxresdefault.jpg`;
    }
    return null;
  }, [videoInfo]);

  useEffect(() => {
    let mounted = true;

    const initializeAPI = async () => {
      try {
        setApiLoading(true);
        setApiError(null);
        await loadYouTubeAPI();
        
        if (mounted) {
          setApiLoading(false);
        }
      } catch (error) {
        console.error('YouTube API loading failed:', error);
        if (mounted) {
          setApiError(error instanceof Error ? error.message : 'Failed to load video player');
          setApiLoading(false);
        }
      }
    };

    initializeAPI();

    return () => {
      mounted = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (player) {
        try {
          player.destroy();
        } catch (e) {
          console.warn('Error destroying player:', e);
        }
      }
    };
  }, []);

  const initializePlayer = () => {
    if (!playerRef.current || !videoInfo.videoId || !window.YT) return;

    try {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoInfo.videoId,
        playerVars: {
          enablejsapi: 1,
          origin: window.location.origin,
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3
        },
        events: {
          onReady: handlePlayerReady,
          onStateChange: handlePlayerStateChange,
          onError: handlePlayerError
        }
      });

      setPlayer(newPlayer);
    } catch (error) {
      console.error('Error initializing player:', error);
      setApiError('Failed to initialize video player');
    }
  };

  const handlePlayerReady = (event: any) => {
    const videoDuration = event.target.getDuration();
    setDuration(videoDuration);
    setPlayerReady(true);
    console.log('Video ready, duration:', videoDuration);
  };

  const handlePlayerError = (event: any) => {
    console.error('YouTube player error:', event.data);
    setApiError('Video failed to load. Please try again.');
  };

  const handlePlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      startProgressTracking();
    } else if (event.data === window.YT.PlayerState.PAUSED || 
               event.data === window.YT.PlayerState.ENDED) {
      stopProgressTracking();
    }

    if (event.data === window.YT.PlayerState.ENDED) {
      handleVideoComplete();
    }
  };

  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      if (player && player.getCurrentTime) {
        const currentTime = Math.floor(player.getCurrentTime());
        const videoDuration = player.getDuration();
        
        if (currentTime !== lastTimeRef.current) {
          setWatchedSegments(prev => new Set([...prev, currentTime]));
          lastTimeRef.current = currentTime;
        }

        setWatchedSegments(segments => {
          const uniqueWatchTime = segments.size;
          setTotalWatchTime(uniqueWatchTime);
          
          if (videoDuration > 0) {
            const progressPercentage = (uniqueWatchTime / videoDuration) * 100;
            onProgressUpdate?.(Math.min(progressPercentage, 100), uniqueWatchTime);
            
            if (progressPercentage >= 90 && !isCompleted) {
              handleVideoComplete();
            }
          }
          
          return segments;
        });
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const handleVideoComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      onComplete?.();
      console.log('Video completed!');
    }
  };

  const handlePlayClick = () => {
    setShowPlayer(true);
    setTimeout(initializePlayer, 100);
  };

  const handleMarkAsComplete = () => {
    handleVideoComplete();
  };

  if (!videoInfo.embedUrl || !videoInfo.videoId) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <p className="text-muted-foreground">Invalid video URL provided</p>
      </Card>
    );
  }

  if (apiError) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <p className="text-destructive mb-4">{apiError}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </Card>
    );
  }

  const progressPercentage = duration > 0 ? (totalWatchTime / duration) * 100 : 0;

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-black">
          {!showPlayer && thumbnailUrl && (
            <div className="relative w-full h-full">
              <img 
                src={thumbnailUrl} 
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                {apiLoading ? (
                  <div className="flex flex-col items-center gap-3 text-white">
                    <Loader2 className="h-12 w-12 animate-spin" />
                    <p className="text-sm">Loading player...</p>
                  </div>
                ) : (
                  <Button
                    onClick={handlePlayClick}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full w-20 h-20 p-0"
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {showPlayer && (
            <div className="w-full h-full">
              {!playerReady && (
                <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-3 text-white">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-sm">Initializing player...</p>
                  </div>
                </div>
              )}
              <div ref={playerRef} className="w-full h-full" />
            </div>
          )}
        </div>
      </Card>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{title}</span>
          {duration > 0 && (
            <span>
              {Math.floor(totalWatchTime / 60)}:{(totalWatchTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{(Math.floor(duration) % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {progressPercentage > 0 && (
            <span>{Math.round(progressPercentage)}% watched</span>
          )}
          {!isCompleted ? (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleMarkAsComplete}
              className="text-xs"
            >
              Mark as Complete
            </Button>
          ) : (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs">Completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
