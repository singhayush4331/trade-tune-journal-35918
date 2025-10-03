
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Star, Play, Lock, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Course } from '@/services/academy-service';

interface PremiumCourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onEnroll: (courseId: string) => void;
  onPreview: (courseId: string) => void;
  onContinue: (courseId: string) => void;
  viewMode: 'grid' | 'list';
  progress?: number;
  isLocked?: boolean;
}

const PremiumCourseCard: React.FC<PremiumCourseCardProps> = ({
  course,
  isEnrolled,
  onEnroll,
  onPreview,
  onContinue,
  viewMode,
  progress = 0,
  isLocked = false
}) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 dark:text-red-400 border-red-500/30';
      default: return 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-700 dark:text-slate-400 border-slate-500/30';
    }
  };

  const cardContent = (
    <>
      {/* Enhanced Thumbnail with Overlay Effects */}
      {course.thumbnail_url && (
        <div className="relative aspect-video overflow-hidden rounded-xl group-hover:rounded-lg transition-all duration-300">
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isLocked ? 'opacity-50 blur-sm' : 'group-hover:scale-110'
            }`}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Play Button with Premium Effect */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
              isLocked 
                ? 'bg-slate-900/80 border-2 border-slate-600/50' 
                : 'bg-white/90 border-2 border-white/50 hover:scale-110 hover:bg-white shadow-2xl'
            }`}>
              {isLocked ? (
                <Lock className="h-6 w-6 text-slate-400" />
              ) : (
                <Play className="h-6 w-6 text-primary ml-1" />
              )}
            </div>
          </div>

          {/* Floating Badges with Glassmorphism */}
          <div className="absolute top-4 left-4">
            <Badge className={`${getDifficultyColor(course.difficulty_level)} backdrop-blur-sm border`}>
              {course.difficulty_level}
            </Badge>
          </div>

          {/* Price/Lock Badge */}
          <div className="absolute top-4 right-4">
            {isLocked ? (
              <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30 backdrop-blur-sm">
                <Lock className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            ) : course.price > 0 ? (
              <Badge className="bg-gradient-to-r from-primary/20 to-purple-600/20 text-primary border-primary/30 backdrop-blur-sm font-semibold">
                ₹{course.price}
              </Badge>
            ) : (
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border-green-500/30 backdrop-blur-sm">
                Free
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <CardHeader className="space-y-4 p-6">
        {/* Rating and Status Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">4.8</span>
            </div>
          </div>
          {isEnrolled && !isLocked && (
            <Badge className="bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary border-primary/20">
              <TrendingUp className="h-3 w-3 mr-1" />
              Enrolled
            </Badge>
          )}
        </div>
        
        {/* Course Title */}
        <CardTitle className={`text-xl font-semibold leading-tight transition-colors duration-300 ${
          isLocked ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary'
        }`}>
          {course.title}
        </CardTitle>
        
        {/* Description */}
        <CardDescription className="text-sm line-clamp-2 leading-relaxed">
          {course.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6 pt-0">
        {/* Enhanced Course Meta */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-medium">{formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">{course.instructor}</span>
          </div>
        </div>

        {/* Enhanced Progress for Enrolled Users */}
        {isEnrolled && progress > 0 && !isLocked && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary font-semibold">{progress}%</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-2" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full opacity-50"></div>
            </div>
          </div>
        )}

        {/* Enhanced Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {course.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-gradient-to-r from-muted/50 to-muted/30 hover:from-primary/10 hover:to-purple-600/10 transition-all duration-300">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="outline" className="text-xs text-muted-foreground bg-gradient-to-r from-muted/50 to-muted/30">
                +{course.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Premium Lock Notice */}
        {isLocked && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-400">
              <Lock className="h-4 w-4" />
              <span className="font-medium">Premium course - upgrade to unlock</span>
            </div>
          </div>
        )}

        {/* Enhanced Action Buttons */}
        <div className="space-y-3">
          {isLocked ? (
            <>
              <Button 
                disabled 
                className="w-full bg-gradient-to-r from-muted to-muted/80 text-muted-foreground cursor-not-allowed"
                size="lg"
              >
                <Lock className="h-4 w-4 mr-2" />
                Course Locked
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300" 
                asChild
                size="lg"
              >
                <Link to="/subscription">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Upgrade to Access
                </Link>
              </Button>
            </>
          ) : (
            <>
              {isEnrolled ? (
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group" 
                  onClick={() => onContinue(course.id)}
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Continue Learning
                </Button>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300" 
                  onClick={() => onEnroll(course.id)}
                  size="lg"
                >
                  {course.price > 0 ? `Enroll - ₹${course.price}` : 'Enroll Free'}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full border-2 hover:bg-primary/5 backdrop-blur-sm transition-all duration-300 group" 
                onClick={() => onPreview(course.id)}
              >
                <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Preview Course
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </>
  );

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group"
      >
        <Card className={`overflow-hidden transition-all duration-500 hover:shadow-2xl backdrop-blur-sm ${
          isLocked ? 'opacity-80' : 'hover:border-primary/30'
        } flex bg-gradient-to-r from-card/80 to-card/60 border border-border/50`}>
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
          
          <div className="w-80 flex-shrink-0 relative">
            {cardContent}
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group"
    >
      <Card className={`overflow-hidden transition-all duration-500 hover:shadow-2xl backdrop-blur-sm relative ${
        isLocked ? 'opacity-85' : 'hover:border-primary/30'
      } bg-gradient-to-br from-card/90 to-card/70 border border-border/50`}>
        {/* Enhanced glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl -z-10"></div>
        <div className="relative z-10">
          {cardContent}
        </div>
      </Card>
    </motion.div>
  );
};

export default PremiumCourseCard;
