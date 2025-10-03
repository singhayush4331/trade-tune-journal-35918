import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeTrades, getOpenAIKey, AnalysisResult } from '@/services/ai-analysis-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, AlertCircle, Lightbulb, TrendingUp, Loader2, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import OpenAIKeyForm from './OpenAIKeyForm';
import { motion } from 'framer-motion';
import { formatIndianCurrency } from '@/lib/utils';

interface Pattern {
  description: string;
  confidence: number;
  metric?: string;
}

const PatternBadge = ({ confidence }: { confidence: number }) => {
  const isHighConfidence = confidence > 0.7;
  
  return (
    <Badge 
      variant={isHighConfidence ? "default" : "secondary"} 
      className={`
        h-8 w-8 rounded-full p-0 flex items-center justify-center
        ${isHighConfidence 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground'}
        text-xs font-bold
        overflow-hidden
        flex-shrink-0
      `}
    >
      {Math.round(confidence * 100)}%
    </Badge>
  );
};

const TradesAnalysis: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [hasApiKey, setHasApiKey] = useState(!!getOpenAIKey());
  
  const handleAnalyzeTrades = async () => {
    setIsLoading(true);
    try {
      const result = await analyzeTrades();
      
      const typedResult: AnalysisResult = {
        insights: '',
        recommendations: [],
        patterns: [],
        error: undefined
      };
      
      if (result && !result.error) {
        typedResult.insights = typeof result.insights === 'string' ? 
          result.insights
            .replace(/#{1,6} /g, '')
            .replace(/\*\*/g, '')
            .replace(/\n{3,}/g, '\n\n')
          : '';
        
        if (Array.isArray(result.recommendations)) {
          typedResult.recommendations = result.recommendations;
        } else if (typeof result.recommendations === 'string') {
          const recommendationsText: string = result.recommendations;
          const lines = recommendationsText.split('\n');
          const filteredLines = lines.filter(line => 
            line.trim().startsWith('-') || line.trim().match(/^\d+\./)
          );
          typedResult.recommendations = filteredLines
            .map(line => line.replace(/^-\s*|^\d+\.\s*/, '').trim())
            .filter(Boolean);
        } else {
          typedResult.recommendations = [];
        }
        
        if (Array.isArray(result.patterns)) {
          typedResult.patterns = result.patterns;
        } else {
          typedResult.patterns = [];
        }
      } else if (result && result.error) {
        typedResult.error = result.error;
      }
      
      setAnalysisResult(typedResult);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisResult({ error: "An unexpected error occurred during analysis." });
    } finally {
      setIsLoading(false);
    }
  };

  const processPatternMetrics = (pattern: Pattern) => {
    if (!pattern.metric) return pattern;
    
    if (pattern.metric.includes('$')) {
      const numericValue = parseFloat(pattern.metric.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(numericValue)) {
        return {
          ...pattern,
          metric: formatIndianCurrency(numericValue)
        };
      }
    }
    return pattern;
  };

  const processPatternDescription = (description: string) => {
    return description.replace(/\$(\d+)/g, (match, p1) => {
      const amount = parseInt(p1, 10);
      return formatIndianCurrency(amount);
    });
  };

  React.useEffect(() => {
    const checkApiKey = () => {
      setHasApiKey(!!getOpenAIKey());
    };
    
    checkApiKey();
    
    const interval = setInterval(checkApiKey, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Trade Analysis</h2>
          <p className="text-muted-foreground">Get AI-powered insights about your trading patterns</p>
        </div>
        {hasApiKey && (
          <Button 
            onClick={handleAnalyzeTrades} 
            disabled={isLoading}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Trades
              </>
            )}
          </Button>
        )}
      </div>

      {!hasApiKey && (
        <OpenAIKeyForm />
      )}

      {hasApiKey && !analysisResult && !isLoading && (
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">No Analysis Yet</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Click the "Analyze Trades" button to get AI-powered insights about your trading patterns and performance.
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card className="border bg-muted/30">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-medium">Analyzing Your Trades</h3>
            <p className="text-sm text-muted-foreground mt-2">
              The AI is analyzing your trading history to provide personalized insights.
              This may take a moment...
            </p>
          </CardContent>
        </Card>
      )}

      {analysisResult && !analysisResult.error && (
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="insights">
              <Lightbulb className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <TrendingUp className="h-4 w-4 mr-2" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="patterns">
              <BarChart3 className="h-4 w-4 mr-2" />
              Patterns
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Trading Insights
                </CardTitle>
                <CardDescription>
                  Analysis of your trading performance and behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analysisResult.insights && typeof analysisResult.insights === 'string' && 
                   analysisResult.insights.split(/(?=\d\. )/).filter(Boolean).length > 0 ? (
                    analysisResult.insights.split(/(?=\d\. )/).filter(Boolean).map((section: string, index: number) => {
                      const parts = section.split(':');
                      const title = parts[0] || '';
                      const content = parts.slice(1).join(':') || '';
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="rounded-xl border bg-gradient-to-br from-card/95 to-card/80 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <span className="text-sm font-bold text-primary">{index + 1}</span>
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg text-primary">{title.trim()}</h3>
                              <div className="space-y-2">
                                {content.split('- ').filter(Boolean).map((point: string, pIndex: number) => (
                                  <div key={pIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <div className="h-2 w-2 translate-y-1.5 rounded-full bg-primary/50" />
                                    <p>{point.trim()}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-xl border border-dashed bg-muted/30 p-8 text-center"
                    >
                      <Lightbulb className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Insights Available</h3>
                      <p className="text-sm text-muted-foreground">
                        The analysis couldn't generate specific insights from your trade data. 
                        Try adding more trades or providing more detailed information.
                      </p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recommendations
                </CardTitle>
                <CardDescription>
                  Actionable steps to improve your trading performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.recommendations && analysisResult.recommendations.length > 0 ? (
                    analysisResult.recommendations.map((rec: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4 rounded-lg border bg-gradient-to-br from-card/95 to-card/90 p-4 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                          <span className="text-sm font-semibold text-primary">{i + 1}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{rec}</p>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-xl border border-dashed bg-muted/30 p-8 text-center"
                    >
                      <TrendingUp className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Recommendations Available</h3>
                      <p className="text-sm text-muted-foreground">
                        The analysis couldn't generate specific recommendations from your trade data. 
                        Try adding more trades or providing more detailed information.
                      </p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patterns" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Detected Patterns
                </CardTitle>
                <CardDescription>
                  Trading patterns identified in your history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {analysisResult.patterns && analysisResult.patterns.length > 0 ? (
                    analysisResult.patterns.map((pattern: Pattern, i: number) => {
                      const processedPattern = processPatternMetrics(pattern);
                      
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="rounded-xl border bg-gradient-to-br from-card/95 to-card/80 p-4 shadow-md hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                              <PatternBadge confidence={processedPattern.confidence} />
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-sm">
                                {processPatternDescription(processedPattern.description)}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${processedPattern.confidence * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {processedPattern.metric && (
                            <div className={`px-3 py-1 mt-2 rounded-full text-xs font-medium 
                              ${pattern.confidence > 0.6 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}
                              flex items-center w-fit ml-auto`}
                            >
                              {processedPattern.metric}
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-xl border border-dashed bg-muted/30 p-8 text-center md:col-span-2"
                    >
                      <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Patterns Detected</h3>
                      <p className="text-sm text-muted-foreground">
                        The analysis couldn't identify specific patterns in your trading history. 
                        Try adding more trades for better pattern recognition.
                      </p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {analysisResult?.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>
            {analysisResult.error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TradesAnalysis;
