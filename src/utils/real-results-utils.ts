import { RealResult } from '@/types/gallery';
import { supabase } from '@/integrations/supabase/client';

export const defaultRealResults: RealResult[] = [
  {
    id: 'default-1',
    image: '/lovable-uploads/10c2135b-18ac-464b-a5e3-fd5430a26063.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-2', 
    image: '/lovable-uploads/23b54970-8e48-42a5-95c9-78c42fe65e6d.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-3',
    image: '/lovable-uploads/2431611b-5e53-4079-8cfa-71459402d31e.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-4',
    image: '/lovable-uploads/2780255e-6d53-44a4-8fcf-7fa8a4a25bc1.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-5',
    image: '/lovable-uploads/59a3ac09-4acc-45c7-9cf2-3228d3493263.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-6',
    image: '/lovable-uploads/5ff49b53-f922-45bb-8a00-6ae902ecf012.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-7',
    image: '/lovable-uploads/604a9013-c183-4e62-b97f-aadea9e3b4a9.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-8',
    image: '/lovable-uploads/6120e2e2-296a-403d-a2a3-7cae3e7241fa.png',
    createdAt: new Date().toISOString()
  }
];

// Load real results data from Supabase
export const loadRealResultsData = async () => {
  try {
    const { data: results, error } = await supabase
      .from('real_results' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading real results:', error);
    }

    // Transform database items to match our interface
    const realResults: RealResult[] = results?.map((result: any) => ({
      id: result.id,
      image: result.image_url,
      createdAt: result.created_at || new Date().toISOString()
    })) || defaultRealResults;

    return realResults;
  } catch (error) {
    console.error('Error loading real results data:', error);
    return defaultRealResults;
  }
};

// Save real results to Supabase
export const saveRealResults = async (results: RealResult[]) => {
  try {
    // Delete all existing results first
    await supabase.from('real_results' as any).delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert new results
    const dbResults = results.map((result) => ({
      id: result.id,
      image_url: result.image,
      created_at: result.createdAt
    }));

    if (dbResults.length > 0) {
      const { error } = await supabase
        .from('real_results' as any)
        .insert(dbResults);

      if (error) {
        console.error('Error saving real results:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error saving real results:', error);
    throw error;
  }
};

// Upload file to Supabase Storage for real results
export const uploadRealResultFile = async (file: File, fileName: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('real-results')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading real result file:', error);
      throw error;
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('real-results')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  } catch (error) {
    console.error('Error uploading real result file:', error);
    throw error;
  }
};