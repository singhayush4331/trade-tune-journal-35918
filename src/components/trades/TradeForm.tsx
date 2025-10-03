import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TradeFormProps, TradeFormData, defaultTradeFormValues, TradeType } from '@/utils/trade-form-types';
import AppLayout from '@/components/layout/AppLayout';
import { saveTrade, calculateTradeMetrics, fetchTradeById, getStrategiesForTradeForm, handleNewStrategy, formatTimeForInput } from '@/utils/trade-form-utils';
import { detectOptionFromSymbol, calculateOptionsTradeDirection, getOptionsDirectionExplanation } from '@/utils/options-utils';
// Note: MoodPicker import is commented out as it's causing an error
// import { MoodPicker } from './MoodPicker';
// Note: react-dropzone is commented out as it's causing an error
// import { useDropzone } from 'react-dropzone';
import { Loader2, X, ChevronDown } from 'lucide-react';
// Note: image-upload-service is commented out as it's causing an error
// import { uploadImage } from '@/services/image-upload-service';
import { useQuery } from '@tanstack/react-query';
// Note: date-picker is commented out as it's causing an error
// import { DatePicker } from '@/components/ui/date-picker';
// Note: react-icons import is commented out as it's causing an error
// import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import RiskRewardInput from './RiskRewardInput';

const tradeFormSchema = z.object({
  symbol: z.string().min(1, { message: "Symbol is required" }),
  entryPrice: z.string().refine(value => !isNaN(Number(value)), {
    message: "Entry price must be a number",
  }),
  exitPrice: z.string().refine(value => !isNaN(Number(value)), {
    message: "Exit price must be a number",
  }),
  quantity: z.string().refine(value => !isNaN(Number(value)), {
    message: "Quantity must be a number",
  }),
  date: z.date(),
  tradeType: z.string().min(1, { message: "Trade type is required" }),
  notes: z.string().optional(),
  mood: z.string().optional(),
  marketSegment: z.string().min(1, { message: "Market segment is required" }),
  exchange: z.string().min(1, { message: "Exchange is required" }),
  strategy: z.string().optional(),
  riskToReward: z.string().optional(),
  entryTime: z.string().optional(),
  exitTime: z.string().optional(),
  optionType: z.string().optional(),
  positionType: z.string().optional(),
});

