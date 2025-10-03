import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { formatIndianCurrency } from '@/lib/utils';
import { 
  Users, 
  User, 
  Calendar, 
  Loader2, 
  BarChart3, 
  Clock, 
  Search, 
  TrendingUp, 
  SlidersHorizontal,
  AlertCircle,
  ArrowUpDown,
  ExternalLink,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Activity,
  RefreshCw
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';

import UserDetailDialog from './UserDetailDialog';

interface UserAnalytics {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  last_active: string | null;
  trade_count: number;
  playbook_count: number;
  last_trade: string | null;
  win_rate: number | null;
  isAdmin: boolean;
  hasFreeAccess: boolean;
  subscriptionStatus: string;
  totalPnl: number | null;
  avgTradeRating: number | null;
}

interface UserFilter {
  search: string;
  sortBy: 'activity' | 'trades' | 'date' | 'pnl';
  sortOrder: 'asc' | 'desc';
  activityFilter: 'all' | 'active' | 'inactive';
}

const ACTIVITY_THRESHOLD_DAYS = 30; // Users inactive for more than 30 days are considered inactive

const UserActivityAnalytics = () => {
  const [users, setUsers] = useState<UserAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilter>({
    search: '',
    sortBy: 'activity',
    sortOrder: 'desc',
    activityFilter: 'all'
  });

  const [selectedUser, setSelectedUser] = useState<UserAnalytics | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Date range states for charts
  const [dateRange, setDateRange] = useState<'30d' | '90d' | '180d' | 'all'>('90d');
  const [joinedUsersData, setJoinedUsersData] = useState<any[]>([]);
  const [activeUsersData, setActiveUsersData] = useState<any[]>([]);

  useEffect(() => {
    fetchUserActivity();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      generateChartData();
    }
  }, [users, dateRange]);

  const fetchUserActivity = async () => {
    try {
      setIsLoading(true);
      
      // 1. Fetch all user profiles
      console.log("Fetching user profiles...");
      const { data: profiles, error: profilesError } = await supabase
        .rpc('get_all_profiles_for_admin');
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      console.log("Profiles fetched:", profiles?.length || 0);

      if (!profiles || profiles.length === 0) {
        setUsers([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      // 2. Fetch all trades to calculate metrics per user
      console.log("Fetching trades for user metrics...");
      const { data: trades, error: tradesError } = await supabase
        .rpc('get_all_trades_for_admin');
      
      if (tradesError) {
        console.error("Error fetching trades:", tradesError);
        // Continue with available data
      }
      
      console.log("Trades fetched:", trades?.length || 0, trades);

      // 3. Fetch all playbooks
      console.log("Fetching playbooks for user metrics...");
      const { data: playbooks, error: playbooksError } = await supabase
        .rpc('get_all_playbooks_for_admin');
      
      if (playbooksError) {
        console.error("Error fetching playbooks:", playbooksError);
        // Continue with available data
      }
      
      console.log("Playbooks fetched:", playbooks?.length || 0);

      // 4. Build user analytics by combining all data
      console.log("Building user analytics data...");
      const usersAnalytics: UserAnalytics[] = await Promise.all(profiles.map(async (profile) => {
        // Find all trades by this user
        console.log(`Processing user ${profile.id}`);
        const userTrades = trades?.filter(trade => trade.user_id === profile.id) || [];
        console.log(`User ${profile.id} has ${userTrades.length} trades`);
        
        // Find all playbooks by this user
        const userPlaybooks = playbooks?.filter(playbook => playbook.user_id === profile.id) || [];
        console.log(`User ${profile.id} has ${userPlaybooks.length} playbooks`);
        
        // Find latest activity (trade or playbook)
        let lastActive = null;
        if (userTrades.length > 0 || userPlaybooks.length > 0) {
          const latestTradeDate = userTrades.length > 0 
            ? Math.max(...userTrades.map(t => new Date(t.created_at).getTime()))
            : 0;
            
          const latestPlaybookDate = userPlaybooks.length > 0
            ? Math.max(...userPlaybooks.map(p => new Date(p.created_at).getTime()))
            : 0;
            
          lastActive = new Date(Math.max(latestTradeDate, latestPlaybookDate)).toISOString();
        }

        // Calculate win rate
        const winningTrades = userTrades.filter(trade => trade.pnl != null && trade.pnl > 0).length;
        const winRate = userTrades.length > 0 ? (winningTrades / userTrades.length) * 100 : null;
        console.log(`User ${profile.id} win rate: ${winRate}`);
        
        // Calculate total PnL
        const totalPnl = userTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
        console.log(`User ${profile.id} total PnL: ${totalPnl}`);
        
        // Calculate average trade rating (avg of setup, execution, management)
        let avgRating = null;
        if (userTrades.length > 0) {
          const validRatings = userTrades.filter(trade => 
            trade.setup_rating !== null || 
            trade.execution_rating !== null || 
            trade.management_rating !== null
          );
          
          if (validRatings.length > 0) {
            let totalRatings = 0;
            let ratingCount = 0;
            
            validRatings.forEach(trade => {
              if (trade.setup_rating !== null) {
                totalRatings += trade.setup_rating;
                ratingCount++;
              }
              if (trade.execution_rating !== null) {
                totalRatings += trade.execution_rating;
                ratingCount++;
              }
              if (trade.management_rating !== null) {
                totalRatings += trade.management_rating;
                ratingCount++;
              }
            });
            
            avgRating = ratingCount > 0 ? totalRatings / ratingCount : null;
          }
        }

        // Check if user has admin role
        const { data: isAdmin, error: adminError } = await supabase
          .rpc('is_admin_secure', { check_user_id: profile.id });
        
        if (adminError) console.error("Error checking admin role:", adminError);
        
        // Check if user has free access
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

        // Check subscription status
        const { data: subscriptions, error: subError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        const subscriptionStatus = subscriptions && subscriptions.length > 0 
          ? subscriptions[0].status 
          : 'none';

        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          created_at: profile.created_at,
          last_active: lastActive,
          trade_count: userTrades.length,
          playbook_count: userPlaybooks.length,
          last_trade: userTrades.length > 0 
            ? userTrades.sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )[0].created_at 
            : null,
          win_rate: winRate,
          isAdmin: isAdmin || false,
          hasFreeAccess: hasFreeAccess || false,
          subscriptionStatus,
          totalPnl,
          avgTradeRating: avgRating
        };
      }));

      console.log("User analytics data built:", usersAnalytics.length, usersAnalytics);
      setUsers(usersAnalytics);

      // Generate chart data once users are loaded
      generateChartData();
      
      toast.success("User analytics data loaded successfully");

    } catch (err: any) {
      console.error("Error in fetchUserActivity:", err);
      setError("Failed to load user activity data");
      toast.error("Error loading user activity");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const generateChartData = () => {
    // Determine date range for charts
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '180d':
        startDate.setDate(now.getDate() - 180);
        break;
      case 'all':
        // Find earliest user registration
        if (users.length > 0) {
          const earliest = users.reduce((earliest, user) => {
            const date = new Date(user.created_at);
            return date < earliest ? date : earliest;
          }, new Date());
          startDate = earliest;
        } else {
          startDate.setFullYear(now.getFullYear() - 1);
        }
        break;
    }

    // Generate date points for charts
    const dateDiffDays = differenceInDays(now, startDate);
    const datePoints: string[] = [];
    
    for (let i = 0; i <= dateDiffDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      datePoints.push(format(date, 'yyyy-MM-dd'));
    }

    // Generate joined users data
    const joinedData = datePoints.map(date => {
      const count = users.filter(user => {
        const createdDate = format(new Date(user.created_at), 'yyyy-MM-dd');
        return createdDate === date;
      }).length;

      return {
        date,
        count,
      };
    });

    // Generate active users data (users who made a trade or playbook on that day)
    const activeData = datePoints.map(date => {
      const activeCount = users.filter(user => {
        if (!user.last_active) return false;
        const lastActiveDate = format(new Date(user.last_active), 'yyyy-MM-dd');
        return lastActiveDate === date;
      }).length;

      return {
        date,
        count: activeCount,
      };
    });

    // Set chart data
    setJoinedUsersData(joinedData);
    setActiveUsersData(activeData);
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      // Apply search filter
      const searchMatch = 
        (user.email?.toLowerCase().includes(filters.search.toLowerCase()) || 
        user.full_name?.toLowerCase().includes(filters.search.toLowerCase()));
      
      // Apply activity filter
      let activityMatch = true;
      if (filters.activityFilter !== 'all') {
        const isActive = user.last_active 
          ? differenceInDays(new Date(), new Date(user.last_active)) < ACTIVITY_THRESHOLD_DAYS
          : false;
        
        activityMatch = (filters.activityFilter === 'active' && isActive) || 
                        (filters.activityFilter === 'inactive' && !isActive);
      }

      return searchMatch && activityMatch;
    }).sort((a, b) => {
      // Apply sorting
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'activity':
          // Sort by last active date
          const dateA = a.last_active ? new Date(a.last_active).getTime() : 0;
          const dateB = b.last_active ? new Date(b.last_active).getTime() : 0;
          comparison = dateB - dateA;  // Default to most recent first
          break;
        
        case 'trades':
          // Sort by trade count
          comparison = b.trade_count - a.trade_count;  // Default to highest count first
          break;
        
        case 'date':
          // Sort by join date
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        
        case 'pnl':
          // Sort by total PnL
          const pnlA = a.totalPnl || 0;
          const pnlB = b.totalPnl || 0;
          comparison = pnlB - pnlA;  // Default to highest PnL first
          break;
      }
      
      // Reverse comparison if sort order is ascending
      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });
  };

  const handleSort = (sortBy: UserFilter['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const days = differenceInDays(new Date(), date);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    return format(date, 'MMM d, yyyy');
  };
  
  const getActivityStatus = (lastActiveDate: string | null) => {
    if (!lastActiveDate) return 'inactive';
    
    const daysSinceActive = differenceInDays(new Date(), new Date(lastActiveDate));
    
    if (daysSinceActive <= 7) return 'very-active';
    if (daysSinceActive <= 30) return 'active';
    if (daysSinceActive <= 90) return 'semi-active';
    return 'inactive';
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'very-active': return 'bg-green-500';
      case 'active': return 'bg-emerald-400';
      case 'semi-active': return 'bg-amber-400';
      case 'inactive': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };
  
  const openUserDetail = (user: UserAnalytics) => {
    console.log("Opening user detail dialog for:", user);
    setSelectedUser(user);
    setUserDetailOpen(true);
  };

  // Calculate user activity segments
  const veryActiveUsers = users.filter(u => 
    u.last_active && differenceInDays(new Date(), new Date(u.last_active)) <= 7
  ).length;
  
  const activeUsers = users.filter(u => 
    u.last_active && 
    differenceInDays(new Date(), new Date(u.last_active)) > 7 &&
    differenceInDays(new Date(), new Date(u.last_active)) <= 30
  ).length;
  
  const semiActiveUsers = users.filter(u => 
    u.last_active && 
    differenceInDays(new Date(), new Date(u.last_active)) > 30 &&
    differenceInDays(new Date(), new Date(u.last_active)) <= 90
  ).length;
  
  const inactiveUsers = users.filter(u => 
    !u.last_active || differenceInDays(new Date(), new Date(u.last_active)) > 90
  ).length;

  const activitySegments = [
    { name: 'Very Active (7d)', value: veryActiveUsers, color: '#22c55e' },
    { name: 'Active (30d)', value: activeUsers, color: '#34d399' },
    { name: 'Semi-Active (90d)', value: semiActiveUsers, color: '#fbbf24' },
    { name: 'Inactive', value: inactiveUsers, color: '#9ca3af' }
  ];

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button 
            onClick={fetchUserActivity} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const filteredUsers = getFilteredUsers();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{veryActiveUsers + activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((veryActiveUsers + activeUsers) / (users.length || 1) * 100)}% of total users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.length > 0 
                ? Math.round(users.reduce((sum, user) => sum + user.trade_count, 0) / users.length) 
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per user
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.some(user => user.avgTradeRating !== null)
                ? (users.reduce((sum, user) => sum + (user.avgTradeRating || 0), 0) / 
                   users.filter(user => user.avgTradeRating !== null).length).toFixed(1)
                : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average trade quality rating
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Registrations</CardTitle>
            <CardDescription>New user sign-ups over time</CardDescription>
            
            <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="180d">Last 180 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {joinedUsersData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={joinedUsersData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                      interval={Math.floor(joinedUsersData.length / 10)}
                    />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value: any) => [`${value} new users`, 'Sign-ups']}
                      labelFormatter={(label) => format(parseISO(label), 'MMMM d, yyyy')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      name="New Users" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No registration data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Activity Segments</CardTitle>
            <CardDescription>Distribution of user engagement levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {users.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activitySegments}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value: any) => [`${value} users`, 'Count']}
                    />
                    <Bar 
                      dataKey="value" 
                      name="Users"
                      fill="#6366f1" 
                      radius={[4, 4, 0, 0]}
                    >
                      {activitySegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No user segment data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>User Activity Dashboard</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchUserActivity}
              disabled={isRefreshing}
              className="h-8"
            >
              {isRefreshing ? (
                <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
              )}
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
          </CardTitle>
          <CardDescription>
            Detailed analytics on user engagement and activity
          </CardDescription>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <Select 
              value={filters.activityFilter}
              onValueChange={(value: any) => setFilters(prev => ({ ...prev, activityFilter: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active Users (30d)</SelectItem>
                <SelectItem value="inactive">Inactive Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('activity')}>
                      Last Activity
                      {filters.sortBy === 'activity' && (
                        <ArrowUpDown className={`h-4 w-4 ${filters.sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('trades')}>
                      Trades
                      {filters.sortBy === 'trades' && (
                        <ArrowUpDown className={`h-4 w-4 ${filters.sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Playbooks</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('date')}>
                      Join Date
                      {filters.sortBy === 'date' && (
                        <ArrowUpDown className={`h-4 w-4 ${filters.sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('pnl')}>
                      Total PnL
                      {filters.sortBy === 'pnl' && (
                        <ArrowUpDown className={`h-4 w-4 ${filters.sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No users found matching the filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const activityStatus = getActivityStatus(user.last_active);
                    return (
                      <TableRow key={user.id} className="group">
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className={`w-3 h-3 mt-1.5 rounded-full ${getStatusColor(activityStatus)}`} />
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {user.full_name || 'Unnamed User'}
                                {user.isAdmin && <Badge variant="default" className="ml-1">Admin</Badge>}
                                {user.hasFreeAccess && <Badge variant="secondary">Free</Badge>}
                              </div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {formatDate(user.last_active)}
                              </TooltipTrigger>
                              <TooltipContent>
                                {user.last_active 
                                  ? format(new Date(user.last_active), 'PPpp')
                                  : 'No recorded activity'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>{user.trade_count}</TableCell>
                        <TableCell>{user.playbook_count}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {format(new Date(user.created_at), 'MMM d, yyyy')}
                              </TooltipTrigger>
                              <TooltipContent>
                                {format(new Date(user.created_at), 'PPpp')}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          {user.totalPnl !== null ? (
                            <span className={user.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatIndianCurrency(user.totalPnl)}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openUserDetail(user)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUserActivity}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
            )}
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </CardFooter>
      </Card>
      
      {selectedUser && (
        <UserDetailDialog 
          user={selectedUser}
          open={userDetailOpen}
          onOpenChange={setUserDetailOpen}
        />
      )}
    </div>
  );
};

export default UserActivityAnalytics;
