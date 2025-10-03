import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { fetchUserTrades } from '@/services/trades-service';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Image, Calendar, TrendingUp, TrendingDown, X } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { formatIndianCurrency } from '@/lib/utils';

const GalleryPage: React.FC = () => {
  const [trades, setTrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadTrades = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await fetchUserTrades();
        
        if (error) {
          console.error('Error fetching trades:', error);
          toast({
            title: "Error loading trades",
            description: "Could not fetch your trade screenshots",
            variant: "destructive"
          });
          return;
        }
        
        const tradesWithScreenshots = data?.filter(
          trade => trade.screenshots && trade.screenshots.length > 0
        ) || [];
        
        setTrades(tradesWithScreenshots);
      } catch (err) {
        console.error('Error loading trade data:', err);
        toast({
          title: "Error loading trades",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrades();
    
    const handleTradeUpdate = () => {
      console.log('Trade data updated, reloading gallery');
      loadTrades();
    };
    
    window.addEventListener('tradeDataUpdated', handleTradeUpdate);
    
    return () => {
      window.removeEventListener('tradeDataUpdated', handleTradeUpdate);
    };
  }, [toast]);

  const getTradeScreenshotPairs = () => {
    return trades.map(trade => {
      const { id, symbol, pnl, date, screenshots = [], entry_time, exit_time } = trade;
      
      const entryScreenshot = screenshots.length > 0 ? screenshots[0] : null;
      const exitScreenshot = screenshots.length > 1 ? screenshots[1] : null;
      
      return {
        id,
        symbol,
        pnl: pnl || 0,
        date: new Date(date),
        entryScreenshot,
        exitScreenshot,
        entryTime: entry_time ? new Date(entry_time) : undefined,
        exitTime: exit_time ? new Date(exit_time) : undefined
      };
    }).filter(trade => trade.entryScreenshot || trade.exitScreenshot);
  };

  const tradeScreenshotPairs = getTradeScreenshotPairs();

  const openImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Trade Screenshots Gallery
          </h1>
          <p className="text-muted-foreground">
            Review your trade entry and exit screenshot pairs to improve your trading performance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {tradeScreenshotPairs.length} trades with screenshots
          </Badge>
        </div>
        
        <Separator className="my-6" />
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-5 w-1/3 mb-2" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="w-full aspect-video rounded-md mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-1" />
                    </div>
                    <div>
                      <Skeleton className="w-full aspect-video rounded-md mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : tradeScreenshotPairs.length === 0 ? (
          <div className="text-center py-12">
            <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No screenshots found</h3>
            <p className="text-muted-foreground mb-6">
              Add screenshots to your trades to see them here
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/tradeform'}>
              Log a Trade with Screenshots
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tradeScreenshotPairs.map((trade) => (
              <Card key={trade.id} className="overflow-hidden hover:shadow-lg transition-all border border-border/60 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2.5 rounded-full">
                        {trade.pnl >= 0 ? 
                          <TrendingUp className="h-5 w-5 text-green-500" /> : 
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div>
                        <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                          {trade.symbol}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(trade.date)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={trade.pnl >= 0 ? 'success' : 'destructive'} 
                      className={`text-sm font-bold px-3 py-1 ${trade.pnl >= 0 ? 'shadow-sm shadow-green-500/20' : 'shadow-sm shadow-red-500/20'} flex items-center gap-1`}
                    >
                      <IndianRupee className="h-3.5 w-3.5" />
                      {formatIndianCurrency(trade.pnl).replace('₹', '')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trade.entryScreenshot ? (
                      <div className="relative group">
                        <div className="absolute top-2 left-2 z-10">
                          <Badge variant="outline" className="bg-background/60 backdrop-blur-sm border-primary/30">Entry</Badge>
                        </div>
                        <Card 
                          className="overflow-hidden border border-border/40 group-hover:border-primary/40 transition-all cursor-pointer"
                          onClick={() => openImagePreview(trade.entryScreenshot)}
                        >
                          <CardContent className="p-0">
                            <div className="aspect-video relative">
                              <img 
                                src={trade.entryScreenshot} 
                                alt={`Entry screenshot for ${trade.symbol}`}
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        {trade.entryTime && (
                          <p className="text-xs text-muted-foreground mt-1 bg-background/40 backdrop-blur-sm w-fit px-2 py-0.5 rounded-full">
                            {trade.entryTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted/20 rounded-md border border-dashed border-muted">
                        <p className="text-sm text-muted-foreground">No entry screenshot</p>
                      </div>
                    )}

                    {trade.exitScreenshot ? (
                      <div className="relative group">
                        <div className="absolute top-2 left-2 z-10">
                          <Badge 
                            variant={trade.pnl >= 0 ? 'success' : 'destructive'} 
                            className="bg-background/60 backdrop-blur-sm"
                          >
                            Exit
                          </Badge>
                        </div>
                        <Card 
                          className="overflow-hidden border border-border/40 group-hover:border-primary/40 transition-all cursor-pointer"
                          onClick={() => openImagePreview(trade.exitScreenshot)}
                        >
                          <CardContent className="p-0">
                            <div className="aspect-video relative">
                              <img 
                                src={trade.exitScreenshot} 
                                alt={`Exit screenshot for ${trade.symbol}`}
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        {trade.exitTime && (
                          <p className="text-xs text-muted-foreground mt-1 bg-background/40 backdrop-blur-sm w-fit px-2 py-0.5 rounded-full">
                            {trade.exitTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted/20 rounded-md border border-dashed border-muted">
                        <p className="text-sm text-muted-foreground">No exit screenshot</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-5xl p-0 bg-background/95 backdrop-blur-md" closeButton={false}>
            {selectedImage && (
              <div className="relative">
                <div className="flex items-center justify-between p-4 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent">
                  <div className="text-white font-medium">
                    Trade Screenshot
                  </div>
                  <DialogClose asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/20" 
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogClose>
                </div>
                
                <div className="flex items-center justify-center min-h-[70vh]">
                  <img 
                    src={selectedImage}
                    alt="Trade screenshot"
                    className="max-w-full max-h-[90vh] object-contain"
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default GalleryPage;
