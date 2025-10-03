
import React, { useState, useEffect, useRef } from 'react';
import { useSanitizedHtml } from '@/utils/sanitize-html';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Eye,
  Target,
  FileText,
  Bookmark,
  Star,
  Award,
  Download,
  Share2,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentReadingRendererProps {
  lesson: any;
  onComplete?: () => void;
  onNext?: () => void;
}

const StudentReadingRenderer: React.FC<StudentReadingRendererProps> = ({ 
  lesson, 
  onComplete, 
  onNext 
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [readingData, setReadingData] = useState<any>(null);
  const [readingTime, setReadingTime] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lesson && lesson.content_data) {
      setReadingData(lesson.content_data);
    }
  }, [lesson]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReading && !isCompleted) {
      interval = setInterval(() => {
        setReadingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading, isCompleted]);

  useEffect(() => {
    const handleScroll = () => {
      const element = contentRef.current;
      if (!element) return;

      setIsReading(true);
      
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const progress = Math.min((scrollTop / scrollHeight) * 100, 100);
      
      setReadingProgress(progress);
      
      if (progress > 85 && !isCompleted) {
        setIsCompleted(true);
        setIsReading(false);
        onComplete?.();
      }
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [isCompleted, onComplete]);

  const formatReadTime = (minutes: number) => {
    return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!readingData && !lesson.content) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20 border-0 shadow-2xl">
          <CardContent className="py-20 text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <BookOpen className="h-10 w-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Loading Reading Material
            </h3>
            <p className="text-muted-foreground text-lg">Preparing your content for an excellent reading experience...</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Enhanced Reading Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border-0 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-full blur-3xl"></div>
          
          <CardHeader className="relative z-10 pb-8">
            <div className="flex items-start gap-6">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-white/20"
              >
                <BookOpen className="h-8 w-8 text-white" />
              </motion.div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                    {lesson.title}
                  </CardTitle>
                  <p className="text-lg text-muted-foreground mt-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-700 dark:text-green-300 px-4 py-2 text-sm font-medium">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Reading Material
                  </Badge>
                  
                  {readingData?.settings?.estimatedReadTime && (
                    <div className="flex items-center gap-2 text-muted-foreground bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{formatReadTime(readingData.settings.estimatedReadTime)} read</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-muted-foreground bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">{readingData?.settings?.difficulty || 'All Levels'}</span>
                  </div>
                  
                  {readingData?.metadata?.wordCount && (
                    <div className="flex items-center gap-2 text-muted-foreground bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{readingData.metadata.wordCount} words</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Reading Progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 space-y-3"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <Eye className="h-4 w-4" />
                  Reading Progress
                </span>
                <div className="flex items-center gap-4">
                  <span className="font-bold">{Math.round(readingProgress)}%</span>
                  <span className="text-muted-foreground">Time: {formatTime(readingTime)}</span>
                </div>
              </div>
              <Progress value={readingProgress} className="h-3 bg-white/20" />
              {readingProgress >= 85 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium"
                >
                  <CheckCircle className="h-4 w-4" />
                  Reading complete! Great job!
                </motion.div>
              )}
            </motion.div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Enhanced Reading Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-white via-green-50 to-emerald-50 dark:from-green-950 dark:via-background dark:to-emerald-950/20 shadow-xl border-0 backdrop-blur-sm">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/20">
            <h3 className="text-xl font-semibold flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              Content
            </h3>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Bookmark
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          
          <CardContent 
            ref={contentRef}
            className="p-0 max-h-[70vh] overflow-y-auto"
          >
            <div className="p-12 prose prose-xl max-w-none dark:prose-invert prose-headings:text-green-800 dark:prose-headings:text-green-200 prose-p:text-green-700 dark:prose-p:text-green-300 prose-p:leading-relaxed prose-headings:font-bold">
              <div dangerouslySetInnerHTML={useSanitizedHtml(lesson.content || readingData?.content || '', 'trusted')} />
            </div>
          </CardContent>
          
          {/* Reading indicator */}
          {isReading && !isCompleted && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Reading...
            </div>
          )}
        </Card>
      </motion.div>

      {/* Completion Status and Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-card/80 to-card backdrop-blur-md shadow-xl border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isCompleted ? (
                  <>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-green-700 dark:text-green-300">Reading Complete!</h4>
                      <p className="text-muted-foreground">You've successfully finished this reading material</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 border-2 border-muted-foreground rounded-full flex items-center justify-center">
                      <Eye className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Keep Reading</h4>
                      <p className="text-muted-foreground">Scroll through the content to complete this lesson</p>
                    </div>
                  </>
                )}
              </div>
              
              {onNext && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={onNext} 
                    disabled={!isCompleted}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl disabled:opacity-50 min-w-40"
                  >
                    Continue Learning
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </div>
            
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20"
              >
                <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
                  <Star className="h-5 w-5" />
                  <span className="font-medium">Reading completed in {formatTime(readingTime)}! Excellent work!</span>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Resources */}
      {readingData?.resources && readingData.resources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20 shadow-xl border-0 backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-white" />
                </div>
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-4">
                {readingData.resources.map((resource: any, index: number) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-white/50 to-green-50/50 dark:from-black/20 dark:to-green-950/20 rounded-xl border border-green-200/50 dark:border-green-800/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800 dark:text-green-200">{resource.title}</h4>
                      <p className="text-sm text-green-600 dark:text-green-400">{resource.description}</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                      <Download className="h-4 w-4 mr-1" />
                      Access
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default StudentReadingRenderer;
