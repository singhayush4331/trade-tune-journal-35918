
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Grid3X3 } from 'lucide-react';

interface CalendarViewSelectorProps {
  currentView: 'monthly' | 'yearly';
  onViewChange: (view: 'monthly' | 'yearly') => void;
}

const CalendarViewSelector: React.FC<CalendarViewSelectorProps> = ({
  currentView,
  onViewChange
}) => {
  return (
    <Tabs 
      value={currentView} 
      onValueChange={(value) => onViewChange(value as 'monthly' | 'yearly')}
      className="w-[240px]"
    >
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="monthly" className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          <span>Monthly</span>
        </TabsTrigger>
        <TabsTrigger value="yearly" className="flex items-center gap-1">
          <Grid3X3 className="h-4 w-4" />
          <span>Yearly</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CalendarViewSelector;
