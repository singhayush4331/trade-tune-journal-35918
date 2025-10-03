
import React, { useState } from 'react';
import { useSanitizedHtml } from '@/utils/sanitize-html';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateLearningMaterial } from '@/services/education-service';
import { 
  Loader2, 
  BookOpen, 
  Search, 
  RefreshCw, 
  GraduationCap, 
  BookText, 
  Sparkles,
  Star,
  ListTodo
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { parseMarkdown } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

// Suggested topics for quick selection with categories
const SUGGESTED_TOPICS = [
  { 
    category: "Strategy",
    topics: ["Price Action", "Support and Resistance", "Candlestick Patterns", "Market Structure"]
  },
  { 
    category: "Risk Management",
    topics: ["Risk Management", "Position Sizing", "Trading Psychology"]
  },
  { 
    category: "Instruments",
    topics: ["Options Strategies", "Futures Trading", "Technical Indicators"]
  }
];

const LearningMaterialsSection: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [recentTopics, setRecentTopics] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("Strategy");

  const handleGenerateContent = async (selectedTopic: string) => {
    if (!selectedTopic.trim()) return;
    
    setLoading(true);
    try {
      const { content, success } = await generateLearningMaterial(selectedTopic);
      
      if (success) {
        setContent(content);
        
        // Add to recent topics if not already there
        if (!recentTopics.includes(selectedTopic)) {
          setRecentTopics(prev => [selectedTopic, ...prev.slice(0, 4)]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const isMobile = useIsMobile();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      {/* Search Card with Enhanced Design */}
      <Card className="overflow-hidden border border-primary/10 bg-gradient-to-br from-card/90 via-card to-card/80 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-primary/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <span>Find a Topic</span>
            </CardTitle>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              AI-Powered
            </Badge>
          </div>
          <CardDescription className="text-muted-foreground text-sm">
            Discover personalized learning materials on any trading topic
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                placeholder="Enter a trading topic..." 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="pl-9 bg-background/50 border-primary/10 focus-visible:ring-primary/20"
              />
              <BookOpen className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <Button 
              onClick={() => handleGenerateContent(topic)}
              disabled={loading || !topic.trim()}
              size={isMobile ? "sm" : "default"}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary shadow-md"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isMobile ? "Learn" : "Generate"}
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Topic Categories</h3>
            </div>
            
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="bg-background/50 p-0.5 mb-3">
                {SUGGESTED_TOPICS.map((category) => (
                  <TabsTrigger 
                    key={category.category} 
                    value={category.category}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {category.category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {SUGGESTED_TOPICS.map((category) => (
                <TabsContent key={category.category} value={category.category} className="mt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {category.topics.map((suggestedTopic) => (
                      <Badge 
                        key={suggestedTopic}
                        variant="outline" 
                        className="cursor-pointer text-xs bg-background/50 hover:bg-primary hover:text-primary-foreground transition-colors border-primary/10 px-3 py-1.5"
                        onClick={() => {
                          setTopic(suggestedTopic);
                          handleGenerateContent(suggestedTopic);
                        }}
                      >
                        {suggestedTopic}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            {recentTopics.length > 0 && (
              <div className="pt-2 border-t border-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <ListTodo className="h-4 w-4 text-blue-500" />
                  <h3 className="text-xs font-medium text-muted-foreground">Recent Topics</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recentTopics.map((recentTopic) => (
                    <Badge 
                      key={recentTopic}
                      variant="secondary" 
                      className="cursor-pointer text-xs hover:bg-secondary/80"
                      onClick={() => {
                        setTopic(recentTopic);
                        handleGenerateContent(recentTopic);
                      }}
                    >
                      {recentTopic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Display with Enhanced Design */}
      {loading ? (
        <Card className="border-primary/10 bg-gradient-to-br from-card/90 via-card to-card/80 shadow-lg backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="absolute inset-0 h-10 w-10 rounded-full border-t-2 border-primary opacity-20 animate-ping"></div>
            </div>
            <p className="text-sm text-muted-foreground">Generating personalized learning material...</p>
          </CardContent>
        </Card>
      ) : content ? (
        <Card className="border-primary/10 bg-gradient-to-br from-card/90 via-card to-card/80 shadow-lg backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-primary/5 flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-base flex items-center">
                <BookText className="h-4 w-4 text-primary mr-2" /> 
                {topic}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                AI-generated educational content
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleGenerateContent(topic)}
              className="h-8 bg-background/50 hover:bg-primary/5 hover:text-primary border-primary/10"
            >
              <RefreshCw className="h-3 w-3 mr-1.5" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-background/20 to-transparent z-10"></div>
              <div 
                className="prose prose-sm dark:prose-invert max-w-none overflow-y-auto px-6 py-5"
                style={{ 
                  maxHeight: isMobile ? 'calc(100vh - 400px)' : '60vh',
                }}
              >
                <div className="relative z-0">
                  <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-blue-500/5 rounded-full blur-xl"></div>
                </div>
                <div
                  className="relative z-10"
                  dangerouslySetInnerHTML={useSanitizedHtml(
                    parseMarkdown ? parseMarkdown(content) : content.replace(/\n/g, '<br />'),
                    'trusted'
                  )}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent"></div>
            </div>
            
            <div className="flex items-center justify-between px-6 py-3 border-t border-primary/5 bg-background/30">
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span>AI-powered content</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 text-xs px-2 hover:bg-primary/5 hover:text-primary"
              >
                Save to Notebook
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </motion.div>
  );
};

export default LearningMaterialsSection;
