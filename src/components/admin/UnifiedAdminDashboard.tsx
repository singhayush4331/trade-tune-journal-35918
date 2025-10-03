
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  GraduationCap,
  Award,
  Crown,
  Sparkles
} from 'lucide-react';
import { getAllCoursesAdmin } from '@/services/academy-service';
import { supabase } from '@/integrations/supabase/client';

const UnifiedAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    wigglyUsers: 0,
    academyUsers: 0,
    premiumUsers: 0,
    totalCourses: 0,
    publishedCourses: 0,
    trialCourses: 0,
    flagshipCourses: 0,
    batchCourses: 0,
    totalRevenue: 0,
    activeSubscriptions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Load course statistics
      const courses = await getAllCoursesAdmin();
      const batchCourses = courses.filter(course => 
        course.title.toLowerCase().includes('master class batch')
      );
      
      // Load user statistics
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*');
      
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles!inner(name, hierarchy_level)
        `);
      
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('status', 'active');

      // Calculate user categories
      const userRoleMap = new Map();
      userRoles?.forEach(ur => {
        if (!userRoleMap.has(ur.user_id)) {
          userRoleMap.set(ur.user_id, []);
        }
        userRoleMap.get(ur.user_id).push(ur.roles);
      });

      let wigglyUsers = 0;
      let academyUsers = 0;
      let premiumUsers = 0;

      profiles?.forEach(profile => {
        const roles = userRoleMap.get(profile.id) || [];
        const hasAcademyRole = roles.some(r => r.name === 'academy_student');
        const hasPremiumRole = roles.some(r => r.hierarchy_level >= 40);
        const hasWigglyRole = roles.some(r => r.name === 'wiggly_only' || r.hierarchy_level >= 30);

        if (hasAcademyRole) academyUsers++;
        if (hasPremiumRole) premiumUsers++;
        if (hasWigglyRole || (!hasAcademyRole && !hasPremiumRole)) wigglyUsers++;
      });

      // Calculate revenue
      const totalRevenue = courses
        .filter(c => c.status === 'published')
        .reduce((sum, c) => sum + (c.price || 0), 0);

      setStats({
        totalUsers: profiles?.length || 0,
        wigglyUsers,
        academyUsers,
        premiumUsers,
        totalCourses: courses.length,
        publishedCourses: courses.filter(c => c.status === 'published').length,
        trialCourses: courses.filter(c => c.status === 'trial').length,
        flagshipCourses: courses.filter(c => c.status === 'flagship').length,
        batchCourses: batchCourses.length,
        totalRevenue,
        activeSubscriptions: subscriptions?.length || 0
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Platform Overview</h2>
        <p className="text-muted-foreground">
          Combined statistics from Wiggly platform and Academy
        </p>
      </div>

      {/* User Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">User Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium dark:text-blue-400">Total Users</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.totalUsers}</p>
                </div>
                <Users className="h-12 w-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950/50 dark:to-green-900/50 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium dark:text-green-400">Academy Users</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.academyUsers}</p>
                </div>
                <GraduationCap className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-950/50 dark:to-purple-900/50 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 font-medium dark:text-purple-400">Premium Users</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.premiumUsers}</p>
                </div>
                <Crown className="h-12 w-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-950/50 dark:to-orange-900/50 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 font-medium dark:text-orange-400">Wiggly Users</p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{stats.wigglyUsers}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Academy Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 dark:from-indigo-950/50 dark:to-indigo-900/50 dark:border-indigo-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-600 font-medium dark:text-indigo-400">Total Courses</p>
                  <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{stats.totalCourses}</p>
                </div>
                <BookOpen className="h-12 w-12 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-950/50 dark:to-emerald-900/50 dark:border-emerald-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 font-medium dark:text-emerald-400">Published</p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{stats.publishedCourses}</p>
                </div>
                <Award className="h-12 w-12 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-950/50 dark:to-amber-900/50 dark:border-amber-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 font-medium dark:text-amber-400">Flagship</p>
                  <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.flagshipCourses}</p>
                </div>
                <Crown className="h-12 w-12 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 dark:from-teal-950/50 dark:to-teal-900/50 dark:border-teal-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-600 font-medium dark:text-teal-400">Batch Courses</p>
                  <p className="text-3xl font-bold text-teal-700 dark:text-teal-300">{stats.batchCourses}</p>
                </div>
                <Sparkles className="h-12 w-12 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revenue & Subscriptions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Revenue Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 dark:from-rose-950/50 dark:to-rose-900/50 dark:border-rose-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-600 font-medium dark:text-rose-400">Course Revenue</p>
                  <p className="text-3xl font-bold text-rose-700 dark:text-rose-300">₹{stats.totalRevenue}</p>
                </div>
                <DollarSign className="h-12 w-12 text-rose-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 dark:from-cyan-950/50 dark:to-cyan-900/50 dark:border-cyan-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-600 font-medium dark:text-cyan-400">Active Subscriptions</p>
                  <p className="text-3xl font-bold text-cyan-700 dark:text-cyan-300">{stats.activeSubscriptions}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAdminDashboard;
