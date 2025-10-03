
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface ScreenshotUploaderProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  icon?: React.ReactNode;
}

export const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({ 
  value, 
  onChange, 
  label,
  icon
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // File validation
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Size validation (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should not exceed 5MB");
      return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-2">
      <span className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>{label}</span>
      {value ? (
        <div className="relative border rounded-md overflow-hidden">
          <img 
            src={value} 
            alt={label} 
            className="w-full h-auto max-h-48 object-contain bg-black/5" 
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
      ) : (
        <div 
          className={cn(
            "border-2 border-dashed rounded-md p-4 text-center flex flex-col items-center justify-center gap-2",
            "cursor-pointer hover:bg-muted/30 transition-colors",
            isMobile ? "min-h-[100px]" : "min-h-[120px]"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          {icon || null}
          <div>
            <p className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium mb-1`}>Upload {label}</p>
            <p className="text-xs text-muted-foreground">Click to browse</p>
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
