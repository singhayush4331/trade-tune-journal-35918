import { GalleryItem, GallerySettings } from '@/types/gallery';
import { supabase } from '@/integrations/supabase/client';

export const defaultGalleryItems: GalleryItem[] = [
  {
    id: 'default-1',
    type: 'image',
    url: '/lovable-uploads/990e60b1-9a6f-45a0-b5e6-9bb5109d373a.png',
    title: 'Trading Workshop',
    description: 'Community learning session',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-2',
    type: 'image', 
    url: '/lovable-uploads/9ea240e5-b9e3-4cda-a9f3-829b0695c636.png',
    title: 'Success Celebration',
    description: 'Milestone achievement',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-3',
    type: 'image',
    url: '/lovable-uploads/86f360ff-2b03-4cb9-9bff-e07a55844eed.png',
    title: 'Group Discussion',
    description: 'Strategy sharing',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-4',
    type: 'image',
    url: '/lovable-uploads/7af97329-5f82-41a6-af28-113f7711536c.png',
    title: 'Learning Session',
    description: 'Educational workshop',
    createdAt: new Date().toISOString()
  }
];

export const defaultGallerySettings: GallerySettings = {
  showTitles: false
};

// Load gallery data from Supabase
export const loadGalleryData = async () => {
  try {
    // Load items from Supabase
    const { data: items, error: itemsError } = await supabase
      .from('gallery_items' as any)
      .select('*')
      .order('order_index', { ascending: true });

    // Load settings from Supabase
    const { data: settingsData, error: settingsError } = await supabase
      .from('gallery_settings' as any)
      .select('*')
      .limit(1)
      .maybeSingle();

    if (itemsError && itemsError.code !== 'PGRST116') { // PGRST116 is "no rows" error
      console.error('Error loading gallery items:', itemsError);
    }

    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('Error loading gallery settings:', settingsError);
    }

    // Transform database items to match our interface
    const galleryItems: GalleryItem[] = items?.map((item: any) => ({
      id: item.id,
      type: item.file_type as 'image' | 'video',
      url: item.file_url,
      title: item.title,
      description: item.description || '',
      createdAt: item.created_at || new Date().toISOString()
    })) || defaultGalleryItems;

    const settings: GallerySettings = {
      showTitles: (settingsData as any)?.show_titles || defaultGallerySettings.showTitles
    };

    return { items: galleryItems, settings };
  } catch (error) {
    console.error('Error loading gallery data:', error);
    return { items: defaultGalleryItems, settings: defaultGallerySettings };
  }
};

// Save gallery items to Supabase
export const saveGalleryItems = async (items: GalleryItem[]) => {
  try {
    // Delete all existing items first
    await supabase.from('gallery_items' as any).delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert new items
    const dbItems = items.map((item, index) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      file_url: item.url,
      file_type: item.type,
      order_index: index,
      created_at: item.createdAt
    }));

    if (dbItems.length > 0) {
      const { error } = await supabase
        .from('gallery_items' as any)
        .insert(dbItems);

      if (error) {
        console.error('Error saving gallery items:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error saving gallery items:', error);
    throw error;
  }
};

// Save gallery settings to Supabase
export const saveGallerySettings = async (settings: GallerySettings) => {
  try {
    const { error } = await supabase
      .from('gallery_settings' as any)
      .upsert({
        id: 'default', // Use a fixed ID for settings
        show_titles: settings.showTitles,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving gallery settings:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error saving gallery settings:', error);
    throw error;
  }
};

// Upload file to Supabase Storage
export const uploadGalleryFile = async (file: File, fileName: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('gallery')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};