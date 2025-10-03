-- Create table for storing trade extraction results
CREATE TABLE public.trade_extractions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_data TEXT NOT NULL,
  raw_extraction JSONB,
  processed_trades JSONB,
  broker_type TEXT,
  extraction_confidence NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trade_extractions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own trade extractions" 
ON public.trade_extractions 
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_trade_extractions_updated_at
BEFORE UPDATE ON public.trade_extractions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();