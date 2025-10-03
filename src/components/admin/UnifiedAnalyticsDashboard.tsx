
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  BookOpen,
  GraduationCap,
  Activity,
  Target,
  Crown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const UnifiedAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    userGrowth: [],
    platformDistribution: [],
    revenueData: [],
    conversionFunnel: [],
    courseEngagement: [],
    userJourneys: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load comprehensive analytics data
      const [
        profilesResult,
        userRolesResult,
        enrollmentsResult,
        subscriptionsResult,
        coursesResult,
        tradesResult
      ] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('user_roles').select(`
          user_id,
          assigned_at,
          roles (name, hierarchy_level)
        `),
        supabase.from('user_enrollments').select(`
          user_id,
          course_id,
          enrolled_at,
          progress,
          courses (title, price)
        `),
        supabase.from('subscriptions').select('*'),
        supabase.from('courses').select('*'),
        supabase.rpc('get_all_trades_for_admin')
      ]);

      const profiles = profilesResult.data || [];
      const userRoles = userRolesResult.data || [];
      const enrollments = enrollmentsResult.data || [];
      const subscriptions = subscriptionsResult.data || [];
      const courses = coursesResult.data || [];
      const trades = tradesResult.data || [];

      // Process user growth data
      const userGrowthData = processUserGrowth(profiles);
      
      // Process platform distribution
      const platformData = processPlatformDistribution(profiles, userRoles);
      
      // Process revenue data
      const revenueData = processRevenueData(subscriptions, enrollments);
      
      // Process conversion funnel
      const conversionData = processConversionFunnel(profiles, userRoles, enrollments, subscriptions);
      
      // Process course engagement
      const courseEngagementData = processCourseEngagement(enrollments, courses);
      
      // Process user journeys
      const userJourneyData = processUserJourneys(profiles, userRoles, enrollments, trades);

      setAnalytics({
        userGrowth: userGrowthData,
        platformDistribution: platformData,
        revenueData: revenueData,
        conversionFunnel: conversionData,
        courseEngagement: courseEngagementData,
        userJourneys: userJourneyData
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processUserGrowth = (profiles: any[]) => {
    const monthlyGrowth = {};
    
    profiles.forEach(profile => {
      const month = new Date(profile.created_at).toISOString().slice(0, 7);
      if (!monthlyGrowth[month]) {
        monthlyGrowth[month] = { month, total: 0, wiggly: 0, academy: 0 };
      }
      monthlyGrowth[month].total += 1;
    });

    return Object.values(monthlyGrowth).sort((a: any, b: any) => a.month.localeCompare(b.month));
  };

  const processPlatformDistribution = (profiles: any[], userRoles: any[]) => {
    const roleMap = new Map();
    userRoles.forEach(ur => {
      if (!roleMap.has(ur.user_id)) {
        roleMap.set(ur.user_id, []);
      }
      roleMap.get(ur.user_id).push(ur.roles);
    });

    let wigglyOnly = 0;
    let academyOnly = 0;
    let both = 0;
    let neither = 0;

    profiles.forEach(profile => {
      const roles = roleMap.get(profile.id) || [];
      const hasAcademy = roles.some((r: any) => r.name === 'academy_student');
      const hasWiggly = roles.some((r: any) => r.name === 'wiggly_only' || r.hierarchy_level >= 30);

      if (hasAcademy && hasWiggly) both++;
      else if (hasAcademy) academyOnly++;
      else if (hasWiggly) wigglyOnly++;
      else neither++;
    });

    return [
      { name: 'Academy Only', value: academyOnly, color: '#10B981' },
      { name: 'Wiggly Only', value: wigglyOnly, color: '#F59E0B' },
      { name: 'Both Platforms', value: both, color: '#8B5CF6' },
      { name: 'Neither', value: neither, color: '#6B7280' }
    ];
  };

  const processRevenueData = (subscriptions: any[], enrollments: any[]) => {
    const revenueByMonth = {};

    // Process subscription revenue
    subscriptions.forEach(sub => {
      const month = new Date(sub.created_at).toISOString().slice(0, 7);
      if (!revenueByMonth[month]) {
        revenueByMonth[month] = { month, subscriptions: 0, courses: 0, total: 0 };
      }
      revenueByMonth[month].subscriptions += parseFloat(sub.amount || 0);
    });

    // Process course revenue
    enrollments.forEach(enrollment => {
      const month = new Date(enrollment.enrolled_at).toISOString().slice(0, 7);
      if (!revenueByMonth[month]) {
        revenueByMonth[month] = { month, subscriptions: 0, courses: 0, total: 0 };
      }
      revenueByMonth[month].courses += parseFloat(enrollment.courses?.price || 0);
    });

    // Calculate totals
    Object.values(revenueByMonth).forEach((data: any) => {
      data.total = data.subscriptions + data.courses;
    });

    return Object.values(revenueByMonth).sort((a: any, b: any) => a.month.localeCompare(b.month));
  };

  const processConversionFunnel = (profiles: any[], userRoles: any[], enrollments: any[], subscriptions: any[]) => {
    const totalUsers = profiles.length;
    const academyUsers = new Set();
    const premiumUsers = new Set();
    const subscribedUsers = new Set();

    userRoles.forEach(ur => {
      if (ur.roles?.name === 'academy_student') {
        academyUsers.add(ur.user_id);
      }
      if (ur.roles?.hierarchy_level >= 40) {
        premiumUsers.add(ur.user_id);
      }
    });

    subscriptions.forEach(sub => {
      if (sub.status === 'active') {
        subscribedUsers.add(sub.user_id);
      }
    });

    return [
      { stage: 'Total Users', count: totalUsers, percentage: 100 },
      { stage: 'Academy Users', count: academyUsers.size, percentage: (academyUsers.size / totalUsers * 100) },
      { stage: 'Premium Users', count: premiumUsers.size, percentage: (premiumUsers.size / totalUsers * 100) },
      { stage: 'Active Subscribers', count: subscribedUsers.size, percentage: (subscribedUsers.size / totalUsers * 100) }
    ];
  };

  const processCourseEngagement = (enrollments: any[], courses: any[]) => {
    const courseStats = {};

    enrollments.forEach(enrollment => {
      const courseId = enrollment.course_id;
      if (!courseStats[courseId]) {
        courseStats[courseId] = {
          title: enrollment.courses?.title || 'Unknown Course',
          enrollments: 0,
          avgProgress: 0,
          totalProgress: 0
        };
      }
      courseStats[courseId].enrollments += 1;
      courseStats[courseId].totalProgress += enrollment.progress || 0;
    });

    return Object.values(courseStats).map((stats: any) => ({
      ...stats,
      avgProgress: stats.enrollments > 0 ? stats.totalProgress / stats.enrollments : 0
    }));
  };

  const processUserJourneys = (profiles: any[], userRoles: any[], enrollments: any[], trades: any[]) => {
    const journeyStages = {
      'New User': 0,
      'Wiggly User': 0,
      'Academy Student': 0,
      'Premium User': 0,
      'Active Trader': 0
    };

    const userRoleMap = new Map();
    userRoles.forEach(ur => {
      if (!userRoleMap.has(ur.user_id)) {
        userRoleMap.set(ur.user_id, []);
      }
      userRoleMap.get(ur.user_id).push(ur.roles);
    });

    const traderUsers = new Set(trades.map(trade => trade.user_id));

    profiles.forEach(profile => {
      const roles = userRoleMap.get(profile.id) || [];
      const hasAcademy = roles.some((r: any) => r.name === 'academy_student');
      const hasPremium = roles.some((r: any) => r.hierarchy_level >= 40);
      const hasWiggly = roles.some((r: any) => r.name === 'wiggly_only' || r.hierarchy_level >= 30);
      const isTrader = traderUsers.has(profile.id);

      if (isTrader) journeyStages['Active Trader']++;
      else if (hasPremium) journeyStages['Premium User']++;
      else if (hasAcademy) journeyStages['Academy Student']++;
      else if (hasWiggly) journeyStages['Wiggly User']++;
      else journeyStages['New User']++;
    });

    return Object.entries(journeyStages).map(([stage, count]) => ({ stage, count }));
  };

  const COLORS = ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#3B82F6'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{analytics.platformDistribution.reduce((acc, item) => acc + item.value, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Academy Users</p>
                <p className="text-3xl font-bold text-green-600">
                  {analytics.platformDistribution.find(item => item.name === 'Academy Only')?.value || 0}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cross-Platform</p>
                <p className="text-3xl font-bold text-purple-600">
                  {analytics.platformDistribution.find(item => item.name === 'Both Platforms')?.value || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-emerald-600">
                  ₹{analytics.revenueData.reduce((acc, item) => acc + item.total, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.platformDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.platformDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Journey Stages</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.userJourneys}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Users" />
                  <Line type="monotone" dataKey="wiggly" stroke="#82ca9d" name="Wiggly Users" />
                  <Line type="monotone" dataKey="academy" stroke="#ffc658" name="Academy Users" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="subscriptions" stackId="a" fill="#8884d8" name="Subscriptions" />
                  <Bar dataKey="courses" stackId="a" fill="#82ca9d" name="Courses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.courseEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrollments" fill="#8884d8" name="Enrollments" />
                  <Bar dataKey="avgProgress" fill="#82ca9d" name="Avg Progress %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.conversionFunnel.map((stage, index) => (
                  <div key={stage.stage} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{stage.stage}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-64 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${stage.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {stage.count} ({stage.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedAnalyticsDashboard;
