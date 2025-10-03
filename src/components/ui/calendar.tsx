
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: CalendarProps) {
  const calendarRef = React.useRef<HTMLDivElement>(null);
  
  return (
    <div 
      ref={calendarRef} 
      className="calendar-container pointer-events-auto relative"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="rdp-wrapper pointer-events-auto relative">
        <DayPicker
          showOutsideDays={showOutsideDays}
          className={cn("p-3 pointer-events-auto", className)}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "hidden", // Hide the entire caption section
            caption_label: "hidden", // Hide the caption label
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "h-9 w-9 bg-primary/5 hover:bg-primary/20 p-0 opacity-80 hover:opacity-100 transition-all rounded-full pointer-events-auto cursor-pointer shadow-sm"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-muted-foreground rounded-md w-12 font-medium text-[0.9rem] py-2",
            row: "flex w-full mt-1.5 gap-1.5", 
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/30 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
            day: cn(
              "h-11 w-11 p-0 font-normal aria-selected:opacity-100 rounded-lg transition-all hover:scale-110 hover:bg-accent hover:text-accent-foreground pointer-events-auto cursor-pointer flex items-center justify-center"
            ),
            ...classNames,
          }}
          components={{
            ...components,
            // Always override Caption and CaptionLabel to render nothing
            Caption: () => null,
            CaptionLabel: () => null,
          }}
          {...props}
        />
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