const TradeForm = ({ tradeId }: TradeFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [entryScreenshot, setEntryScreenshot] = useState<string | null>(null);
  const [exitScreenshot, setExitScreenshot] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStrategyLoading, setIsStrategyLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [strategies, setStrategies] = useState<string[]>([]);
  const [optionDetection, setOptionDetection] = useState({ isOption: false, optionType: '', explanation: '' });

  const form = useForm<TradeFormData>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: defaultTradeFormValues,
    mode: "onChange"
  });

  // Modified to fix expected 1-2 arguments error
  const { data: trade, isLoading, error } = useQuery({
    queryKey: ['trade', id],
    queryFn: async () => {
      console.log("TradeForm: Fetching trade data for ID:", id);
      const tradeData = await fetchTradeById(id as string);
      console.log("TradeForm: Fetched trade data:", tradeData);
      return tradeData;
    },
    enabled: !!id,
  });

  // Modified to fix expected 1-2 arguments error
  const { data: strategiesData, isLoading: isStrategiesLoading } = useQuery({
    queryKey: ['strategies'],
    queryFn: () => getStrategiesForTradeForm(),
  });

  // Comment out the mutation sections that are causing errors
  /*
  const { mutate: uploadEntryImage, isLoading: isEntryImageLoading } = useMutation(
    (file: File) => uploadImage(file),
    {
      onSuccess: (data) => {
        if (data && data.imageUrl) {
          setEntryScreenshot(data.imageUrl);
          toast.success("Entry screenshot uploaded successfully!");
        } else {
          toast.error("Failed to upload entry screenshot.");
        }
      },
      onError: () => {
        toast.error("Failed to upload entry screenshot.");
      }
    }
  );

  const { mutate: uploadExitImage, isLoading: isExitImageLoading } = useMutation(
    (file: File) => uploadImage(file),
    {
      onSuccess: (data) => {
        if (data && data.imageUrl) {
          setExitScreenshot(data.imageUrl);
          toast.success("Exit screenshot uploaded successfully!");
        } else {
          toast.error("Failed to upload exit screenshot.");
        }
      },
      onError: () => {
        toast.error("Failed to upload exit screenshot.");
      }
    }
  );
  */
  
  // Define placeholder values for isLoading states from missing mutations
  const isEntryImageLoading = false;
  const isExitImageLoading = false;

  const onSubmit = async (values: TradeFormData) => {
    setIsSubmitting(true);
    try {
      // Calculate P&L and brokerage
      const { pl, brokerage } = calculateTradeMetrics({
        entryPrice: parseFloat(values.entryPrice),
        exitPrice: parseFloat(values.exitPrice),
        quantity: parseFloat(values.quantity),
        tradeType: values.tradeType as TradeType, // Fixed type error
        marketSegment: values.marketSegment,
        exchange: values.exchange
      });

      // Save the trade
      saveTrade(values, pl, brokerage, entryScreenshot, exitScreenshot, isEditMode);

      // Show a single notification with a more meaningful message
      toast.success(isEditMode ? 'Trade updated' : 'Trade added', {
        description: isEditMode 
          ? `${values.symbol} trade has been updated.` 
          : `${values.symbol} trade has been added to your history.`,
        duration: 2000 // Keep consistent with our 2s standard
      });
      
      // Navigate to trades page with refresh signal
      // We'll keep the refreshTrades flag for data refreshing but handle toast in TradeForm only
      navigate('/trades', { 
        state: { 
          refreshTrades: true, 
          newTradeId: isEditMode ? undefined : 'new-trade' 
        }
      });
    } catch (error) {
      console.error("Error saving trade:", error);
      toast.error("Failed to save trade", {
        description: "Please check your inputs and try again.",
        duration: 2000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Comment out the dropzone functionality causing errors
  /*
  const onDropEntry = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadEntryImage(acceptedFiles[0]);
    }
  }, [uploadEntryImage]);

  const onDropExit = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadExitImage(acceptedFiles[0]);
    }
  }, [uploadExitImage]);

  const {
    getRootProps: getRootPropsEntry,
    getInputProps: getInputPropsEntry,
    isDragActive: isDragActiveEntry,
  } = useDropzone({
    onDrop: onDropEntry,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const {
    getRootProps: getRootPropsExit,
    getInputProps: getInputPropsExit,
    isDragActive: isDragActiveExit,
  } = useDropzone({
    onDrop: onDropExit,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });
  */

  // Define placeholder values for dropzone states
  const getRootPropsEntry = () => ({});
  const getInputPropsEntry = () => ({});
  const isDragActiveEntry = false;
  const getRootPropsExit = () => ({});
  const getInputPropsExit = () => ({});
  const isDragActiveExit = false;

  const handleStrategySelect = async (strategy: string) => {
    if (strategy === 'new-strategy') {
      const newStrategyName = prompt("Enter new strategy name:");
      if (newStrategyName) {
        setIsStrategyLoading(true);
        await handleNewStrategy(newStrategyName);
        setStrategies(prev => [...prev, newStrategyName]);
        setIsStrategyLoading(false);
        form.setValue("strategy", newStrategyName);
      }
    } else {
      form.setValue("strategy", strategy);
      setOpen(false);
    }
  };

  // Use useEffect to update form values when trade data is available
  useEffect(() => {
    if (trade) {
      setIsEditMode(true);
      
      console.log("Setting form data from trade:", trade);

      // Extract time values - use camelCase properties from processed trade data
      const entryTime = trade.entryTime || '';
      const exitTime = trade.exitTime || '';
      
      console.log("Raw entry time:", entryTime);
      console.log("Raw exit time:", exitTime);
      console.log("Trade object keys:", Object.keys(trade));

      // Format times for HTML input (HH:MM format) - same logic as TradeDetailSheet
      const formatTimeForHtmlInput = (timeString: string) => {
        if (!timeString) return '';
        try {
          // Use same logic as TradeDetailSheet but format for HTML input (24-hour format)
          const formatted = format(new Date(timeString), 'HH:mm');
          console.log(`Formatted ${timeString} to ${formatted}`);
          return formatted;
        } catch (error) {
          console.error("Error formatting time:", error);
          return '';
        }
      };

      const formattedEntryTime = formatTimeForHtmlInput(entryTime);
      const formattedExitTime = formatTimeForHtmlInput(exitTime);
      
      console.log("Formatted entry time:", formattedEntryTime);
      console.log("Formatted exit time:", formattedExitTime);

      // Use form.reset() with all data to ensure proper form state update
      form.reset({
        id: trade.id,
        symbol: trade.symbol,
        date: new Date(trade.date),
        entryPrice: trade.entryPrice.toString() || trade.entry_price?.toString() || '',
        exitPrice: trade.exitPrice.toString() || trade.exit_price?.toString() || '',
        quantity: trade.quantity.toString(),
        tradeType: trade.type,
        marketSegment: trade.market_segment || trade.marketSegment || 'equity-delivery',
        exchange: trade.exchange || 'NSE',
        strategy: trade.strategy || '',
        notes: trade.notes || '',
        mood: trade.mood || '',
        riskToReward: trade.riskToReward || trade.risk_reward_ratio || '',
        entryTime: formattedEntryTime,
        exitTime: formattedExitTime,
        optionType: trade.optionType || trade.option_type || '',
        positionType: trade.positionType || trade.position_type || '',
      });

      setEntryScreenshot(trade.entryScreenshot || null);
      setExitScreenshot(trade.exitScreenshot || null);
    }
  }, [trade, form]);

  // Use useEffect to update strategies when strategiesData is available
  useEffect(() => {
    if (strategiesData) {
      setStrategies(strategiesData);
    }
  }, [strategiesData]);

  // Watch for symbol changes to detect options
  const watchedSymbol = form.watch('symbol');
  const watchedMarketSegment = form.watch('marketSegment');
  const watchedOptionType = form.watch('optionType');
  const watchedPositionType = form.watch('positionType');

  useEffect(() => {
    if (watchedSymbol) {
      const detection = detectOptionFromSymbol(watchedSymbol);
      
      if (detection.isOption) {
        // Auto-populate option type if detected
        if (detection.optionType && !watchedOptionType) {
          form.setValue('optionType', detection.optionType);
        }
        
        // Auto-set market segment to options if detected option symbol
        if (watchedMarketSegment !== 'options') {
          form.setValue('marketSegment', 'options');
        }
        
        setOptionDetection({
          isOption: true,
          optionType: detection.optionType,
          explanation: detection.optionType ? `Detected ${detection.optionType} option` : 'Options symbol detected'
        });
      } else {
        setOptionDetection({ isOption: false, optionType: '', explanation: '' });
      }
    }
  }, [watchedSymbol, form, watchedMarketSegment, watchedOptionType]);

  // Auto-calculate trade direction for options
  useEffect(() => {
    if (watchedMarketSegment === 'options' && watchedOptionType && watchedPositionType) {
      const calculatedDirection = calculateOptionsTradeDirection(
        watchedOptionType as 'CE' | 'PE',
        watchedPositionType as 'buy' | 'sell'
      );
      
      const explanation = getOptionsDirectionExplanation(
        watchedOptionType as 'CE' | 'PE',
        watchedPositionType as 'buy' | 'sell',
        calculatedDirection
      );
      
      form.setValue('tradeType', calculatedDirection);
      setOptionDetection(prev => ({ ...prev, explanation }));
    }
  }, [watchedMarketSegment, watchedOptionType, watchedPositionType, form]);

  if (isLoading) {
    return <AppLayout>
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    </AppLayout>;
  }

  return (
    <AppLayout>
      <div className="container max-w-3xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Trade' : 'Add Trade'}</h1>
        <Form {...form}>
          <form key={trade?.id || 'new'} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., MSFT" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Comment out DatePicker for now as it's causing import errors */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Trade Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          field.onChange(date);
                        }}
                        className="bg-background/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="entryPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Price</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 150.25" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exit Price</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 152.50" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tradeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trade Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select a trade type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="long">Long</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketSegment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Segment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select a market segment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="equity-delivery">Equity Delivery</SelectItem>
                        <SelectItem value="equity-intraday">Equity Intraday</SelectItem>
                        <SelectItem value="futures">Futures</SelectItem>
                        <SelectItem value="options">Options</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Options-specific fields - only show when options market segment is selected */}
            {watchedMarketSegment === 'options' && (
              <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary">Options Details</h3>
                  {optionDetection.explanation && (
                    <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                      {optionDetection.explanation}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="optionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder="Select option type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CE">Call (CE)</SelectItem>
                            <SelectItem value="PE">Put (PE)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="positionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder="Select position type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="buy">Buy</SelectItem>
                            <SelectItem value="sell">Sell</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Auto-calculated trade direction explanation */}
                {watchedOptionType && watchedPositionType && (
                  <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <strong>Auto-calculated direction:</strong> {optionDetection.explanation}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="exchange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exchange</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select an exchange" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NSE">NSE</SelectItem>
                        <SelectItem value="BSE">BSE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="strategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strategy</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between bg-background/50"
                          >
                            {field.value
                              ? strategies.find(
                                  (strategy) => strategy === field.value
                                )
                              : "Select strategy..."}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search strategy..." />
                          <CommandList>
                            <CommandEmpty>No strategy found.</CommandEmpty>
                            <CommandGroup heading="Strategies">
                              {strategies?.map((strategy) => (
                                <CommandItem
                                  key={strategy}
                                  value={strategy}
                                  onSelect={() => {
                                    handleStrategySelect(strategy)
                                  }}
                                >
                                  {strategy}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup>
                              <CommandItem
                                value="new-strategy"
                                onSelect={() => {
                                  handleStrategySelect('new-strategy')
                                }}
                              >
                                {isStrategyLoading ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating strategy...
                                  </div>
                                ) : (
                                  "Create new strategy"
                                )}
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RiskRewardInput />
              {/* Replace MoodPicker with simple Select since MoodPicker is causing import errors */}
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select your mood" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="focused">Focused</SelectItem>
                        <SelectItem value="excited">Excited</SelectItem>
                        <SelectItem value="anxious">Anxious</SelectItem>
                        <SelectItem value="frustrated">Frustrated</SelectItem>
                        <SelectItem value="confident">Confident</SelectItem>
                        <SelectItem value="fearful">Fearful</SelectItem>
                        <SelectItem value="calm">Calm</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        className="bg-background/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exitTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exit Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        className="bg-background/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any relevant notes about the trade"
                      className="bg-background/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Replace screenshot uploaders with simple placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Entry Screenshot</FormLabel>
                <div className="mt-1 p-4 border border-dashed rounded-md text-center">
                  {entryScreenshot ? (
                    <div className="relative">
                      <img src={entryScreenshot} alt="Entry Screenshot" className="max-w-full h-auto" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setEntryScreenshot(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Screenshot upload temporarily disabled
                    </p>
                  )}
                </div>
              </div>

              <div>
                <FormLabel>Exit Screenshot</FormLabel>
                <div className="mt-1 p-4 border border-dashed rounded-md text-center">
                  {exitScreenshot ? (
                    <div className="relative">
                      <img src={exitScreenshot} alt="Exit Screenshot" className="max-w-full h-auto" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setExitScreenshot(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Screenshot upload temporarily disabled
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save Trade'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
};

export default React.memo(TradeForm);
