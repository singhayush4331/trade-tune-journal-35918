
export interface VideoInfo {
  platform: 'youtube' | 'vimeo' | 'unknown';
  videoId: string | null;
  embedUrl: string | null;
}

export const getVideoInfo = (url: string): VideoInfo => {
  if (!url || typeof url !== 'string') {
    return { platform: 'unknown', videoId: null, embedUrl: null };
  }

  // Clean the URL
  const cleanUrl = url.trim();

  // YouTube patterns - more comprehensive
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of youtubePatterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      return {
        platform: 'youtube',
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
      };
    }
  }

  // Vimeo pattern
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      platform: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`
    };
  }

  // Check if it's already an embed URL
  if (cleanUrl.includes('youtube.com/embed/')) {
    const embedMatch = cleanUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch && embedMatch[1]) {
      return {
        platform: 'youtube',
        videoId: embedMatch[1],
        embedUrl: cleanUrl
      };
    }
  }

  return { platform: 'unknown', videoId: null, embedUrl: null };
};

// Helper function to get video thumbnail
export const getVideoThumbnail = (videoInfo: VideoInfo): string | null => {
  if (videoInfo.platform === 'youtube' && videoInfo.videoId) {
    return `https://img.youtube.com/vi/${videoInfo.videoId}/maxresdefault.jpg`;
  }
  
  if (videoInfo.platform === 'vimeo' && videoInfo.videoId) {
    // Vimeo thumbnails require API call, return placeholder for now
    return null;
  }
  
  return null;
};

// Helper function to validate video URL
export const isValidVideoUrl = (url: string): boolean => {
  const videoInfo = getVideoInfo(url);
  return videoInfo.platform !== 'unknown' && videoInfo.videoId !== null;
};
