import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { calculateTradeMetrics, fetchTradeById } from '@/utils/trade-form-utils';
import { TradeType } from '@/utils/trade-form-types';
import { TradeResultCard } from '@/components/trade-form/TradeResultCard';
import TradeFormFields from '@/components/trade-form/TradeFormFields';
import { MoodSelector } from '@/components/trade-form/MoodSelector';
import { ScreenshotUploader } from '@/components/trade-form/ScreenshotUploader';
import { OrderBookUploader } from '@/components/trade-form/OrderBookUploader';
import { ExtractedTradesReview } from '@/components/trade-form/ExtractedTradesReview';
import TradePsychologyCard from '@/components/trade-form/TradePsychologyCard';
import CollapsibleTradeSection from '@/components/trade-form/CollapsibleTradeSection';
import { DefaultOverviewPanel } from '@/components/trade-form/DefaultOverviewPanel';
import AppLayout from '@/components/layout/AppLayout';
import IndianStockSearch from '@/components/trades/IndianStockSearch';
import { format } from 'date-fns';
import { fetchPlaybookStrategies } from '@/utils/playbook-utils';
import { Calendar as CalendarIcon, TrendingUp, TrendingDown, IndianRupee, BarChart2, BookOpen, FileCheck, AlertCircle, Image, BarChart4, Clock, Save, ArrowLeft, Ratio } from 'lucide-react';
import { Mood, TradeFormProps } from '@/utils/trade-form-types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { createTrade, updateTrade } from '@/services/trades-service';
import { useIsMobile, useIsSmall, useIsXSmall } from '@/hooks/use-mobile';
import { detectOptionFromSymbol, calculateOptionsTradeDirection } from '@/utils/options-utils';
import { calculateChronologicalPnL } from '@/utils/trade-pnl-calculator';
const TradeForm: React.FC<TradeFormProps> = ({
  tradeId
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isSmall = useIsSmall();
  const isXSmall = useIsXSmall();
  const [strategies, setStrategies] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [extractedTrades, setExtractedTrades] = useState<any[]>([]);
  const [showExtractedTrades, setShowExtractedTrades] = useState(false);
  const [tradeStates, setTradeStates] = useState<Record<number, { status: 'accepted' | 'rejected' | 'pending'; isVisible: boolean }>>({});
  const [currentMode, setCurrentMode] = useState<'single' | 'multiple'>('single');
  const [tradePsychologyData, setTradePsychologyData] = useState<Record<number, {
    mood?: string;
    strategy?: string;
  }>>({});
  const [openTrades, setOpenTrades] = useState<Set<number>>(new Set());
  const [activeFocusedTrade, setActiveFocusedTrade] = useState<number | null>(null);
  const [tradeFormData, setTradeFormData] = useState<Record<number, any>>({});
  const tradeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Enhanced state management for multi-trade tracking
  const [savedTrades, setSavedTrades] = useState<Set<number>>(new Set());
  const [savingTrades, setSavingTrades] = useState<Set<number>>(new Set());
  const [failedTrades, setFailedTrades] = useState<Set<number>>(new Set());
  const [allTradesProcessed, setAllTradesProcessed] = useState(false);
  console.log("TradeForm: Current ID parameter:", tradeId);
  const [formData, setFormData] = useState({
    id: '',
    symbol: '',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    date: new Date(),
    tradeType: 'long' as TradeType,
    marketSegment: 'equity-delivery',
    exchange: 'NSE',
    strategy: '',
    notes: '',
    mood: 'focused' as Mood,
    entryScreenshot: null as string | null,
    exitScreenshot: null as string | null,
    createdAt: '',
    entryTime: '',
    exitTime: '',
    riskToReward: '',
    optionType: '' as 'CE' | 'PE' | '',
    positionType: '' as 'buy' | 'sell' | ''
  });
  useEffect(() => {
    const loadTradeData = async () => {
      if (tradeId) {
        setIsLoading(true);
        setIsEditMode(true);
        try {
          console.log("Loading trade data for ID:", tradeId);
          const trade = await fetchTradeById(tradeId);
          if (trade) {
            console.log("Trade data loaded successfully:", trade);
            setFormData({
              id: trade.id || '',
              symbol: trade.symbol || '',
              entryPrice: trade.entry_price?.toString() || trade.entryPrice?.toString() || '',
              exitPrice: trade.exit_price?.toString() || trade.exitPrice?.toString() || '',
              quantity: trade.quantity?.toString() || '',
              date: trade.date instanceof Date ? trade.date : new Date(trade.date),
              tradeType: trade.type as TradeType || 'long',
              marketSegment: trade.market_segment || trade.marketSegment || 'equity-delivery',
              exchange: trade.exchange || 'NSE',
              strategy: trade.strategy || '',
              notes: trade.notes || '',
              mood: trade.mood as Mood || 'focused',
              entryScreenshot: trade.entryScreenshot || (trade.screenshots && trade.screenshots.length > 0 ? trade.screenshots[0] : null),
              exitScreenshot: trade.exitScreenshot || (trade.screenshots && trade.screenshots.length > 1 ? trade.screenshots[1] : null),
              createdAt: trade.created_at || trade.createdAt || '',
              entryTime: trade.entry_time || trade.entryTime || '',
              exitTime: trade.exit_time || trade.exitTime || '',
              riskToReward: trade.riskToReward || '',
              optionType: trade.optionType || trade.option_type || '',
              positionType: trade.positionType || trade.position_type || ''
            });
            console.log("Form data set:", formData);
            setShowResults(true);
          } else {
            console.error("Trade not found");
            toast.error("Trade not found", {
              description: "The trade you're trying to edit couldn't be found."
            });
            setTimeout(() => navigate("/trades"), 1500);
          }
        } catch (error) {
          console.error("Error loading trade:", error);
          toast.error("Error loading trade data");
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadTradeData();
  }, [tradeId, navigate]);
  useEffect(() => {
    async function loadStrategies() {
      try {
        const loadedStrategies = await fetchPlaybookStrategies();
        setStrategies(loadedStrategies);
      } catch (error) {
        console.error("Error loading strategies:", error);
        setStrategies([]);
      }
    }
    loadStrategies();
  }, []);
  useEffect(() => {
    const entryPrice = parseFloat(formData.entryPrice);
    const exitPrice = parseFloat(formData.exitPrice);
    const quantity = parseInt(formData.quantity);
    if (entryPrice > 0 && exitPrice > 0 && quantity > 0) {
      setShowResults(true);
      setValidationError(null);
    } else {
      setShowResults(false);
    }
  }, [formData.entryPrice, formData.exitPrice, formData.quantity, formData.tradeType, formData.marketSegment, formData.exchange]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date
      }));
    }
  };
  const handleMoodChange = (mood: Mood) => {
    setFormData(prev => ({
      ...prev,
      mood
    }));
  };
  const handleSegmentChange = (segment: string) => {
    setFormData(prev => ({
      ...prev,
      marketSegment: segment
    }));
  };
  const handleTradeTypeChange = (type: TradeType) => {
    setFormData(prev => ({
      ...prev,
      tradeType: type
    }));
  };
  const handleTimeChange = (type: 'entry' | 'exit', value: string) => {
    if (type === 'entry') {
      setFormData(prev => ({
        ...prev,
        entryTime: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        exitTime: value
      }));
    }
  };
  const handleRiskRewardChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      riskToReward: value
    }));
  };
  const handlePsychologyChange = (tradeNumber: number, data: {
    mood?: string;
    strategy?: string;
  }) => {
    setTradePsychologyData(prev => ({
      ...prev,
      [tradeNumber]: {
        ...prev[tradeNumber],
        ...data
      }
    }));
  };
  const handleTradeToggle = (tradeNumber: number, isOpen: boolean) => {
    setOpenTrades(prev => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(tradeNumber);
        setActiveFocusedTrade(tradeNumber); // Set the focused trade when opened
      } else {
        newSet.delete(tradeNumber);
        // If the focused trade is being closed, find another open trade or clear focus
        if (activeFocusedTrade === tradeNumber) {
          const remainingOpenTrades = Array.from(newSet);
          setActiveFocusedTrade(remainingOpenTrades.length > 0 ? remainingOpenTrades[0] : null);
        }
      }
      return newSet;
    });
  };
  const validateForm = () => {
    if (!formData.symbol) {
      setValidationError("Please select a stock symbol");
      toast.error("Missing stock symbol");
      return false;
    }
    const entryPrice = parseFloat(formData.entryPrice);
    const exitPrice = parseFloat(formData.exitPrice);
    const quantity = parseInt(formData.quantity);
    if (isNaN(entryPrice) || entryPrice <= 0) {
      setValidationError("Please enter a valid entry price");
      toast.error("Invalid entry price");
      return false;
    }
    if (isNaN(exitPrice) || exitPrice <= 0) {
      setValidationError("Please enter a valid exit price");
      toast.error("Invalid exit price");
      return false;
    }
    if (isNaN(quantity) || quantity <= 0) {
      setValidationError("Please enter a valid quantity");
      toast.error("Invalid quantity");
      return false;
    }
    // Require option type when logging options trades
    if (formData.marketSegment === 'options' && !formData.optionType) {
      setValidationError("Please select option type (CE or PE)");
      toast.error("Select option type (CE/PE)");
      return false;
    }
    setValidationError(null);
    return true;
  };
  const handleTradesExtracted = (trades: any[], incompleteOrders: any[] = []) => {
    if (trades && trades.length > 0) {
      setExtractedTrades(trades);
      setShowExtractedTrades(true);
      
      // Initialize trade states
      const initialStates = trades.reduce((acc, _, index) => {
        acc[index] = { 
          status: 'pending',
          isVisible: true 
        };
      }, {} as Record<number, { status: 'accepted' | 'rejected' | 'pending'; isVisible: boolean }>);
      setTradeStates(initialStates);
      
      // Show information about incomplete orders if any
      if (incompleteOrders.length > 0) {
        console.log('Found incomplete orders:', incompleteOrders);
        toast.info(`Found ${incompleteOrders.length} incomplete order(s)`, {
          description: "These orders may need manual completion or were only partially filled."
        });
      }

      // Initialize form data for each trade
      const initialFormData: Record<number, any> = {};
      const initialPsychologyData: Record<number, {
        mood?: string;
        strategy?: string;
      }> = {};
      trades.forEach((trade, index) => {
        const tradeNumber = index + 1;
        
        // Apply options detection to each extracted trade
        const optionDetection = detectOptionFromSymbol(trade.symbol);
        let finalTradeType = trade.type || 'long';
        let finalMarketSegment = 'equity-delivery';
        let finalSymbol = trade.symbol || '';
        
        console.log('🔍 Processing extracted trade:', {
          originalSymbol: trade.symbol,
          optionDetection,
          positionType: trade.positionType,
          tradeType: trade.type,
          entryTime: trade.entryTime,
          exitTime: trade.exitTime
        });
        
        // Auto-configure options fields if detected
        if (optionDetection.isOption) {
          finalMarketSegment = 'options';
          
          // Use simplified underlying symbol instead of full contract
          if (optionDetection.underlyingSymbol) {
            finalSymbol = optionDetection.underlyingSymbol;
          }
          
          // Enhanced options direction calculation with fallback logic
          if (optionDetection.optionType) {
            let inferredPositionType = trade.positionType;
            
            // Infer position type if missing
            if (!inferredPositionType) {
              console.log('⚠️ positionType missing, attempting to infer from trade.type:', trade.type);
              
              // Map trade direction to position type
              if (trade.type === 'long') {
                inferredPositionType = 'buy';
                console.log('🔄 Mapped "long" → "buy"');
              } else if (trade.type === 'short') {
                inferredPositionType = 'sell';
                console.log('🔄 Mapped "short" → "sell"');
              } else if (trade.type === 'buy' || trade.type === 'sell') {
                // Direct position type mapping
                inferredPositionType = trade.type;
                console.log('🔄 Direct position type:', inferredPositionType);
              } else {
                // Default fallback - should rarely happen
                inferredPositionType = 'buy';
                console.log('🔄 Fallback to "buy" for unknown type:', trade.type);
              }
            }
            
            console.log('🎯 Calculating options direction:', {
              optionType: optionDetection.optionType,
              positionType: inferredPositionType,
              symbol: finalSymbol
            });
            
            finalTradeType = calculateOptionsTradeDirection(
              optionDetection.optionType as 'CE' | 'PE',
              inferredPositionType as 'buy' | 'sell'
            );
            
            console.log('✅ Options direction calculated:', {
              originalType: trade.type,
              calculatedDirection: finalTradeType,
              optionType: optionDetection.optionType,
              positionType: inferredPositionType
            });
            
            // Store the inferred position type for consistency
            trade.positionType = inferredPositionType;
          } else {
            console.log('⚠️ Options detected but no optionType available');
          }
        } else {
          console.log('📈 Non-options trade, using default type:', finalTradeType);
        }
        
        // Fix P&L calculation based on chronological order using the calculator
        let correctedEntryPrice = trade.entryPrice;
        let correctedExitPrice = trade.exitPrice;
        let correctedPnL = trade.pnl;
        
        // Use chronological P&L calculator for accurate results
        if (trade.entryTime && trade.exitTime) {
          console.log('🕐 Using chronological P&L calculation:', {
            entryPrice: trade.entryPrice,
            exitPrice: trade.exitPrice,
            quantity: trade.quantity,
            entryTime: trade.entryTime,
            exitTime: trade.exitTime,
            positionType: trade.positionType
          });
          
          // Use the chronological calculator which handles timing correctly
          const pnlResult = calculateChronologicalPnL(
            trade.entryPrice,
            trade.exitPrice,
            trade.quantity,
            trade.entryTime,
            trade.exitTime,
            trade.positionType as 'buy' | 'sell'
          );
          
          correctedEntryPrice = pnlResult.entryPrice;
          correctedExitPrice = pnlResult.exitPrice;
          correctedPnL = pnlResult.pnl;
          
          console.log('✅ Chronological P&L result:', {
            originalPnL: trade.pnl,
            correctedPnL,
            entryPrice: correctedEntryPrice,
            exitPrice: correctedExitPrice,
            isProfit: pnlResult.isProfit
          });
        }
        
        const formDataForTrade = {
          symbol: finalSymbol,
          entryPrice: correctedEntryPrice?.toString() || '',
          exitPrice: correctedExitPrice?.toString() || '',
          quantity: trade.quantity?.toString() || '',
          tradeType: finalTradeType,
          marketSegment: finalMarketSegment,
          exchange: 'NSE',
          entryTime: trade.entryTime || '',
          exitTime: trade.exitTime || '',
          // Add options-specific fields
          ...(optionDetection.isOption && {
            optionType: optionDetection.optionType,
            positionType: trade.positionType || '',
            strikePrice: optionDetection.strikePrice || ''
          })
        };
        
        console.log('💾 Storing in tradeFormData[' + tradeNumber + ']:', {
          tradeNumber,
          symbol: finalSymbol,
          tradeType: finalTradeType,
          marketSegment: finalMarketSegment,
          optionType: optionDetection.optionType,
          positionType: trade.positionType,
          fullFormData: formDataForTrade
        });
        
        initialFormData[tradeNumber] = formDataForTrade;

        // Initialize psychology data with default values
        initialPsychologyData[tradeNumber] = {
          mood: 'focused',
          strategy: ''
        };
      });
      setTradeFormData(initialFormData);
      setTradePsychologyData(initialPsychologyData);
    }
  };
  const handleAcceptTrade = (index: number) => {
    // Mark this specific trade as accepted
    setTradeStates(prev => ({
      ...prev,
      [index]: { status: 'accepted', isVisible: true }
    }));
    const acceptedTrades = Object.keys(tradeStates).filter(key => tradeStates[parseInt(key)]?.status === 'accepted' || parseInt(key) === index).length;

    // Check if this is the last pending trade
    const pendingTrades = Object.keys(tradeStates).filter(key => tradeStates[parseInt(key)]?.status === 'pending' && parseInt(key) !== index).length;
    if (pendingTrades === 0) {
      // No more pending trades, transition to multiple trades view
      setShowExtractedTrades(false);
      setCurrentMode('multiple');
    }
  };
  const handleEditTrade = (index: number) => {
    const trade = extractedTrades[index];
    const tradeNumber = index + 1;
    
    // Get the pre-calculated form data for this trade
    const preCalculatedData = tradeFormData[tradeNumber];
    
    console.log('🔍 Starting trade edit:', {
      index,
      tradeNumber,
      symbol: trade.symbol,
      positionType: trade.positionType,
      extractedType: trade.type,
      preCalculatedTradeType: preCalculatedData?.tradeType,
      preCalculatedData: preCalculatedData
    });
    
    if (!preCalculatedData) {
      console.error('❌ No pre-calculated data found for trade', tradeNumber);
      toast.error("Error loading trade data");
      return;
    }
    
    // Use the pre-calculated form data which already has the correct trade direction
    const newFormData = {
      ...formData,
      symbol: preCalculatedData.symbol,
      entryPrice: preCalculatedData.entryPrice,
      exitPrice: preCalculatedData.exitPrice,
      quantity: preCalculatedData.quantity,
      tradeType: preCalculatedData.tradeType, // This is the correctly calculated direction
      marketSegment: preCalculatedData.marketSegment,
      entryTime: preCalculatedData.entryTime,
      exitTime: preCalculatedData.exitTime,
      // Add options-specific fields if they exist
      ...(preCalculatedData.optionType && {
        optionType: preCalculatedData.optionType,
        positionType: preCalculatedData.positionType
      })
    };
    
    console.log('✅ Using pre-calculated form data:', {
      symbol: newFormData.symbol,
      tradeDirection: newFormData.tradeType,
      marketSegment: newFormData.marketSegment,
      optionType: newFormData.optionType,
      positionType: newFormData.positionType
    });
    
    setFormData(newFormData);
    setShowExtractedTrades(false);
    setCurrentMode('single');
    
    const isOptions = preCalculatedData.marketSegment === 'options';
    toast.success(`Trade data loaded for editing${isOptions ? ' - Options trade detected' : ''}`);
  };
  const handleRejectTrade = (index: number) => {
    // Mark this specific trade as rejected
    setTradeStates(prev => ({
      ...prev,
      [index]: { status: 'rejected', isVisible: true }
    }));

    // Check if this is the last pending trade
    const pendingTrades = Object.keys(tradeStates).filter(key => tradeStates[parseInt(key)]?.status === 'pending').length;
    if (pendingTrades === 0) {
      // No more pending trades, check if any accepted trades remain
      const acceptedTrades = Object.keys(tradeStates).filter(key => tradeStates[parseInt(key)]?.status === 'accepted').length;
      if (acceptedTrades > 0) {
        setShowExtractedTrades(false);
        setCurrentMode('multiple');
      } else {
        // No accepted trades, hide the view
        setShowExtractedTrades(false);
      }
    }
  };
  const handleAcceptAll = () => {
    // Mark all pending trades as accepted
    const newStates = {
      ...tradeStates
    };
    Object.keys(newStates).forEach(key => {
      if (newStates[parseInt(key)]?.status === 'pending') {
        newStates[parseInt(key)] = { status: 'accepted', isVisible: true };
      }
    });
    setTradeStates(newStates);
    setShowExtractedTrades(false);
    setCurrentMode('multiple');
  };
  const handleProcessAll = () => {
    const acceptedTrades = Object.keys(tradeStates).filter(key => tradeStates[parseInt(key)]?.status === 'accepted');
    if (acceptedTrades.length > 0) {
      setShowExtractedTrades(false);
      setCurrentMode('multiple');
    }
  };
  const handleRejectAll = () => {
    // Mark all pending trades as rejected
    const newStates = {
      ...tradeStates
    };
    Object.keys(newStates).forEach(key => {
      if (newStates[parseInt(key)]?.status === 'pending') {
        newStates[parseInt(key)] = { status: 'rejected', isVisible: true };
      }
    });
    setTradeStates(newStates);
    setShowExtractedTrades(false);
  };

  const handleUnacceptTrade = (index: number) => {
    // Revert an accepted trade back to pending
    setTradeStates(prev => ({
      ...prev,
      [index]: { status: 'pending', isVisible: true }
    }));
  };

  const handleUnrejectTrade = (index: number) => {
    // Revert a rejected trade back to pending
    setTradeStates(prev => ({
      ...prev,
      [index]: { status: 'pending', isVisible: true }
    }));
  };
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setIsSaving(true);
    try {
      const tradeParams = {
        entryPrice: parseFloat(formData.entryPrice),
        exitPrice: parseFloat(formData.exitPrice),
        quantity: parseInt(formData.quantity),
        tradeType: formData.tradeType,
        marketSegment: formData.marketSegment,
        exchange: formData.exchange
      };
      const {
        pl,
        brokerage
      } = calculateTradeMetrics(tradeParams);
      const tradeFormData = {
        id: formData.id,
        symbol: formData.symbol,
        entryPrice: formData.entryPrice,
        exitPrice: formData.exitPrice,
        quantity: formData.quantity,
        date: formData.date,
        tradeType: formData.tradeType,
        notes: formData.notes,
        mood: formData.mood,
        entryScreenshot: formData.entryScreenshot,
        exitScreenshot: formData.exitScreenshot,
        marketSegment: formData.marketSegment,
        exchange: formData.exchange,
        strategy: formData.strategy,
        entryTime: formData.entryTime,
        exitTime: formData.exitTime,
        riskToReward: formData.riskToReward,
        optionType: formData.optionType,
        positionType: formData.positionType
      };
      let response;
      if (isEditMode && tradeId) {
        console.log("Updating existing trade:", tradeId, tradeFormData);
        response = await updateTrade(tradeId, tradeFormData, pl, brokerage);
        if (response.error) {
          throw new Error(response.error.message || "Failed to update trade");
        }
        toast.success("Trade updated successfully!", {
          description: `Your changes to the ${formData.symbol} trade have been saved`,
          icon: <FileCheck className="h-4 w-4 text-green-500" />
        });
      } else {
        console.log("Creating new trade:", tradeFormData);
        response = await createTrade(tradeFormData, pl, brokerage);
        if (response.error) {
          throw new Error(response.error.message || "Failed to create trade");
        }
        toast.success("Trade saved successfully!", {
          description: formData.mood ? `Your mood was ${formData.mood} during this trade` : undefined,
          icon: <FileCheck className="h-4 w-4 text-green-500" />
        });
      }

      // Dispatch the event before navigating
      const tradeUpdateEvent = new CustomEvent('tradeDataUpdated', {
        detail: response?.data || {
          id: formData.id,
          symbol: formData.symbol
        }
      });
      window.dispatchEvent(tradeUpdateEvent);

      // Navigate immediately with state indicating that trades should be refreshed
      navigate("/trades", {
        state: {
          refreshTrades: true,
          newTradeId: response?.data?.id || formData.id
        }
      });
    } catch (error: any) {
      console.error("Error saving trade:", error);
      toast.error(error.message || "Failed to save trade");
    } finally {
      setIsSaving(false);
    }
  };

  // Memoized trade metrics calculation for real-time updates
  const {
    pl,
    brokerage,
    roi
  } = useMemo(() => {
    const tradeParams = {
      entryPrice: parseFloat(formData.entryPrice) || 0,
      exitPrice: parseFloat(formData.exitPrice) || 0,
      quantity: parseInt(formData.quantity) || 0,
      tradeType: formData.tradeType as TradeType,
      marketSegment: formData.marketSegment,
      exchange: formData.exchange
    };
    return calculateTradeMetrics(tradeParams);
  }, [formData.entryPrice, formData.exitPrice, formData.quantity, formData.tradeType, formData.marketSegment, formData.exchange]);
  return <AppLayout>
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background -z-10" />

      <div className={`container max-w-none ${isMobile ? 'px-3 py-4' : 'px-6 py-8'}`}>
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        ease: "easeOut"
      }} className={`mb-${isMobile ? '4' : '6'} ${isMobile ? 'flex flex-col gap-4' : 'flex justify-between items-start'}`}>
          <div>
            <motion.h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500`} initial={{
            backgroundPosition: "0% 50%"
          }} animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }} transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}>
              {isEditMode ? 'Edit Trade' : 'Record New Trade'}
            </motion.h1>
            <p className={`text-muted-foreground mt-2 ${isMobile ? 'text-sm' : 'text-lg'}`}>
              {isEditMode ? 'Update your trading record to maintain accurate history.' : 'Document your trading activity to improve over time.'}
            </p>
          
            {!isXSmall && <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 hover:bg-primary/20 transition-colors">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  Performance Tracking
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 hover:bg-blue-500/20 transition-colors">
                  <BarChart2 className="mr-1 h-4 w-4" />
                  Advanced Analysis
                </Badge>
              </div>}
          </div>
          
          {!isMobile && <div className="flex space-x-3">
              <Button variant="outline" size="lg" className="border-primary/20 hover:border-primary/40" onClick={() => navigate('/trades')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Trades
              </Button>
              <Button onClick={handleSave} size="lg" className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading || isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : isEditMode ? 'Update Trade' : 'Save Trade'}
              </Button>
            </div>}
          
          {isMobile && <div className="flex w-full justify-between gap-2">
              <Button variant="outline" size="default" className="border-primary/20 hover:border-primary/40 flex-1" onClick={() => navigate('/trades')}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSave} size="default" className="bg-green-600 hover:bg-green-700 text-white flex-1" disabled={isLoading || isSaving}>
                <Save className="mr-1 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>}
        </motion.div>
        
        {isLoading ? <div className="flex items-center justify-center p-6 sm:p-12 bg-card/90 backdrop-blur-md rounded-lg border border-primary/20 shadow-lg">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary"></div>
            <p className="ml-4 text-base sm:text-lg text-muted-foreground">Loading trade data...</p>
          </div> : <div>
            {/* Order Book Upload - Compact */}
            {!isEditMode && !showExtractedTrades && <div className="mb-6">
                <OrderBookUploader onTradesExtracted={handleTradesExtracted} />
              </div>}
            
            {showExtractedTrades && <div className="mb-6">
            <ExtractedTradesReview trades={extractedTrades} onAcceptTrade={handleAcceptTrade} onRejectTrade={handleRejectTrade} onUnacceptTrade={handleUnacceptTrade} onUnrejectTrade={handleUnrejectTrade} onAcceptAll={handleAcceptAll} onRejectAll={handleRejectAll} onProcessAll={handleProcessAll} tradeStates={tradeStates} />
              </div>}

            {!showExtractedTrades && extractedTrades.length > 0 && <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500 mb-2">
                    Edit Accepted Trades
                  </h2>
                  <p className="text-muted-foreground">
                    Review and edit {extractedTrades.filter((_, index) => tradeStates[index]?.status === 'accepted').length} accepted trades before saving
                  </p>
                </div>
                
                {/* Progress Indicator */}
                <div className="bg-card/50 backdrop-blur-md border border-primary/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Progress: {savedTrades.size} of {extractedTrades.filter((_, index) => tradeStates[index]?.status === 'accepted').length} trades saved
                    </span>
                    <div className="flex gap-2">
                      
                    </div>
                  </div>
                  <div className="w-full bg-secondary/30 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-blue-500 h-2 rounded-full transition-all duration-300" style={{
                width: `${savedTrades.size / extractedTrades.filter((_, index) => tradeStates[index]?.status === 'accepted').length * 100}%`
              }} />
                  </div>
                </div>

                <div className="space-y-6">
                  {extractedTrades.map((trade, originalIndex) => ({
              trade,
              originalIndex
            })).filter(({
              originalIndex
            }) => tradeStates[originalIndex]?.status === 'accepted').map(({
              trade,
              originalIndex
            }) => {
              const tradeNumber = originalIndex + 1;
              const isActive = openTrades.has(tradeNumber);
              const tradeData = tradePsychologyData[tradeNumber] || {};
              const isSaved = savedTrades.has(tradeNumber);
              const isSaving = savingTrades.has(tradeNumber);
              return <div key={originalIndex} ref={el => {
                tradeRefs.current[tradeNumber] = el;
              }}>
                        <CollapsibleTradeSection trade={trade} tradeNumber={tradeNumber} strategies={strategies} isMultipleTradesMode={true} processedFormData={tradeFormData[tradeNumber]} onPsychologyChange={handlePsychologyChange} onToggle={handleTradeToggle} onFormDataChange={(tradeNumber, formData) => {
                  setTradeFormData(prev => ({
                    ...prev,
                    [tradeNumber]: formData
                  }));
                }} onTradeSaved={tradeData => {
                  // Update saved trades state
                  setSavedTrades(prev => new Set([...prev, tradeNumber]));

                  // Dispatch the event for each saved trade
                  const tradeUpdateEvent = new CustomEvent('tradeDataUpdated', {
                    detail: tradeData
                  });
                  window.dispatchEvent(tradeUpdateEvent);
                  toast.success(`Trade ${tradeNumber} saved successfully!`, {
                    description: `${trade.symbol} trade recorded`
                  });

                  // Auto-expand next unsaved trade
                  const acceptedTrades = Object.keys(tradeStates).filter(key => tradeStates[parseInt(key)]?.status === 'accepted').map(key => parseInt(key) + 1);
                  const nextUnsavedTrade = acceptedTrades.find(num => !savedTrades.has(num) && num !== tradeNumber);
                  if (nextUnsavedTrade) {
                    setOpenTrades(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(tradeNumber); // Close current
                      newSet.add(nextUnsavedTrade); // Open next
                      return newSet;
                    });
                    setActiveFocusedTrade(nextUnsavedTrade);
                  }
                }} />
                      </div>;
            })}
                </div>
                
                <div className="flex justify-center gap-4 mt-8">
                  <Button variant="outline" onClick={() => {
              setShowExtractedTrades(true);
            }} className="border-primary/20 hover:border-primary/40">
                    Back to Review
                  </Button>
                  <Button onClick={() => {
              navigate("/trades", {
                state: {
                  refreshTrades: true
                }
              });
            }} className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white" disabled={savedTrades.size === 0}>
                    Finish & View All Trades
                    {savedTrades.size > 0 && <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                        {savedTrades.size} saved
                      </span>}
                  </Button>
                </div>
              </div>}

            {/* Regular single trade form with individual psychology card */}
            {!showExtractedTrades && extractedTrades.length === 0 && <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-3'} gap-${isMobile ? '4' : '6'}`}>
                {/* Main Trade Form - Takes 2 columns */}
                <div className={`${isMobile ? '' : 'lg:col-span-2'}`}>
                  <TradeFormFields formData={formData} strategies={strategies} validationError={validationError} hidePsychologySection={true} onFormDataChange={data => {
              setFormData(prev => ({
                ...prev,
                ...data,
                tradeType: data.tradeType ? data.tradeType as TradeType : prev.tradeType,
                mood: data.mood ? data.mood as Mood : prev.mood
              }));
            }} onDateChange={handleDateChange} onMoodChange={handleMoodChange} onSegmentChange={handleSegmentChange} onTradeTypeChange={handleTradeTypeChange} onTimeChange={handleTimeChange} onRiskRewardChange={handleRiskRewardChange} />
                  
                  {/* Save button for mobile */}
                  {isMobile && <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.3,
              delay: 0.6
            }} className="sticky bottom-4 z-50">
                      <Button onClick={handleSave} className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg" disabled={isLoading || isSaving}>
                        <Save className="mr-2 h-5 w-5" />
                        {isSaving ? 'Saving...' : isEditMode ? 'Update Trade' : 'Save Trade'}
                        <span className="sr-only">Save Trade</span>
                      </Button>
                    </motion.div>}
                </div>
                
                {/* Individual Psychology & Result Cards - Takes 1 column */}
                {!isMobile && <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                    <TradePsychologyCard tradeNumber={1} symbol={formData.symbol || 'Symbol'} mood={formData.mood} strategy={formData.strategy} strategies={strategies} onMoodChange={handleMoodChange} onStrategyChange={strategy => setFormData(prev => ({
              ...prev,
              strategy
            }))} showTradeNumber={false} />
                    
                    {showResults && <TradeResultCard pl={pl} brokerage={brokerage} roi={roi} animate={true} />}
                    
                    {validationError && <motion.div initial={{
              opacity: 0,
              scale: 0.95
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <p className="text-sm text-red-600">{validationError}</p>
                        </div>
                      </motion.div>}
                  </div>}
              </div>}
          </div>}
      </div>
    </AppLayout>;
};
export default TradeForm;