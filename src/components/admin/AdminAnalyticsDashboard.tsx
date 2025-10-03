import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
  id: string;
  email: string | null;
  created_at: string;
}

interface UserAnalytics extends UserProfile {
  isAdmin: boolean;
  hasFreeAccess: boolean;
}

interface TradeData {
  id: string;
  pnl: number | null;
  date: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#9cafff'];

const AdminAnalyticsDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [tradeAnalytics, setTradeAnalytics] = useState<TradeData[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all profiles using our secure function
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      if (!profiles || profiles.length === 0) {
        console.warn('No profiles found');
        setTotalUsers(0);
        setActiveUsers(0);
        return;
      }
      
      setTotalUsers(profiles.length);
      setActiveUsers(profiles.filter(profile => profile.email).length);

      // Fetch trade data for revenue calculation
      const { data: trades, error: tradesError } = await supabase
        .from('trades')
        .select('id, pnl, date');
      
      if (tradesError) {
        console.error('Error fetching trades:', tradesError);
      } else {
        setTradeAnalytics(trades);
        const totalPnl = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
        setTotalRevenue(totalPnl);
      }

      // Enhanced user analysis with free access check
      const usersWithDetails = await Promise.all(profiles.map(async (profile) => {
        // Check if user is admin using secure function
        let isAdmin = false;
        try {
          const { data: adminData, error: adminError } = await supabase
            .rpc('is_admin_secure', { check_user_id: profile.id });
          
          if (!adminError) {
            isAdmin = Boolean(adminData);
          }
        } catch (error) {
          console.error('Error checking admin status for user:', profile.id, error);
        }
        
        // Check for free access using the correct parameter name
        let hasFreeAccess = false;
        try {
          const { data: freeAccessData, error: freeAccessError } = await supabase
            .rpc('has_free_access', { check_user_id: profile.id });
          
          if (!freeAccessError) {
            hasFreeAccess = Boolean(freeAccessData);
          }
        } catch (error) {
          console.error('Error checking free access for user:', profile.id, error);
        }

        return {
          id: profile.id,
          email: profile.email,
          created_at: profile.created_at,
          isAdmin,
          hasFreeAccess,
        };
      }));

      setUserActivity(usersWithDetails);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare data for the user type pie chart
  const userTypeData = [
    { name: 'Admin Users', value: userActivity.filter(user => user.isAdmin).length },
    { name: 'Free Access Users', value: userActivity.filter(user => user.hasFreeAccess).length },
    { name: 'Regular Users', value: userActivity.length - userActivity.filter(user => user.isAdmin || user.hasFreeAccess).length },
  ];

  // Prepare data for the monthly revenue bar chart
  const monthlyRevenueData = tradeAnalytics.reduce((acc: any, trade: TradeData) => {
    const month = new Date(trade.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += trade.pnl || 0;
    return acc;
  }, {});

  const revenueChartData = Object.keys(monthlyRevenueData).map(month => ({
    month,
    revenue: monthlyRevenueData[month],
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-blue-50 text-blue-900 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center"><Users className="mr-2 h-5 w-5" /> Total Users</CardTitle>
            <CardDescription>Total number of registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 text-green-900 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center"><TrendingUp className="mr-2 h-5 w-5" /> Active Users</CardTitle>
            <CardDescription>Number of users with verified emails</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 text-yellow-900 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center"><DollarSign className="mr-2 h-5 w-5" /> Total Revenue</CardTitle>
            <CardDescription>Total profit from all trades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">User Types</CardTitle>
            <CardDescription>Distribution of users by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {
                    userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col items-start">
              {userTypeData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Badge variant="secondary" style={{ backgroundColor: COLORS[index % COLORS.length] }}></Badge>
                  <span>{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Revenue</CardTitle>
            <CardDescription>Revenue trend over the months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;
