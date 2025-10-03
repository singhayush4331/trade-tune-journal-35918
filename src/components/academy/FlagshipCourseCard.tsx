
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Users, 
  Crown, 
  MessageCircle, 
  Play,
  Star,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type Course } from '@/services/academy-service';

interface FlagshipCourseCardProps {
  course: Course;
  onContactAdmin: () => void;
  variant?: 'default' | 'featured';
  isAcademyUser?: boolean;
}

const FlagshipCourseCard: React.FC<FlagshipCourseCardProps> = ({
  course,
  onContactAdmin,
  variant = 'default',
  isAcademyUser = false
}) => {
  const navigate = useNavigate();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleStartLearning = () => {
    console.log('FlagshipCourseCard: Start Learning clicked for course:', course.id);
    
    // FIXED: Academy users navigate to student viewer, others contact admin
    if (isAcademyUser) {
      console.log('FlagshipCourseCard: Academy user accessing course viewer');
      navigate(`/academy/course/${course.id}`);
    } else {
      console.log('FlagshipCourseCard: Non-academy user, showing contact admin');
      onContactAdmin();
    }
  };

  const handlePreview = () => {
    console.log('FlagshipCourseCard: Preview clicked for course:', course.id);
    
    // FIXED: Academy users can preview or access directly
    if (isAcademyUser) {
      navigate(`/academy/course/${course.id}`);
    } else {
      onContactAdmin();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-2 border-green-200 dark:border-green-800/50 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 dark:from-card dark:via-green-950/10 dark:to-emerald-950/10 shadow-lg hover:shadow-xl transition-all duration-300">
        {course.thumbnail_url && (
          <div className="relative aspect-video bg-gradient-to-r from-green-500 to-emerald-600 overflow-hidden">
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                <Crown className="h-3 w-3 mr-1" />
                Flagship Course
              </Badge>
            </div>
            <div className="absolute bottom-4 right-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform" onClick={handleStartLearning}>
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
            </div>
          </div>
        )}
        
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-300 dark:border-green-700">
                {course.difficulty_level}
              </Badge>
              <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700">
                {isAcademyUser ? 'Academy Access' : 'Premium'}
              </Badge>
            </div>
            {course.price > 0 && !isAcademyUser && (
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">₹{course.price}</span>
                <p className="text-xs text-muted-foreground">One-time</p>
              </div>
            )}
            {isAcademyUser && (
              <div className="text-right">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">Included</span>
                <p className="text-xs text-muted-foreground">Academy Access</p>
              </div>
            )}
          </div>
          
          <CardTitle className="text-xl mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {course.title}
          </CardTitle>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {course.description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Course Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground">{formatDuration(course.duration)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground">{course.instructor}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground">Advanced Trading</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground">Professional Level</span>
            </div>
          </div>

          {/* Course Features */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-green-700 dark:text-green-400 mb-2">What's Included:</h4>
            <div className="grid grid-cols-1 gap-1">
              {[
                'Comprehensive Trading Strategies',
                'Real-time Market Analysis',
                'Risk Management Techniques',
                'Portfolio Optimization',
                'Expert Mentorship Sessions'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Award className="h-2 w-2 text-white" />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {course.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                  {tag}
                </Badge>
              ))}
              {course.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                  +{course.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-green-200 dark:border-green-800/50">
            <Button 
              onClick={handleStartLearning}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Play className="h-4 w-4 mr-2" />
              {isAcademyUser ? 'Start Learning' : 'Get Access'}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20"
              onClick={handlePreview}
            >
              <Star className="h-4 w-4 mr-2" />
              {isAcademyUser ? 'Preview Course' : 'Learn More'}
            </Button>
          </div>

          {/* Contact Info */}
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              {isAcademyUser ? (
                <>Ready to start learning? <button className="text-green-600 dark:text-green-400 hover:underline" onClick={handleStartLearning}>Begin Course</button></>
              ) : (
                <>Need help? <button className="text-green-600 dark:text-green-400 hover:underline" onClick={onContactAdmin}>Contact Support</button></>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FlagshipCourseCard;
