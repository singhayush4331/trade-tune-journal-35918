
import React, { useCallback, useMemo } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { useMonthData } from '@/hooks/calendar/useMonthData';
import DayDetailDialog from '../DayDetailDialog';
import { toast } from 'sonner';
import MonthCalendarCard from '../MonthCalendarCard';
import CustomDayComponent from '../CustomDayComponent';
import { DayProps } from 'react-day-picker';

interface MonthlyViewProps {
  tradeDays?: any[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDayClick?: (day: Date) => void;
  className?: string;
  isLoading?: boolean;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({
  tradeDays = [],
  currentDate,
  onDateChange,
  onDayClick,
  className
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  // Memoize month calculations
  const prevMonth = useMemo(() => subMonths(currentDate, 1), [currentDate]);
  const nextMonth = useMemo(() => addMonths(currentDate, 1), [currentDate]);
  
  // Extract month data with custom hook
  const { 
    monthStats: prevMonthStats, 
    modifiers: prevModifiers, 
    getDayClassName: getPrevDayClassName 
  } = useMonthData(prevMonth, tradeDays);
  
  const { 
    monthStats: currentMonthStats, 
    modifiers: currentModifiers, 
    getDayClassName: getCurrentDayClassName 
  } = useMonthData(currentDate, tradeDays);
  
  const { 
    monthStats: nextMonthStats, 
    modifiers: nextModifiers, 
    getDayClassName: getNextDayClassName 
  } = useMonthData(nextMonth, tradeDays);
  
  // Handler for day clicks
  const handleDayClick = useCallback((day: Date) => {
    console.log('Day clicked in MonthlyView:', day);
    setSelectedDate(day);
    setIsDialogOpen(true);
    toast.info(`Selected ${format(day, 'MMMM d, yyyy')}`);
    
    if (onDayClick) {
      onDayClick(day);
    }
  }, [onDayClick]);
  
  // Create memoized day components for each month
  const PrevMonthDayComponent = useCallback((props: DayProps) => (
    <CustomDayComponent 
      {...props} 
      getDayClassName={getPrevDayClassName} 
      onClick={handleDayClick}
    />
  ), [getPrevDayClassName, handleDayClick]);
  
  const CurrentMonthDayComponent = useCallback((props: DayProps) => (
    <CustomDayComponent 
      {...props} 
      getDayClassName={getCurrentDayClassName} 
      onClick={handleDayClick}
    />
  ), [getCurrentDayClassName, handleDayClick]);
  
  const NextMonthDayComponent = useCallback((props: DayProps) => (
    <CustomDayComponent 
      {...props} 
      getDayClassName={getNextDayClassName} 
      onClick={handleDayClick}
    />
  ), [getNextDayClassName, handleDayClick]);
  
  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MonthCalendarCard 
          month={prevMonth}
          modifiers={prevModifiers}
          monthStats={prevMonthStats}
          dayComponent={PrevMonthDayComponent}
        />
        
        <MonthCalendarCard 
          month={currentDate}
          modifiers={currentModifiers}
          monthStats={currentMonthStats}
          dayComponent={CurrentMonthDayComponent}
          isPrimary
        />
        
        <MonthCalendarCard 
          month={nextMonth}
          modifiers={nextModifiers}
          monthStats={nextMonthStats}
          dayComponent={NextMonthDayComponent}
        />
      </div>
      
      <DayDetailDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        selectedDate={selectedDate}
        tradeDays={tradeDays} 
      />
    </div>
  );
};

export default React.memo(MonthlyView);
