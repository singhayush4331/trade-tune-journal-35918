
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { CalendarClock, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import DayDetailDialog from '@/components/calendar/DayDetailDialog';
import { ModernCalendarView } from '@/components/calendar/views/ModernCalendarView';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Animation variants for better performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const CalendarViewPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tradeDays, setTradeDays] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [calendarMode, setCalendarMode] = useState<'modern' | 'classic'>('modern');
  const [showInfo, setShowInfo] = useState(false);

  // Load user data once on mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('user_data');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  // Memoize handlers
  const handleDayClick = useCallback((day: Date, dayTrades: any[] = []) => {
    console.log('Day clicked in CalendarViewPage:', day);
    console.log('Trades for clicked day:', dayTrades);
    setSelectedDate(day);
    setTradeDays(dayTrades);
    setIsDialogOpen(true);
  }, []);

  const toggleInfo = useCallback(() => {
    setShowInfo(prev => !prev);
  }, []);

  // Memoize the calendar view for better performance
  const calendarView = useMemo(() => (
    <ModernCalendarView onDayClick={handleDayClick} />
  ), [handleDayClick]);

  // Memoize the info panel content
  const infoPanel = useMemo(() => (
    <AnimatePresence>
      {showInfo && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 bg-background/40 backdrop-blur-sm rounded-lg p-4 border border-border/50"
        >
          <h3 className="text-sm font-medium mb-2">Calendar Tips:</h3>
          <ul className="text-sm text-muted-foreground space-y-1 ml-5 list-disc">
            <li>Days are color-coded based on your profit/loss amounts</li>
            <li>Click on any day to view detailed trade information</li>
            <li>Use the navigation controls to move between months</li>
            <li>The three-month view helps you identify trading patterns</li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  ), [showInfo]);

  return (
    <AppLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 mt-2"
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 shadow-md border border-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <CalendarClock className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {userData?.name ? `${userData.name}'s Calendar` : 'Trading Calendar'}
                </h1>
              </div>
              
              <p className="text-muted-foreground max-w-xl">
                Track your trading activity, analyze patterns, and gain insights into your performance over time. 
                Click on any day to see detailed trade information.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary font-medium px-3 py-1">
                <CalendarIcon className="mr-1 h-3 w-3" />
                Trading Calendar
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-background/80 backdrop-blur-sm"
                onClick={toggleInfo}
              >
                Tips & Info
                <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", showInfo && "rotate-180")} />
              </Button>
            </div>
          </div>
          
          {infoPanel}
        </div>
        
        <Card className="border border-border/40 shadow-md overflow-hidden rounded-xl bg-card">
          <CardContent className="p-0">
            {calendarView}
          </CardContent>
        </Card>
        
        <DayDetailDialog 
          isOpen={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          selectedDate={selectedDate} 
          tradeDays={tradeDays} 
        />
      </motion.div>
    </AppLayout>
  );
};

export default React.memo(CalendarViewPage);
