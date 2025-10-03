
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format, subDays, startOfWeek, startOfMonth, startOfDay, endOfDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useIsMobile } from '@/hooks/use-mobile';

export type DateRangeOption = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';

interface DateRangeValue {
  range: DateRange | undefined;
  label: string;
}

interface DateRangeSelectorProps {
  onRangeChange: (range: DateRange | undefined, option: DateRangeOption) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ onRangeChange }) => {
  const today = new Date();
  const [selectedOption, setSelectedOption] = useState<DateRangeOption>('month');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>({
    from: subDays(today, 30),
    to: today
  });
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const isMobile = useIsMobile();

  const dateRanges: Record<DateRangeOption, DateRangeValue> = {
    today: {
      range: { 
        from: startOfDay(today), 
        to: endOfDay(today) 
      },
      label: 'Today'
    },
    week: {
      range: { from: startOfWeek(today, { weekStartsOn: 1 }), to: today },
      label: 'Week'
    },
    month: {
      range: { from: startOfMonth(today), to: today },
      label: 'Month'
    },
    year: {
      range: { from: new Date(today.getFullYear(), 0, 1), to: today },
      label: 'Year'
    },
    all: {
      range: undefined,
      label: 'All'
    },
    custom: {
      range: customDateRange,
      label: 'Custom'
    }
  };

  const handleOptionChange = (option: DateRangeOption) => {
    setSelectedOption(option);
    
    if (option === 'custom') {
      setIsCalendarOpen(true);
      onRangeChange(customDateRange, option);
    } else {
      onRangeChange(dateRanges[option].range, option);
    }
  };

  const handleCustomRangeChange = (range: DateRange | undefined) => {
    setCustomDateRange(range);
    if (range?.from && range?.to) {
      onRangeChange(range, 'custom');
    }
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className={cn(
        "flex items-center",
        isMobile ? "justify-between gap-1" : "justify-start gap-0"
      )}>
        <Tabs 
          value={selectedOption} 
          onValueChange={(value) => handleOptionChange(value as DateRangeOption)} 
          className={cn(
            "w-full",
            !isMobile && "max-w-fit"
          )}
        >
          <TabsList className={cn(
            "bg-muted/80 backdrop-blur h-auto",
            isMobile 
              ? "p-0.5 grid grid-cols-5 gap-0.5 w-full" 
              : "p-1 flex flex-row justify-start"
          )}>
            {Object.keys(dateRanges).map((option) => 
              option !== 'custom' ? (
                <TabsTrigger
                  key={option}
                  value={option}
                  className={cn(
                    "text-[10px] xxs:text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/60 data-[state=active]:to-primary data-[state=active]:text-primary-foreground rounded",
                    isMobile ? "py-1 px-0.5" : "py-1.5 px-3 sm:px-4", 
                    selectedOption === option ? "data-[state=active]:bg-gradient-to-r" : ""
                  )}
                >
                  {dateRanges[option as DateRangeOption].label}
                </TabsTrigger>
              ) : null
            )}
          </TabsList>
        </Tabs>
      
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={selectedOption === 'custom' ? "default" : "outline"}
              size="icon"
              className={cn(
                "flex-shrink-0 bg-muted/80 hover:bg-primary/80",
                selectedOption === 'custom' ? "bg-primary text-primary-foreground" : "",
                isMobile ? "w-7 h-7 sm:w-8 sm:h-8 ml-1" : "w-9 h-9 ml-1"
              )}
              onClick={() => handleOptionChange('custom')}
            >
              <CalendarIcon className={cn(isMobile ? "h-3 w-3 sm:h-3.5 sm:w-3.5" : "h-4 w-4")} />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0" 
            align="end"
            side={isMobile ? "bottom" : "right"}
            sideOffset={isMobile ? 8 : 4}
          >
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={customDateRange?.from}
              selected={customDateRange}
              onSelect={handleCustomRangeChange}
              numberOfMonths={isMobile ? 1 : 1}
              disabled={(date) => date > today}
              className={cn("p-2 sm:p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangeSelector;
