
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { List, ListChecks } from 'lucide-react';

export const EntryExitGuide: React.FC = () => {
  return (
    <Alert className="bg-muted/30 border-primary/20">
      <List className="h-4 w-4 text-primary" />
      <AlertDescription className="text-sm text-muted-foreground mt-2">
        Add one criteria per line. Each line will become a checkable item in the strategy checklist.
        <div className="mt-2 text-xs">
          Example format:
          <pre className="mt-1 p-2 rounded bg-muted/50 text-xs">
            Price above 200 MA{'\n'}
            RSI below 30{'\n'}
            Volume above average
          </pre>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default EntryExitGuide;
