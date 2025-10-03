
import React, { useState } from 'react';
import { Clock, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { removeMockData } from '@/services/mock-data-service';
import { toast } from 'sonner';

interface TrialBannerProps {
  trialExpiresAt: Date;
  className?: string;
  showDismiss?: boolean;
  onMockDataCleared?: () => void;
}

const TrialBanner: React.FC<TrialBannerProps> = ({ 
  trialExpiresAt, 
  className = '',
  showDismiss = false,
  onMockDataCleared
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  
  if (isDismissed) return null;

  // Calculate time remaining
  const now = new Date();
  const timeRemaining = trialExpiresAt.getTime() - now.getTime();
  const hoursRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60)));
  
  if (timeRemaining <= 0) return null;

  const getTimeMessage = () => {
    if (hoursRemaining <= 1) {
      const minutesRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60)));
      return `${minutesRemaining} minutes remaining`;
    }
    return `${hoursRemaining} hours remaining`;
  };

  const getUrgencyVariant = () => {
    if (hoursRemaining <= 2) return 'destructive';
    if (hoursRemaining <= 6) return 'default';
    return 'default';
  };

  const handleClearMockData = async () => {
    setIsClearing(true);
    try {
      const success = removeMockData();
      if (success) {
        toast.success("Demo data cleared successfully");
        onMockDataCleared?.();
      }
    } catch (error) {
      console.error("Failed to clear mock data:", error);
      toast.error("Failed to clear demo data");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Alert variant={getUrgencyVariant()} className={`relative ${className}`}>
      <Clock className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <strong>Free trial active!</strong> {getTimeMessage()} in your 24-hour trial period.
          <Link to="/subscription" className="ml-2 underline hover:no-underline">
            Subscribe now
          </Link>
          <span className="mx-2 text-muted-foreground">•</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button 
                className="text-xs text-muted-foreground hover:text-foreground underline hover:no-underline inline-flex items-center gap-1 transition-colors"
                disabled={isClearing}
              >
                <Trash2 className="h-3 w-3" />
                Clear Demo Data
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Demo Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove all demo trades and playbooks from your account. 
                  You'll start with a clean slate. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleClearMockData}
                  disabled={isClearing}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isClearing ? "Clearing..." : "Clear Data"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {showDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default TrialBanner;
