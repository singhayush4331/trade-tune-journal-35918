import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Shield, 
  RefreshCw,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useVirtualizer } from '@tanstack/react-virtual';

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  roles: any[];
  isAdmin: boolean;
  hasFreeAccess: boolean;
  hasAcademyAccess: boolean;
  hasPremiumAccess: boolean;
  last_sign_in_at: string | null;
}

interface UserCache {
  data: UserData[];
  timestamp: number;
  totalCount: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const PAGE_SIZE = 50;

const OptimizedUserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [userCache, setUserCache] = useState<Map<string, UserCache>>(new Map());

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Create cache key
  const getCacheKey = (page: number, search: string) => `${page}_${search}`;

  // Check cache
  const getCachedData = (page: number, search: string): UserCache | null => {
    const key = getCacheKey(page, search);
    const cached = userCache.get(key);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached;
    }
    
    return null;
  };

  // Set cache
  const setCacheData = (page: number, search: string, data: UserData[], totalCount: number) => {
    const key = getCacheKey(page, search);
    const newCache = new Map(userCache);
    newCache.set(key, {
      data,
      timestamp: Date.now(),
      totalCount
    });
    setUserCache(newCache);
  };

  // Clear cache
  const clearCache = () => {
    setUserCache(new Map());
  };

  // Fetch users with bulk query
  const fetchUsers = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);

      // Check cache first
      const cached = getCachedData(page, search);
      if (cached) {
        setUsers(cached.data);
        setTotalCount(cached.totalCount);
        setLoading(false);
        return;
      }

      const offset = (page - 1) * PAGE_SIZE;

      // Build query with search if provided
      let usersQuery = supabase.from('profiles').select(`
        id,
        email,
        full_name,
        created_at
      `).range(offset, offset + PAGE_SIZE - 1).order('created_at', { ascending: false });
      
      let countQuery = supabase.from('profiles').select('id', { count: 'exact', head: true });

      // Add search filter if provided
      if (search.trim()) {
        const searchFilter = `email.ilike.%${search}%,full_name.ilike.%${search}%`;
        usersQuery = usersQuery.or(searchFilter);
        countQuery = countQuery.or(searchFilter);
      }

      // Fetch users and count in parallel
      const [usersResult, countResult] = await Promise.all([
        usersQuery,
        countQuery
      ]);

      if (usersResult.error) {
        throw usersResult.error;
      }

      if (countResult.error) {
        throw countResult.error;
      }

      // Get roles for each user efficiently
      const userIds = usersResult.data?.map(u => u.id) || [];
      const rolesResult = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles!inner(name, hierarchy_level),
          expires_at
        `)
        .in('user_id', userIds)
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

      // Aggregate roles by user
      const userRoles = new Map();
      rolesResult.data?.forEach(ur => {
        if (!userRoles.has(ur.user_id)) {
          userRoles.set(ur.user_id, []);
        }
        userRoles.get(ur.user_id).push({
          role_name: ur.roles.name,
          hierarchy_level: ur.roles.hierarchy_level,
          expires_at: ur.expires_at
        });
      });

      // Build user data with computed role flags
      const userData = usersResult.data?.map(user => {
        const roles = userRoles.get(user.id) || [];
        return {
          ...user,
          roles,
          isAdmin: roles.some((r: any) => r.role_name === 'admin'),
          hasFreeAccess: roles.some((r: any) => r.role_name === 'Free User'),
          hasAcademyAccess: roles.some((r: any) => r.role_name === 'academy_student'),
          hasPremiumAccess: roles.some((r: any) => r.hierarchy_level >= 40),
          last_sign_in_at: null
        };
      }) || [];

      const totalUsers = countResult.count || 0;

      setUsers(userData);
      setTotalCount(totalUsers);

      // Cache the results
      setCacheData(page, search, userData, totalUsers);

    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [userCache]);

  // Load users when page or search changes
  useEffect(() => {
    fetchUsers(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, fetchUsers]);

  // Refresh data and clear cache
  const handleRefresh = useCallback(() => {
    clearCache();
    fetchUsers(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, fetchUsers]);

  // Virtual scrolling setup
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  // Memoized user role color function
  const getUserRoleColor = useCallback((role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'premium user':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      case 'academy_student':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'trial user':
        return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
      case 'wiggly_only':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'free user':
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600';
    }
  }, []);

  // Memoized upgrade status function
  const getUpgradeStatus = useCallback((user: UserData) => {
    if (user.hasAcademyAccess && !user.hasPremiumAccess) {
      return { status: 'eligible', text: 'Upgrade Eligible', icon: UserCheck, color: 'text-green-600' };
    } else if (user.hasPremiumAccess) {
      return { status: 'premium', text: 'Has Premium', icon: CheckCircle, color: 'text-purple-600' };
    } else if (user.roles.some(r => r.role_name === 'Trial User')) {
      return { status: 'trial', text: 'Trial User', icon: AlertTriangle, color: 'text-orange-600' };
    } else {
      return { status: 'none', text: 'No Upgrade Path', icon: UserX, color: 'text-gray-600' };
    }
  }, []);

  // Memoized stats calculation
  const stats = useMemo(() => {
    const academyUsers = users.filter(u => u.hasAcademyAccess).length;
    const premiumUsers = users.filter(u => u.hasPremiumAccess).length;
    const trialUsers = users.filter(u => u.roles.some(r => r.role_name === 'Trial User')).length;
    const upgradeEligible = users.filter(u => u.hasAcademyAccess && !u.hasPremiumAccess).length;

    return { 
      total: totalCount, 
      academyUsers, 
      premiumUsers, 
      trialUsers, 
      upgradeEligible,
      currentPage: users.length
    };
  }, [users, totalCount]);

  // Pagination
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Optimized User Management
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Fast, paginated user management with smart caching
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.academyUsers}</p>
              <p className="text-sm text-muted-foreground">Academy</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.premiumUsers}</p>
              <p className="text-sm text-muted-foreground">Premium</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.trialUsers}</p>
              <p className="text-sm text-muted-foreground">Trial</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.upgradeEligible}</p>
              <p className="text-sm text-muted-foreground">Upgradeable</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-600">{stats.currentPage}</p>
              <p className="text-sm text-muted-foreground">On Page</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by email, name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List with Virtual Scrolling */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Users ({stats.currentPage} of {stats.total})
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading users...</span>
            </div>
          ) : (
            <div
              ref={parentRef}
              className="h-96 overflow-auto"
            >
              <div
                style={{
                  height: virtualizer.getTotalSize(),
                  width: '100%',
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const user = users[virtualItem.index];
                  const upgradeStatus = getUpgradeStatus(user);
                  const StatusIcon = upgradeStatus.icon;

                  return (
                    <div
                      key={virtualItem.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <div className="border rounded-lg p-4 mr-4 mb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {user.full_name?.charAt(0) || user.email.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{user.full_name || 'No Name'}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {user.roles.map((role: any, index: number) => (
                                <Badge key={index} className={getUserRoleColor(role.role_name)}>
                                  {role.role_name}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <StatusIcon className={`h-4 w-4 ${upgradeStatus.color}`} />
                              <span className={`text-sm ${upgradeStatus.color}`}>
                                {upgradeStatus.text}
                              </span>
                            </div>
                          </div>

                          <div className="text-right text-xs text-muted-foreground">
                            <p>Created: {new Date(user.created_at).toLocaleDateString()}</p>
                            <p>ID: {user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedUserManagement;