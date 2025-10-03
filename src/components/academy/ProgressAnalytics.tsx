
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  BookOpen,
  CheckCircle,
  BarChart3,
  Calendar
} from 'lucide-react';
import { CourseProgress } from '@/hooks/use-course-progress';

interface ProgressAnalyticsProps {
  progress: CourseProgress;
  estimatedTimeRemaining: number;
  averageTimePerLesson: number;
  completionStreak: number;
}

const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  progress,
  estimatedTimeRemaining,
  averageTimePerLesson,
  completionStreak
}) => {
  const completionRate = progress.totalLessons > 0 ? 
    (progress.completedLessons / progress.totalLessons) * 100 : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Overall Progress */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Progress</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
              {Math.round(completionRate)}%
            </div>
            <Progress value={completionRate} className="h-2" />
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              {progress.completedLessons} of {progress.totalLessons} completed
            </p>
          </CardContent>
        </Card>

        {/* Time Remaining */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">Time Left</span>
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100 mb-1">
              {formatTime(estimatedTimeRemaining)}
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              {formatTime(averageTimePerLesson)} avg per lesson
            </p>
          </CardContent>
        </Card>

        {/* Completion Streak */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Streak</span>
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">
              {completionStreak}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              consecutive days
            </p>
          </CardContent>
        </Card>

        {/* Performance Score */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-900 dark:text-orange-100">Score</span>
            </div>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-1">
              {Math.round(completionRate * 0.85 + 15)}
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              performance rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Badges */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Award className="h-4 w-4" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {progress.completedLessons >= 1 && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                First Lesson
              </Badge>
            )}
            {progress.completedLessons >= 5 && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <BookOpen className="h-3 w-3 mr-1" />
                Getting Started
              </Badge>
            )}
            {completionRate >= 50 && (
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <Target className="h-3 w-3 mr-1" />
                Halfway There
              </Badge>
            )}
            {completionStreak >= 3 && (
              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                <Calendar className="h-3 w-3 mr-1" />
                On Fire
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressAnalytics;
