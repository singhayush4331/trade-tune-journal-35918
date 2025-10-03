-- Add options trading metadata columns to trades table
ALTER TABLE public.trades 
ADD COLUMN IF NOT EXISTS exchange text DEFAULT 'NSE',
ADD COLUMN IF NOT EXISTS market_segment text DEFAULT 'equity-delivery',
ADD COLUMN IF NOT EXISTS option_type text,
ADD COLUMN IF NOT EXISTS position_type text;

-- Add index for better performance on options queries
CREATE INDEX IF NOT EXISTS idx_trades_option_type ON public.trades(option_type) WHERE option_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trades_market_segment ON public.trades(market_segment);

-- Add comments for documentation
COMMENT ON COLUMN public.trades.exchange IS 'Trading exchange (NSE, BSE, MCX, etc.)';
COMMENT ON COLUMN public.trades.market_segment IS 'Market segment (equity-delivery, options, futures, etc.)';
COMMENT ON COLUMN public.trades.option_type IS 'Option type for options trades (CE, PE)';
COMMENT ON COLUMN public.trades.position_type IS 'Position type for options trades (buy, sell)';