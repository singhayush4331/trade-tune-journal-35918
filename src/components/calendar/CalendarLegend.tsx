
import React from 'react';

export const CalendarLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-muted/20 p-3 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-xl bg-gradient-to-b from-success/90 to-success/70 border border-success shadow-sm shadow-success/20"></div>
        <span className="text-xs text-muted-foreground">High Profit</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-xl bg-gradient-to-b from-success/70 to-success/50 border border-success/60"></div>
        <span className="text-xs text-muted-foreground">Medium Profit</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-xl bg-gradient-to-b from-success/50 to-success/30 border border-success/40"></div>
        <span className="text-xs text-muted-foreground">Low Profit</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-xl bg-gradient-to-b from-destructive/50 to-destructive/30 border border-destructive/40"></div>
        <span className="text-xs text-muted-foreground">Low Loss</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-xl bg-gradient-to-b from-destructive/70 to-destructive/50 border border-destructive/60"></div>
        <span className="text-xs text-muted-foreground">Medium Loss</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-xl bg-gradient-to-b from-destructive/90 to-destructive/70 border border-destructive shadow-sm shadow-destructive/20"></div>
        <span className="text-xs text-muted-foreground">High Loss</span>
      </div>
    </div>
  );
};
