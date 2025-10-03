-- Create the real_results table
CREATE TABLE public.real_results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.real_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Real results are publicly viewable" 
ON public.real_results 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage real results" 
ON public.real_results 
FOR ALL 
USING (is_admin_secure(auth.uid()))
WITH CHECK (is_admin_secure(auth.uid()));

-- Create storage bucket for real results
INSERT INTO storage.buckets (id, name, public) VALUES ('real-results', 'real-results', true);

-- Create storage policies for real results
CREATE POLICY "Real results images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'real-results');

CREATE POLICY "Admins can upload real results" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'real-results' AND is_admin_secure(auth.uid()));

CREATE POLICY "Admins can update real results" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'real-results' AND is_admin_secure(auth.uid()));

CREATE POLICY "Admins can delete real results" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'real-results' AND is_admin_secure(auth.uid()));

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_real_results_updated_at
BEFORE UPDATE ON public.real_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();