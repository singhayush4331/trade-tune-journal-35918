export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  entry_price: number;
  exit_price: number;
  entryPrice: number; // Maintaining both naming conventions for compatibility
  exitPrice: number;  // Maintaining both naming conventions for compatibility
  quantity: number;
  date: Date;
  type: string;
  notes?: string;
  mood?: string;
  pnl: number;
  screenshots?: string[] | null;
  created_at: string;
  updated_at: string;
  createdAt: string; // Maintaining both naming conventions for compatibility
  updatedAt: string; // Maintaining both naming conventions for compatibility
  strategy?: string;
  marketSegment?: string;
  market_segment?: string;
  exchange?: string;
  entryScreenshot?: string | null;
  exitScreenshot?: string | null;
  entryTime?: string;
  exitTime?: string;
  entry_time?: string;
  exit_time?: string;
  riskToReward?: string; // Adding risk-to-reward field to Trade interface
  optionType?: 'CE' | 'PE'; // Options type detection
  option_type?: 'CE' | 'PE'; // Database field name
  positionType?: 'buy' | 'sell'; // Position type for options
  position_type?: 'buy' | 'sell'; // Database field name
}

export type Mood = 'focused' | 'excited' | 'anxious' | 'frustrated' | 'confident' | 'fearful' | 'calm';

export type TradeType = 'long' | 'short';

export interface TradeFormData {
  id?: string;
  symbol: string;
  entryPrice: string;
  exitPrice: string;
  quantity: string;
  date: Date;
  tradeType: string;
  notes?: string;
  mood?: string;
  entryScreenshot?: string | null;
  exitScreenshot?: string | null;
  marketSegment: string;
  exchange: string;
  riskToReward?: string;
  strategy?: string;
  createdAt?: string;
  entryTime?: string;
  exitTime?: string;
  optionType?: 'CE' | 'PE' | '';
  positionType?: 'buy' | 'sell' | '';
}

export const defaultTradeFormValues: TradeFormData = {
  symbol: '',
  entryPrice: '',
  exitPrice: '',
  quantity: '',
  date: new Date(),
  tradeType: 'long',
  notes: '',
  mood: '',
  entryScreenshot: null,
  exitScreenshot: null,
  marketSegment: 'equity-delivery',
  exchange: 'NSE',
  riskToReward: '',
  strategy: '',
  entryTime: '',
  exitTime: '',
  optionType: '',
  positionType: '',
};

export interface TradeFormProps {
  tradeId?: string;
}
