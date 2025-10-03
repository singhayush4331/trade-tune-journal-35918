
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  TrendingUp, 
  BarChart3, 
  BookOpen, 
  ArrowRight, 
  Clock,
  Zap
} from 'lucide-react';

// Sample concept categories and items
const CONCEPT_CATEGORIES = [
  {
    id: "technical",
    name: "Technical Analysis",
    concepts: [
      {
        title: "Moving Averages",
        description: "Understanding how moving averages help identify market trends and potential reversals",
        level: "Beginner",
        timeToRead: "8 min",
        imageUrl: "/lovable-uploads/7af97329-5f82-41a6-af28-113f7711536c.png"
      },
      {
        title: "Fibonacci Retracement",
        description: "Learn how to use Fibonacci levels to identify support, resistance, and potential reversal points",
        level: "Intermediate",
        timeToRead: "12 min",
        imageUrl: "/lovable-uploads/6120e2e2-296a-403d-a2a3-7cae3e7241fa.png"
      },
      {
        title: "Market Structure",
        description: "Understanding higher highs, lower lows, and how to identify shifts in market direction",
        level: "Intermediate",
        timeToRead: "10 min",
        imageUrl: "/lovable-uploads/cee9ac58-3a60-4703-840f-425403c6488c.png"
      }
    ]
  },
  {
    id: "fundamental",
    name: "Fundamental Analysis",
    concepts: [
      {
        title: "Earnings Reports",
        description: "How to analyze quarterly earnings reports and their impact on stock prices",
        level: "Intermediate",
        timeToRead: "15 min",
        imageUrl: "/lovable-uploads/dacda39a-48ba-4f33-813b-c570e9686ae3.png"
      },
      {
        title: "Economic Indicators",
        description: "Understanding key economic indicators and their influence on market movements",
        level: "Advanced",
        timeToRead: "18 min",
        imageUrl: "/lovable-uploads/10c2135b-18ac-464b-a5e3-fd5430a26063.png"
      }
    ]
  },
  {
    id: "psychology",
    name: "Trading Psychology",
    concepts: [
      {
        title: "Managing FOMO",
        description: "Strategies to overcome the fear of missing out and make rational trading decisions",
        level: "Beginner",
        timeToRead: "7 min",
        imageUrl: "/lovable-uploads/2780255e-6d53-44a4-8fcf-7fa8a4a25bc1.png"
      },
      {
        title: "Handling Losses",
        description: "Psychological techniques to accept and learn from trading losses",
        level: "Intermediate",
        timeToRead: "9 min",
        imageUrl: "/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png"
      }
    ]
  }
];

const MarketConceptsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState("technical");
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  const getLevelColor = (level: string) => {
    switch(level) {
      case "Beginner": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Intermediate": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "Advanced": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      default: return "text-primary bg-primary/10 border-primary/20";
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Market Concepts
          </h2>
          <p className="text-sm text-muted-foreground">
            Master key trading concepts with visual explanations
          </p>
        </div>
      </div>

      <Tabs 
        value={activeCategory} 
        onValueChange={setActiveCategory} 
        className="w-full"
      >
        <TabsList className="bg-muted/50 p-1 rounded-lg w-full grid grid-cols-3 h-auto">
          <TabsTrigger 
            value="technical" 
            className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Technical</span>
          </TabsTrigger>
          <TabsTrigger 
            value="fundamental" 
            className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Fundamental</span>
          </TabsTrigger>
          <TabsTrigger 
            value="psychology" 
            className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Psychology</span>
          </TabsTrigger>
        </TabsList>

        {CONCEPT_CATEGORIES.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.concepts.map((concept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border border-primary/10 bg-gradient-to-br from-card/90 via-card to-card/80 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200 group h-full flex flex-col">
                    <div className="relative h-36 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/60 z-10"></div>
                      <img 
                        src={concept.imageUrl} 
                        alt={concept.title} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-center">
                        <h3 className="text-white font-medium text-sm">{concept.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={`${getLevelColor(concept.level)} text-xs border-opacity-30 backdrop-blur-sm`}
                        >
                          {concept.level}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="py-3 flex-1">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {concept.description}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0 pb-3 px-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{concept.timeToRead}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary flex items-center gap-1">
                        Read
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <Button variant="outline" className="w-full border-primary/10 bg-primary/5 hover:bg-primary/10 text-primary mt-4">
              <Zap className="h-4 w-4 mr-2" />
              Discover More {category.name} Concepts
            </Button>
          </TabsContent>
        ))}
      </Tabs>

      {/* Featured Topic */}
      <Card className="border-primary/10 bg-gradient-to-br from-primary/5 to-background overflow-hidden relative">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base">Featured Trading Concept</CardTitle>
          </div>
          <CardDescription>
            Recommended based on your recent trading activity
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3 rounded-lg overflow-hidden">
            <img 
              src="/lovable-uploads/7af97329-5f82-41a6-af28-113f7711536c.png" 
              alt="Price Action Trading" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Price Action Trading</h3>
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                Trending
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Learn to trade using pure price movements without relying heavily on indicators. 
              Price action trading focuses on analyzing candlestick patterns, support and resistance levels, 
              and market structure to make trading decisions.
            </p>
            <div className="pt-2 flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>15 min reading time</span>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary shadow-sm">
                Start Learning
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MarketConceptsSection;
