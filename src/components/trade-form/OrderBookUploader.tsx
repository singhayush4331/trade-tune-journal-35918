import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
interface OrderBookUploaderProps {
  onTradesExtracted: (trades: any[], extractionData?: any) => void;
}

export const OrderBookUploader: React.FC<OrderBookUploaderProps> = ({ 
  onTradesExtracted 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // File validation
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Size validation (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should not exceed 10MB");
      return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeOrderBook = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an order book screenshot first");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Get current session to ensure user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast.error("Please log in to use this feature");
        return;
      }

      const { data, error } = await supabase.functions.invoke('analyze-trade-screenshot', {
        body: { imageData: uploadedImage },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze screenshot');
      }


      // Pass all extracted data including enhanced information
      onTradesExtracted(data.trades, {
        incompleteOrders: data.incompleteOrders || [],
        broker: data.broker,
        confidence: data.confidence,
        processingWarnings: data.processingWarnings || []
      });
      
      // Enhanced success messaging
      const warningsText = data.processingWarnings?.length ? 
        ` (${data.processingWarnings.length} warnings)` : '';
      
      if (data.hasIncompleteOrders) {
        toast.success(`🎯 ${data.message}${warningsText}`, {
          description: "Review and manually complete any incomplete orders if needed.",
          duration: 5000
        });
      } else {
        toast.success(`🚀 Extracted ${data.totalTrades} trades with enhanced accuracy!${warningsText}`, {
          description: `Confidence: ${(data.confidence * 100).toFixed(0)}% • Broker: ${data.broker}`,
          duration: 4000
        });
      }
      
      // Clear uploaded image after successful extraction
      setUploadedImage(null);
      
    } catch (error) {
      toast.error('Failed to analyze order book. Please try again.', {
        description: 'Ensure the image is clear and contains a valid order book.',
        duration: 5000
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleRemove = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <Camera className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Auto-Extract from Order Book</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Upload a screenshot of your broker's order book to automatically extract trade details
      </p>

      {uploadedImage ? (
        <div className="space-y-3">
          <div className="relative border rounded-md overflow-hidden">
            <img 
              src={uploadedImage} 
              alt="Order book screenshot" 
              className="w-full h-auto max-h-64 object-contain bg-muted" 
            />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full"
              onClick={handleRemove}
            >
              <span className="sr-only">Remove</span>
              <span className="text-xs font-bold">×</span>
            </Button>
          </div>
          
          <Button 
            onClick={analyzeOrderBook}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Screenshot...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Extract Trades
              </>
            )}
          </Button>
        </div>
      ) : (
        <div 
          className={cn(
            "relative overflow-hidden rounded-xl p-8 text-center flex flex-col items-center justify-center gap-4",
            "cursor-pointer group transition-all duration-300",
            "bg-gradient-to-br from-background via-card to-background",
            "border border-border/50 hover:border-primary/50",
            "hover:shadow-lg hover:shadow-primary/10",
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:via-transparent before:to-primary/10",
            "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
            isMobile ? "min-h-[140px]" : "min-h-[160px]"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Static gradient border overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Upload icon with enhanced styling */}
          <div className="relative z-10 p-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300 group-hover:scale-110">
            <Upload className="h-8 w-8 text-primary group-hover:text-primary transition-all duration-300" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 space-y-2">
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              Upload Order Book Screenshot
            </p>
            <p className="text-sm text-muted-foreground">
              AI-powered trade extraction
            </p>
            
            {/* Broker badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {['Zerodha', 'Upstox', 'Angel', 'Fyers'].map((broker) => (
                <span 
                  key={broker}
                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary/80 border border-primary/20 group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300"
                >
                  {broker}
                </span>
              ))}
            </div>
          </div>
          
          {/* Static dots indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
            {[1, 2, 3].map((dot) => (
              <div 
                key={dot}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            ))}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>
      )}
    </div>
  );
};