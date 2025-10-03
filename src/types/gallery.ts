export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description?: string;
  createdAt: string;
}

export interface RealResult {
  id: string;
  image: string;
  createdAt: string;
}

export interface GallerySettings {
  showTitles: boolean;
}