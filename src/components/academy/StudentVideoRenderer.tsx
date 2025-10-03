
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  Video, 
  Clock, 
  Play, 
  CheckCircle,
  Star,
  Trophy,
  Target,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import VideoPlayer from './VideoPlayer';

interface StudentVideoRendererProps {
  lesson: any;
  onComplete?: () => void;
  onNext?: () => void;
  onProgressUpdate?: (progress: number, watchTime: number) => void;
}

const StudentVideoRenderer: React.FC<StudentVideoRendererProps> = ({ 
  lesson, 
  onComplete, 
  onNext,
  onProgressUpdate 
}) => {
  const [watchProgress, setWatchProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleVideoProgress = (progress: number, watchTime: number) => {
    setWatchProgress(progress);
    onProgressUpdate?.(progress, watchTime);
    
    if (progress >= 90 && !isCompleted) {
      setIsCompleted(true);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  if (!lesson) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20 border-0 shadow-2xl backdrop-blur-sm">
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
              <Video className="h-10 w-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Loading Your Video Lesson
            </h3>
            <p className="text-muted-foreground text-lg">Preparing an amazing learning experience...</p>
            <div className="mt-6 w-48 mx-auto">
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Enhanced Video Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border-0 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-full blur-3xl"></div>
          
          <CardHeader className="relative z-10 pb-8">
            <div className="flex items-start gap-6">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-white/20"
              >
                <Video className="h-8 w-8 text-white" />
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
                    <Video className="h-4 w-4 mr-2" />
                    Video Lesson
                  </Badge>
                  
                  {lesson.duration && (
                    <div className="flex items-center gap-2 text-muted-foreground bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')} minutes</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-muted-foreground bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">Interactive Content</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Watch Progress */}
            {watchProgress > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-3"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Play className="h-4 w-4" />
                    Watch Progress
                  </span>
                  <span className="font-bold">{Math.round(watchProgress)}%</span>
                </div>
                <Progress value={watchProgress} className="h-3 bg-white/20" />
                {watchProgress >= 90 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Almost done! Great progress!
                  </motion.div>
                )}
              </motion.div>
            )}
          </CardHeader>
        </Card>
      </motion.div>

      {/* Enhanced Video Player */}
      {lesson.video_url ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="overflow-hidden shadow-2xl bg-black/5 dark:bg-white/5 backdrop-blur-sm border-0">
            <div className="relative group">
              <VideoPlayer
                videoUrl={lesson.video_url}
                title={lesson.title}
                onProgressUpdate={handleVideoProgress}
                onComplete={handleComplete}
              />
              
              {/* Floating overlay for completed state */}
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  <span className="font-medium">Completed!</span>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20 border-green-200/50 dark:border-green-800/50 shadow-xl">
            <CardContent className="py-20 text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 3, -3, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <Play className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 text-green-800 dark:text-green-200">Video Coming Soon</h3>
              <p className="text-green-700 dark:text-green-300 text-lg mb-6">This lesson's video content is being prepared. Check back soon for an amazing learning experience!</p>
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Coming Soon
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Enhanced Lesson Notes */}
      {lesson.content && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/50 dark:via-background dark:to-emerald-950/20 shadow-xl border-0 backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/20">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                Lesson Notes & Key Points
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-green-800 dark:prose-headings:text-green-200 prose-p:text-green-700 dark:prose-p:text-green-300">
                <div className="whitespace-pre-wrap leading-relaxed">{lesson.content}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Enhanced Navigation */}
      {onNext && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-card/80 to-card backdrop-blur-md shadow-xl border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">Ready for the next lesson?</h4>
                  <p className="text-muted-foreground">Continue your learning journey</p>
                </div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={onNext} 
                    size="lg"
                    className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white shadow-xl min-w-40 h-12 text-base font-medium"
                  >
                    Continue Learning
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </motion.div>
              </div>
              
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20"
                >
                  <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
                    <Star className="h-5 w-5" />
                    <span className="font-medium">Lesson completed! You're making great progress!</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default StudentVideoRenderer;
