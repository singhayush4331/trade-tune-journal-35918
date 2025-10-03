
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Play, Star, Gift, Sparkles, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Course } from '@/services/academy-service';
import YouTubeVideoBackground from './YouTubeVideoBackground';

interface TrialCourseAccessProps {
  course: Course;
  onEnroll: (courseId: string) => void;
  onPreview: (courseId: string) => void;
  isEnrolled: boolean;
  variant?: 'default' | 'featured';
}

const TrialCourseAccess: React.FC<TrialCourseAccessProps> = ({
  course,
  onEnroll,
  onPreview,
  isEnrolled,
  variant = 'default'
}) => {
  const navigate = useNavigate();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-gradient-to-r from-green-600/20 to-teal-500/20 text-green-700 dark:text-green-400 border-green-600/30';
      case 'advanced': return 'bg-gradient-to-r from-emerald-500/20 to-green-600/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      default: return 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-700 dark:text-slate-400 border-slate-500/30';
    }
  };

  const isFeatured = variant === 'featured';
  const cardClasses = isFeatured 
    ? "group relative w-full max-w-md mx-auto" 
    : "group relative max-w-sm mx-auto";

  // FIXED: Navigate directly to student course viewer for trial courses
  const handleStartLearning = () => {
    console.log('TrialCourseAccess: Starting course directly:', course.id);
    navigate(`/academy/course/${course.id}`);
  };

  const handleVideoClick = () => {
    console.log('TrialCourseAccess: Video clicked, starting course:', course.id);
    handleStartLearning();
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: isFeatured ? 1.02 : 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cardClasses}
    >
      {/* Premium Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl -z-10"></div>
      
      <Card className={`overflow-hidden transition-all duration-500 hover:shadow-xl backdrop-blur-sm border border-green-500/30 bg-gradient-to-br from-card/90 to-green-50/10 dark:to-green-900/10 relative ${isFeatured ? 'h-full' : ''}`}>
        {/* Trial Header */}
        <div className={`bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 relative overflow-hidden ${isFeatured ? 'p-4' : 'p-3'}`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3)_0%,transparent_50%)]"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`rounded-full bg-white/20 backdrop-blur-sm ${isFeatured ? 'p-2' : 'p-1.5'}`}>
                <Play className={`text-white ${isFeatured ? 'h-5 w-5' : 'h-4 w-4'}`} />
              </div>
              <div>
                <span className={`font-bold text-white ${isFeatured ? 'text-base' : 'text-sm'}`}>Free Access</span>
                <div className="flex items-center gap-1">
                  <Sparkles className={`text-white/80 ${isFeatured ? 'h-4 w-4' : 'h-3 w-3'}`} />
                  <span className={`text-white/90 font-medium ${isFeatured ? 'text-sm' : 'text-xs'}`}>Start Learning Now</span>
                </div>
              </div>
            </div>
            <Badge className={`bg-white/20 text-white font-semibold backdrop-blur-sm border border-white/30 ${isFeatured ? 'text-sm px-3 py-1.5' : 'text-xs px-2 py-1'}`}>
              Free
            </Badge>
          </div>
        </div>

        {/* Course Media - Video or Thumbnail */}
        <div className={`relative overflow-hidden ${isFeatured ? 'aspect-video' : 'aspect-video'}`}>
          {course.intro_video_url ? (
            <YouTubeVideoBackground
              videoUrl={course.intro_video_url}
              title={course.title}
              thumbnailUrl={course.thumbnail_url}
              onPlayClick={handleVideoClick}
              className="w-full h-full"
            />
          ) : course.thumbnail_url ? (
            <div className="relative w-full h-full">
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className={`rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 backdrop-blur-sm cursor-pointer ${isFeatured ? 'w-16 h-16' : 'w-12 h-12'}`} onClick={handleVideoClick}>
                  <Play className={`text-white ml-0.5 ${isFeatured ? 'h-6 w-6' : 'h-5 w-5'}`} />
                </div>
              </div>
            </div>
          ) : null}

          {/* Floating Rating Badge */}
          <div className="absolute top-3 left-3 z-30">
            <div className={`flex items-center gap-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 ${isFeatured ? 'px-3 py-1.5' : 'px-2 py-1'}`}>
              <Star className={`text-green-500 fill-current ${isFeatured ? 'h-4 w-4' : 'h-3 w-3'}`} />
              <span className={`font-semibold text-green-700 dark:text-green-400 ${isFeatured ? 'text-sm' : 'text-xs'}`}>4.9</span>
            </div>
          </div>

          {/* Free Badge */}
          <div className="absolute top-3 right-3 z-30">
            <Badge className={`bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border-green-500/30 backdrop-blur-sm ${isFeatured ? 'text-sm' : 'text-xs'}`}>
              <Play className={`mr-1 ${isFeatured ? 'h-4 w-4' : 'h-3 w-3'}`} />
              Free
            </Badge>
          </div>
        </div>
        
        <CardHeader className={`space-y-3 ${isFeatured ? 'p-6' : 'p-4'}`}>
          <div className="flex justify-between items-start">
            <Badge className={`${getDifficultyColor(course.difficulty_level)} backdrop-blur-sm border ${isFeatured ? 'text-sm' : 'text-xs'}`}>
              {course.difficulty_level}
            </Badge>
            <div className="text-right">
              <Badge className={`bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border-green-500/30 ${isFeatured ? 'text-sm' : 'text-xs'}`}>
                Free Access
              </Badge>
            </div>
          </div>
          
          <CardTitle className={`font-semibold leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text transition-all duration-300 ${isFeatured ? 'text-xl' : 'text-lg'}`}>
            {course.title}
          </CardTitle>
          
          <CardDescription className={`line-clamp-2 leading-relaxed ${isFeatured ? 'text-base' : 'text-sm'}`}>
            {course.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className={`space-y-4 pt-0 ${isFeatured ? 'p-6' : 'p-4'}`}>
          {/* Course Stats */}
          <div className={`flex items-center justify-between ${isFeatured ? 'text-base' : 'text-sm'}`}>
            <div className={`flex items-center gap-2 rounded-full bg-gradient-to-r from-muted/50 to-muted/30 ${isFeatured ? 'px-3 py-2' : 'px-2 py-1'}`}>
              <Clock className={`text-green-600 ${isFeatured ? 'h-4 w-4' : 'h-3 w-3'}`} />
              <span className={`font-medium ${isFeatured ? 'text-sm' : 'text-xs'}`}>{formatDuration(course.duration)}</span>
            </div>
            <div className={`flex items-center gap-2 rounded-full bg-gradient-to-r from-muted/50 to-muted/30 ${isFeatured ? 'px-3 py-2' : 'px-2 py-1'}`}>
              <Users className={`text-green-600 ${isFeatured ? 'h-4 w-4' : 'h-3 w-3'}`} />
              <span className={`font-medium ${isFeatured ? 'text-sm' : 'text-xs'}`}>{course.instructor}</span>
            </div>
          </div>

          {/* Course Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {course.tags.slice(0, isFeatured ? 3 : 2).map((tag) => (
                <Badge key={tag} variant="outline" className={`bg-gradient-to-r from-muted/50 to-muted/30 hover:from-green-500/10 hover:to-emerald-500/10 transition-all duration-300 ${isFeatured ? 'text-sm px-3 py-1' : 'text-xs px-2 py-0.5'}`}>
                  {tag}
                </Badge>
              ))}
              {course.tags.length > (isFeatured ? 3 : 2) && (
                <Badge variant="outline" className={`text-muted-foreground bg-gradient-to-r from-muted/50 to-muted/30 ${isFeatured ? 'text-sm px-3 py-1' : 'text-xs px-2 py-0.5'}`}>
                  +{course.tags.length - (isFeatured ? 3 : 2)}
                </Badge>
              )}
            </div>
          )}

          {/* Free Access Benefits */}
          <div className={`rounded-lg bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/20 backdrop-blur-sm ${isFeatured ? 'p-4' : 'p-3'}`}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className={`text-green-600 ${isFeatured ? 'h-4 w-4' : 'h-3 w-3'}`} />
                <h4 className={`font-semibold text-green-700 dark:text-green-400 ${isFeatured ? 'text-sm' : 'text-xs'}`}>What You Get for Free</h4>
              </div>
              <div className={`grid gap-2 ${isFeatured ? 'grid-cols-2 text-sm' : 'grid-cols-2 text-xs'}`}>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <span className="text-muted-foreground">Complete Access</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <span className="text-muted-foreground">All Materials</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <span className="text-muted-foreground">No Time Limit</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <span className="text-muted-foreground">Certificate Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group ${isFeatured ? 'text-base py-3' : 'text-sm'}`} 
              onClick={handleStartLearning}
              size={isFeatured ? "default" : "sm"}
            >
              <Play className={`mr-2 group-hover:scale-110 transition-transform ${isFeatured ? 'h-4 w-4' : 'h-3 w-3'}`} />
              Start Learning
            </Button>
            <Button 
              variant="outline" 
              className={`w-full border-2 border-green-500/30 hover:bg-green-500/5 backdrop-blur-sm transition-all duration-300 ${isFeatured ? 'text-base py-3' : 'text-sm'}`} 
              onClick={() => navigate('/subscription')}
              size={isFeatured ? "default" : "sm"}
            >
              <Crown className={`mr-2 ${isFeatured ? 'h-4 w-4' : 'h-3 w-3'}`} />
              Unlock More Courses
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrialCourseAccess;
