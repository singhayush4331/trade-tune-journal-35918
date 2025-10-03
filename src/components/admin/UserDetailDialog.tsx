
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getSessionUser } from '@/utils/auth-cache';
import { format, parseISO, differenceInDays } from 'date-fns';
import { formatIndianCurrency } from '@/lib/utils';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Calendar, 
  Clock, 
  BarChart3, 
  ArrowUp, 
  ArrowDown,
  Activity,
  BookOpen,
  Copy,
  Calendar as CalendarIcon,
  Mail,
  UserCheck,
  PieChart as PieChartIcon,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';
import { Separator } from "@/components/ui/separator";

interface UserDetailDialogProps {
  user: {
    id: string;
    email: string | null;
    full_name: string | null;
    created_at: string;
    last_active: string | null;
    trade_count: number;
    playbook_count: number;
    isAdmin: boolean;
    hasFreeAccess: boolean;
    subscriptionStatus: string;
    totalPnl: number | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TradeData {
  id: string;
  symbol: string;
  type: string;
  date: string;
  pnl: number | null;
  setup_rating: number | null;
  execution_rating: number | null;
  management_rating: number | null;
  created_at: string;
  quantity: number | null;
  entry_price: number | null;
  exit_price: number | null;
  strategy: string | null;
  mood: string | null;
}

interface PlaybookData {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  description: string | null;
}

interface ActivityPoint {
  date: string;
  trades: number;
  playbooks: number;
}

const UserDetailDialog: React.FC<UserDetailDialogProps> = ({ 
  user, 
  open, 
  onOpenChange 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [playbooks, setPlaybooks] = useState<PlaybookData[]>([]);
  const [activityData, setActivityData] = useState<ActivityPoint[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [strategyData, setStrategyData] = useState<{name: string, count: number, color: string}[]>([]);
  const [marketSegmentData, setMarketSegmentData] = useState<{name: string, count: number, color: string}[]>([]);
  const [moodData, setMoodData] = useState<{name: string, count: number, color: string}[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (open && user) {
      console.log("UserDetailDialog opened for user:", user);
      setLoading(true);
      setError(null);
      setDataLoaded(false);
      fetchUserDetails();
    } else {
      // Reset states when dialog closes
      setTrades([]);
      setPlaybooks([]);
      setActivityData([]);
      setProfileData(null);
      setStrategyData([]);
      setMarketSegmentData([]);
      setMoodData([]);
      setDataLoaded(false);
    }
  }, [open, user, refreshKey]);

  const fetchUserDetails = async () => {
    if (!user) return;
    
    console.log("Fetching details for user:", user.id);
    setLoading(true);
    setIsRefreshing(true);
    
    try {
      const currentUser = await getSessionUser();
      const { data: isAdmin, error: adminCheckError } = await supabase
        .rpc('is_admin_secure', { check_user_id: currentUser?.id || '' });
        
      if (adminCheckError) {
        console.error("Error checking admin status:", adminCheckError);
        throw new Error("Failed to verify admin access");
      }
      
      console.log("Admin check result:", isAdmin);
      
      if (!isAdmin) {
        console.error("Non-admin user attempting to access user details");
        throw new Error("Unauthorized: Admin access required");
      }

      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }
      setProfileData(profile);
      console.log("Profile data loaded:", profile);

      // Fetch user's trades with complete details using the proper RPC function
      console.log("Using get_all_trades_for_admin to fetch trades as admin");
      const { data: allAdminTrades, error: adminTradesError } = await supabase
        .rpc('get_all_trades_for_admin');
      
      if (adminTradesError) {
        console.error("Error fetching trades via admin RPC:", adminTradesError);
        throw adminTradesError;
      }
      
      // Filter trades for the specific user
      const tradesData = allAdminTrades?.filter(trade => trade.user_id === user.id) || [];
      
      // Log the trades fetched
      console.log(`Fetched ${tradesData.length} trades for user:`, user.id, tradesData);
      
      // Ensure we have valid trade data
      const validTrades = tradesData.map(trade => ({
        ...trade,
        pnl: trade.pnl !== null ? trade.pnl : 0,
        setup_rating: trade.setup_rating || null,
        execution_rating: trade.execution_rating || null,
        management_rating: trade.management_rating || null
      }));
      
      setTrades(validTrades);

      // Fetch user's playbooks using the proper RPC function
      console.log("Using get_all_playbooks_for_admin to fetch playbooks as admin");
      const { data: allAdminPlaybooks, error: adminPlaybooksError } = await supabase
        .rpc('get_all_playbooks_for_admin');
      
      if (adminPlaybooksError) {
        console.error("Error fetching playbooks via admin RPC:", adminPlaybooksError);
        throw adminPlaybooksError;
      }
      
      // Filter playbooks for the specific user
      const playbooksData = allAdminPlaybooks?.filter(playbook => playbook.user_id === user.id) || [];
      
      console.log(`Fetched ${playbooksData.length} playbooks for user:`, user.id);
      setPlaybooks(playbooksData);

      // Generate activity data (last 90 days)
      const activityPoints: ActivityPoint[] = [];
      const now = new Date();
      
      for (let i = 89; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        const dayTrades = validTrades.filter(trade => 
          format(new Date(trade.created_at), 'yyyy-MM-dd') === dateStr
        ).length || 0;
        
        const dayPlaybooks = playbooksData?.filter(playbook => 
          format(new Date(playbook.created_at), 'yyyy-MM-dd') === dateStr
        ).length || 0;
        
        activityPoints.push({
          date: format(date, 'MM/dd'),
          trades: dayTrades,
          playbooks: dayPlaybooks
        });
      }
      
      setActivityData(activityPoints);
      
      // Generate strategy distribution data
      if (validTrades.length > 0) {
        // Strategy distribution
        const strategyMap = new Map();
        const colors = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#f97316', '#06b6d4', '#d946ef', '#84cc16'];
        
        validTrades.forEach(trade => {
          if (trade.strategy) {
            const count = strategyMap.get(trade.strategy) || 0;
            strategyMap.set(trade.strategy, count + 1);
          }
        });
        
        const strategyDistribution = Array.from(strategyMap.entries()).map(([name, count], index) => ({
          name,
          count,
          color: colors[index % colors.length]
        }));
        
        setStrategyData(strategyDistribution);
        
        // Market segment distribution
        const marketSegmentMap = new Map();
        validTrades.forEach(trade => {
          if (trade.symbol) {
            // Extract market segment from symbol (simplified example)
            const segment = trade.symbol.includes("NIFTY") ? "Index" : 
                           trade.symbol.includes("BANKNIFTY") ? "Banking" : "Equity";
            const count = marketSegmentMap.get(segment) || 0;
            marketSegmentMap.set(segment, count + 1);
          }
        });
        
        const marketSegmentDistribution = Array.from(marketSegmentMap.entries()).map(([name, count], index) => ({
          name,
          count,
          color: colors[(index + 3) % colors.length]
        }));
        
        setMarketSegmentData(marketSegmentDistribution);
        
        // Mood distribution
        const moodMap = new Map();
        validTrades.forEach(trade => {
          if (trade.mood) {
            const count = moodMap.get(trade.mood) || 0;
            moodMap.set(trade.mood, count + 1);
          }
        });
        
        const moodDistribution = Array.from(moodMap.entries()).map(([name, count], index) => ({
          name,
          count,
          color: colors[(index + 5) % colors.length]
        }));
        
        setMoodData(moodDistribution);
      }

      console.log("User details loaded successfully");
      setDataLoaded(true);
      toast.success("User data loaded successfully");
      
    } catch (error: any) {
      console.error("Error fetching user details:", error);
      setError(error?.message || "Failed to load user details. Please try refreshing the data.");
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.info("Refreshing user data...");
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Calculate win rate
  const winningTrades = trades.filter(t => t.pnl !== null && t.pnl > 0).length;
  const losingTrades = trades.filter(t => t.pnl !== null && t.pnl < 0).length;
  const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;

  // Calculate average ratings
  const avgSetupRating = trades.some(t => t.setup_rating !== null)
    ? trades.reduce((sum, t) => sum + (t.setup_rating || 0), 0) / 
      trades.filter(t => t.setup_rating !== null).length
    : 0;
    
  const avgExecutionRating = trades.some(t => t.execution_rating !== null)
    ? trades.reduce((sum, t) => sum + (t.execution_rating || 0), 0) / 
      trades.filter(t => t.execution_rating !== null).length
    : 0;
    
  const avgManagementRating = trades.some(t => t.management_rating !== null)
    ? trades.reduce((sum, t) => sum + (t.management_rating || 0), 0) / 
      trades.filter(t => t.management_rating !== null).length
    : 0;

  // Prepare data for PnL chart
  const pnlChartData = trades
    .filter(trade => trade.pnl !== null)
    .map(trade => ({
      date: format(new Date(trade.created_at), 'MM/dd'),
      pnl: trade.pnl,
      symbol: trade.symbol,
    }))
    .slice(0, 20)
    .reverse();
  
  // Calculate ratings stats for radar chart  
  const ratingData = [
    { subject: 'Setup', value: avgSetupRating, fullMark: 5 },
    { subject: 'Execution', value: avgExecutionRating, fullMark: 5 },
    { subject: 'Management', value: avgManagementRating, fullMark: 5 },
  ];

  // Calculate total PNL, average PNL per trade, and largest win/loss
  const totalPnl = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const avgPnl = trades.length > 0 ? totalPnl / trades.length : 0;
  const largestWin = Math.max(0, ...trades.map(t => t.pnl || 0));
  const largestLoss = Math.min(0, ...trades.map(t => t.pnl || 0));

  // Calculate average trade size
  const avgTradeSize = trades.filter(t => t.quantity && t.entry_price)
    .reduce((sum, t) => sum + ((t.quantity || 0) * (t.entry_price || 0)), 0) / 
    trades.filter(t => t.quantity && t.entry_price).length || 0;

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile: {user.full_name || 'Unnamed User'}
          </DialogTitle>
          <DialogDescription>
            Detailed analytics and activity history for this user
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* User Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center justify-between">
                <span>User Information</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="h-8"
                  disabled={loading || isRefreshing}
                >
                  {isRefreshing ? (
                    <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  )}
                  {isRefreshing ? "Refreshing..." : "Refresh Data"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Full Name</span>
                        <span>{user.full_name || 'Not provided'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Email</span>
                        <div className="flex items-center gap-1">
                          <span>{user.email}</span>
                          {user.email && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => copyToClipboard(user.email || '')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">User ID</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono">{user.id.substring(0, 8)}...</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => copyToClipboard(user.id)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Joined</span>
                        <span>{format(new Date(user.created_at), 'PPP')}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Last Active</span>
                        <span>{user.last_active ? format(new Date(user.last_active), 'PPP') : 'Never active'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Subscription</span>
                        <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'outline'}>
                          {user.subscriptionStatus === 'active' ? 'Active Subscriber' : 'No Active Subscription'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-wrap gap-2">
                    {user.isAdmin && <Badge variant="default">Admin</Badge>}
                    {user.hasFreeAccess && <Badge variant="secondary">Free Access</Badge>}
                    {profileData?.experience_level && (
                      <Badge variant="outline">{profileData.experience_level} Trader</Badge>
                    )}
                    {profileData?.trading_style && (
                      <Badge variant="outline">{profileData.trading_style}</Badge>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{trades.length}</div>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      First: {trades.length > 0 ? format(new Date(trades[trades.length - 1].created_at), 'MMM d, yyyy') : 'N/A'}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <ArrowUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                      {winningTrades} wins
                      <ArrowDown className="h-3.5 w-3.5 mx-1 text-red-500" />
                      {losingTrades} losses
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total PnL</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatIndianCurrency(totalPnl)}
                    </div>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <BarChart3 className="h-3.5 w-3.5 mr-1" />
                      {trades.filter(t => t.pnl !== null && t.pnl !== 0).length} P&L records
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {((avgSetupRating + avgExecutionRating + avgManagementRating) / 3).toFixed(1) || '0.0'}
                    </div>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Activity className="h-3.5 w-3.5 mr-1" />
                      Trade quality rating (out of 5)
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-10 w-10 animate-spin text-primary mb-4" />
                <p>{isRefreshing ? "Refreshing user data..." : "Loading user data..."}</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activity" className="text-sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="trades" className="text-sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Trades
                </TabsTrigger>
                <TabsTrigger value="playbooks" className="text-sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Playbooks
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Avg. P&L Per Trade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${avgPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatIndianCurrency(avgPnl)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Trade Size</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatIndianCurrency(avgTradeSize)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Largest Win</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {formatIndianCurrency(largestWin)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Largest Loss</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {formatIndianCurrency(Math.abs(largestLoss))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Timeline</CardTitle>
                    <CardDescription>Recent trades and playbooks created over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {activityData.some(d => d.trades > 0 || d.playbooks > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                            <XAxis 
                              dataKey="date" 
                              interval={Math.max(1, Math.floor(activityData.length / 15))}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="trades" name="Trades" fill="#6366f1" stackId="a" />
                            <Bar dataKey="playbooks" name="Playbooks" fill="#22c55e" stackId="a" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full flex-col">
                          <Activity className="h-12 w-12 text-muted-foreground opacity-20 mb-2" />
                          <p className="text-muted-foreground">No activity recorded in the last 90 days</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {strategyData.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Strategies Distribution</CardTitle>
                        <CardDescription>Trading strategies used by the user</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={strategyData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {strategyData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value, name, props) => [`${value} trades`, props.payload.name]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {moodData.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Trading Mood</CardTitle>
                        <CardDescription>Emotional states during trading</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={moodData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {moodData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value, name, props) => [`${value} trades`, props.payload.name]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {trades.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>P&L History</CardTitle>
                      <CardDescription>Recent trade performance (last 20 trades)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        {pnlChartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pnlChartData}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                              <XAxis 
                                dataKey="date" 
                                interval={Math.floor(pnlChartData.length / 10)}
                              />
                              <YAxis tickFormatter={(value) => `₹${value}`} />
                              <Tooltip 
                                formatter={(value: any) => [`₹${value}`, 'P&L']}
                                labelFormatter={(label) => `Date: ${label}`}
                              />
                              <Bar dataKey="pnl" name="P&L">
                                {pnlChartData.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} 
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">No P&L data available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="trades" className="mt-4">
                {trades.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Trade History</CardTitle>
                      <CardDescription>{trades.length} trades recorded</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Symbol</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Size</TableHead>
                              <TableHead>P&L</TableHead>
                              <TableHead>Rating</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {trades.slice(0, 10).map(trade => (
                              <TableRow key={trade.id}>
                                <TableCell className="font-medium">{trade.symbol}</TableCell>
                                <TableCell>{trade.type}</TableCell>
                                <TableCell>{format(new Date(trade.date), 'MMM d, yyyy')}</TableCell>
                                <TableCell>
                                  {trade.quantity ? `${trade.quantity} ${trade.quantity > 1 ? 'units' : 'unit'}` : 'N/A'}
                                </TableCell>
                                <TableCell>
                                  {trade.pnl !== null ? (
                                    <span className={trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                                      {formatIndianCurrency(trade.pnl)}
                                    </span>
                                  ) : (
                                    'N/A'
                                  )}
                                </TableCell>
                                <TableCell>
                                  {trade.setup_rating || trade.execution_rating || trade.management_rating ? (
                                    <div className="flex gap-1">
                                      {trade.setup_rating && (
                                        <Badge variant="outline">S: {trade.setup_rating}</Badge>
                                      )}
                                      {trade.execution_rating && (
                                        <Badge variant="outline">E: {trade.execution_rating}</Badge>
                                      )}
                                      {trade.management_rating && (
                                        <Badge variant="outline">M: {trade.management_rating}</Badge>
                                      )}
                                    </div>
                                  ) : (
                                    'No rating'
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      {trades.length > 10 && (
                        <div className="text-center text-sm text-muted-foreground mt-4">
                          Showing 10 of {trades.length} trades
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Alert>
                    <AlertDescription>
                      This user hasn't recorded any trades yet.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="playbooks" className="mt-4">
                {playbooks.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Playbooks</CardTitle>
                      <CardDescription>{playbooks.length} playbooks created</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead>Last Updated</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {playbooks.map(playbook => (
                              <TableRow key={playbook.id}>
                                <TableCell className="font-medium">{playbook.name}</TableCell>
                                <TableCell className="max-w-xs truncate">{playbook.description || 'No description'}</TableCell>
                                <TableCell>{format(new Date(playbook.created_at), 'MMM d, yyyy')}</TableCell>
                                <TableCell>{format(new Date(playbook.updated_at), 'MMM d, yyyy')}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Alert>
                    <AlertDescription>
                      This user hasn't created any playbooks yet.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
