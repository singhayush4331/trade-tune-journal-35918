
-- Create storage bucket for course media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-media', 'course-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for authenticated users to upload files
CREATE POLICY "Authenticated users can upload course media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'course-media' 
  AND auth.role() = 'authenticated'
);

-- Create policy for public read access
CREATE POLICY "Public read access for course media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'course-media');

-- Create policy for users to update their own files
CREATE POLICY "Users can update their own course media" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'course-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for users to delete their own files
CREATE POLICY "Users can delete their own course media" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'course-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
