
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DayProps } from 'react-day-picker';

interface CustomDayComponentProps {
  date?: Date;
  className?: string;
  getDayClassName: (date: Date) => string;
  onClick: (date: Date) => void;
}

const CustomDayComponent = React.memo(({ 
  date, 
  className, 
  getDayClassName, 
  onClick,
  ...props 
}: CustomDayComponentProps & Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'>) => {
  if (!date) return <button {...props}>--</button>;
  
  const customClassName = getDayClassName(date);
  const dayNumber = date.getDate();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(date);
  };
  
  return (
    <button 
      {...props} 
      className={cn(
        className || "", 
        "flex items-center justify-center p-0 h-9 w-9",
        customClassName ? "" : "min-w-8 min-h-8 w-8 h-8 rounded-lg hover:bg-muted/30 hover:scale-105 transition-all mx-auto"
      )}
      onClick={handleClick}
    >
      {customClassName ? (
        <div className={cn(customClassName)}>
          {dayNumber}
        </div>
      ) : dayNumber}
    </button>
  );
});

CustomDayComponent.displayName = "CustomDayComponent";

export default CustomDayComponent;
