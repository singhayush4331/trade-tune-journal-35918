
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { predictTradePerformance, getOpenAIKey } from '@/services/ai-analysis-service';
import { formatIndianCurrency } from '@/lib/utils';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import OpenAIKeyForm from './OpenAIKeyForm';

const TradePrediction: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [tradeType, setTradeType] = useState('long');
  const [entryPrice, setEntryPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [strategy, setStrategy] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [hasApiKey, setHasApiKey] = useState(!!getOpenAIKey());

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symbol || !entryPrice || !quantity) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await predictTradePerformance({
        symbol,
        type: tradeType,
        entryPrice: parseFloat(entryPrice),
        quantity: parseInt(quantity),
        strategy: strategy || undefined
      });
      
      setPrediction(result);
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if API key exists whenever component renders
  useEffect(() => {
    const checkApiKey = () => {
      setHasApiKey(!!getOpenAIKey());
    };
    
    checkApiKey();
    
    const interval = setInterval(checkApiKey, 5000);
    return () => clearInterval(interval);
  }, []);

  const progressColor = prediction && prediction.winProbability > 0.6 
    ? "bg-success" 
    : prediction && prediction.winProbability < 0.4 
      ? "bg-destructive" 
      : "bg-primary";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Trade Prediction</h2>
        <p className="text-muted-foreground">Get AI-powered predictions for your potential trades</p>
      </div>

      {!hasApiKey ? (
        <OpenAIKeyForm />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Predict Trade Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePredict} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Stock Symbol</Label>
                  <Input
                    id="symbol"
                    placeholder="RELIANCE, TCS, etc."
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trade-type">Trade Type</Label>
                  <Select value={tradeType} onValueChange={setTradeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trade type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="entry-price">Entry Price</Label>
                    <Input
                      id="entry-price"
                      placeholder="Entry Price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={entryPrice}
                      onChange={(e) => setEntryPrice(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      placeholder="Quantity"
                      type="number"
                      step="1"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strategy">Strategy (Optional)</Label>
                  <Input
                    id="strategy"
                    placeholder="Your trading strategy"
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Providing your strategy helps the AI make more accurate predictions
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading || !symbol || !entryPrice || !quantity}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Predict Performance
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Prediction Results</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Analyzing trade potential...</p>
                </div>
              ) : prediction ? (
                prediction.error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{prediction.error}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Win Probability</span>
                        <span className="text-sm font-medium">
                          {Math.round(prediction.winProbability * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={prediction.winProbability * 100} 
                        max={100}
                        className={progressColor}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Expected P&L</div>
                        <div className={`text-xl font-semibold ${prediction.expectedPnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatIndianCurrency(prediction.expectedPnl)}
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Confidence</div>
                        <div className="text-xl font-semibold">
                          {Math.round(prediction.confidenceScore * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        {prediction.recommendations.slice(0, 3).map((rec: string, i: number) => (
                          <li key={i} className="text-sm bg-muted/30 p-2 rounded flex items-start gap-2">
                            <span className="bg-primary/20 text-primary w-5 h-5 flex items-center justify-center rounded text-xs font-medium mt-0.5">
                              {i + 1}
                            </span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary/60" />
                  </div>
                  <p className="text-muted-foreground">
                    Fill out the trade details and click "Predict Performance" to get AI-powered insights
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TradePrediction;
