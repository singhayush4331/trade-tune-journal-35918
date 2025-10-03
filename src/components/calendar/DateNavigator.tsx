
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, addYears, subYears, format } from 'date-fns';

interface DateNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  view: 'monthly' | 'yearly';
}

const DateNavigator: React.FC<DateNavigatorProps> = ({
  currentDate,
  onDateChange,
  view
}) => {
  const handlePrevious = () => {
    if (view === 'monthly') {
      onDateChange(subMonths(currentDate, 1));
    } else {
      onDateChange(subYears(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'monthly') {
      onDateChange(addMonths(currentDate, 1));
    } else {
      onDateChange(addYears(currentDate, 1));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePrevious}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="px-2 min-w-[120px] text-center">
        {view === 'monthly' ? format(currentDate, 'MMMM yyyy') : format(currentDate, 'yyyy')}
      </div>
      
      <Button variant="outline" size="icon" onClick={handleNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DateNavigator;
