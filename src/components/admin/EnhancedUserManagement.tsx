
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  CheckCircle,
  MoreVertical,
  Trash2,
  UserPlus,
  Crown,
  Eye,
  Loader2,
  GraduationCap,
  TrendingUp,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

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
  enrollments?: any[];
  subscription?: any;
  lastActivity?: string;
}

interface UserCache {
  data: UserData[];
  timestamp: number;
  totalCount: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const PAGE_SIZE = 50;

const EnhancedUserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [userCache, setUserCache] = useState<Map<string, UserCache>>(new Map());
  const [platformFilter, setPlatformFilter] = useState<'all' | 'wiggly' | 'academy'>('all');
  const [activeTab, setActiveTab] = useState('users');
  
  // Selection state
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  
  const { user: currentUser } = useAuth();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Cache management
  const getCacheKey = (page: number, search: string, platform: string) => `${page}_${search}_${platform}`;

  const getCachedData = (page: number, search: string, platform: string): UserCache | null => {
    const key = getCacheKey(page, search, platform);
    const cached = userCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached;
    }
    return null;
  };

  const setCacheData = (page: number, search: string, platform: string, data: UserData[], totalCount: number) => {
    const key = getCacheKey(page, search, platform);
    const newCache = new Map(userCache);
    newCache.set(key, { data, timestamp: Date.now(), totalCount });
    setUserCache(newCache);
  };

  const clearCache = () => {
    setUserCache(new Map());
  };

  // Fetch users with platform filtering and enhanced data
  const fetchUsers = useCallback(async (page: number = 1, search: string = '', platform: string = 'all') => {
    try {
      setLoading(true);

      const cached = getCachedData(page, search, platform);
      if (cached) {
        setUsers(cached.data);
        setTotalCount(cached.totalCount);
        setLoading(false);
        return;
      }

      const offset = (page - 1) * PAGE_SIZE;

      // Fetch all profiles and user roles
      const [profilesResult, rolesResult, enrollmentsResult, subscriptionsResult] = await Promise.all([
        supabase.rpc('get_all_profiles_for_admin'),
        supabase.from('user_roles').select(`
          user_id,
          roles (
            id,
            name,
            hierarchy_level
          )
        `),
        supabase.from('user_enrollments').select(`
          user_id,
          course_id,
          status,
          progress,
          enrolled_at,
          courses (
            title,
            status
          )
        `),
        supabase.from('subscriptions').select('*')
      ]);
      
      if (profilesResult.error) throw profilesResult.error;

      const allProfiles = profilesResult.data || [];
      const userRoles = rolesResult.data || [];
      const enrollments = enrollmentsResult.data || [];
      const subscriptions = subscriptionsResult.data || [];

      // Create maps for efficient lookup
      const userRoleMap = new Map();
      userRoles.forEach((ur: any) => {
        if (!userRoleMap.has(ur.user_id)) {
          userRoleMap.set(ur.user_id, []);
        }
        userRoleMap.get(ur.user_id).push(ur.roles);
      });

      const userEnrollmentMap = new Map();
      enrollments.forEach((enrollment: any) => {
        if (!userEnrollmentMap.has(enrollment.user_id)) {
          userEnrollmentMap.set(enrollment.user_id, []);
        }
        userEnrollmentMap.get(enrollment.user_id).push(enrollment);
      });

      const userSubscriptionMap = new Map();
      subscriptions.forEach((sub: any) => {
        userSubscriptionMap.set(sub.user_id, sub);
      });

      // Transform profiles to UserData format with enhanced information
      const transformedProfiles: UserData[] = allProfiles.map((profile: any) => {
        const roles = userRoleMap.get(profile.id) || [];
        const userEnrollments = userEnrollmentMap.get(profile.id) || [];
        const subscription = userSubscriptionMap.get(profile.id);

        const roleNames = roles.map((r: any) => r?.name || 'Unknown');
        const hasAcademyRole = roleNames.includes('academy_student');
        const hasPremiumRole = roles.some((r: any) => r?.hierarchy_level >= 40);
        const hasWigglyRole = roleNames.includes('wiggly_only') || (!hasAcademyRole && !hasPremiumRole);
        const isAdmin = roles.some((r: any) => r?.hierarchy_level >= 50);

        // Enhanced academy access detection
        const hasAcademyAccess = hasAcademyRole || 
                                userEnrollments.length > 0 || 
                                isAdmin ||
                                roleNames.some(role => role.includes('academy')) ||
                                roles.some((r: any) => r?.hierarchy_level >= 30); // Premium users also have academy access

        return {
          id: profile.id,
          email: profile.email || '',
          full_name: profile.full_name,
          created_at: profile.created_at,
          roles: roles.map((r: any) => ({
            role_name: r?.name || 'Unknown',
            hierarchy_level: r?.hierarchy_level || 0
          })),
          isAdmin: isAdmin,
          hasFreeAccess: roleNames.includes('Free User'),
          hasAcademyAccess: hasAcademyAccess,
          hasPremiumAccess: hasPremiumRole,
          last_sign_in_at: null,
          enrollments: userEnrollments,
          subscription: subscription,
          lastActivity: userEnrollments.length > 0 ? userEnrollments[0].enrolled_at : profile.created_at
        };
      });

      // Filter based on platform
      let filteredProfiles = transformedProfiles;
      if (platform === 'wiggly') {
        filteredProfiles = transformedProfiles.filter(user => 
          user.roles.some(r => r.role_name === 'wiggly_only') || 
          (!user.hasAcademyAccess && !user.hasPremiumAccess)
        );
      } else if (platform === 'academy') {
        // Enhanced academy filtering to include all users with academy access
        filteredProfiles = transformedProfiles.filter(user => 
          user.hasAcademyAccess || 
          user.enrollments.length > 0 || 
          user.isAdmin ||
          user.roles.some(r => r.role_name.includes('academy')) ||
          user.hasPremiumAccess // Premium users have academy access
        );
      }

      // Filter based on search term
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredProfiles = filteredProfiles.filter(profile => 
          profile.email.toLowerCase().includes(searchLower) ||
          profile.full_name?.toLowerCase().includes(searchLower)
        );
      }

      // Apply pagination
      const totalUsers = filteredProfiles.length;
      const startIndex = (page - 1) * PAGE_SIZE;
      const paginatedUsers = filteredProfiles.slice(startIndex, startIndex + PAGE_SIZE);

      setUsers(paginatedUsers);
      setTotalCount(totalUsers);
      setCacheData(page, search, platform, paginatedUsers, totalUsers);

    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [userCache]);

  useEffect(() => {
    fetchUsers(currentPage, debouncedSearch, platformFilter);
  }, [currentPage, debouncedSearch, platformFilter, fetchUsers]);

  // User role management functions
  const updateUserInState = (userId: string, updates: Partial<UserData>) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };

  const handleEnrollInCourse = async (userId: string, courseId: string) => {
    try {
      setActionLoading(`enroll-${userId}`);
      
      const { error } = await supabase
        .from('user_enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
          status: 'active'
        });

      if (error) throw error;

      toast.success('User enrolled in course successfully');
      clearCache();
      await fetchUsers(currentPage, debouncedSearch, platformFilter);
    } catch (error) {
      console.error('Error enrolling user in course:', error);
      toast.error('Failed to enroll user in course');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleFreeAccess = async (user: UserData) => {
    const actionKey = `free-access-${user.id}`;
    try {
      setActionLoading(actionKey);
      updateUserInState(user.id, { hasFreeAccess: !user.hasFreeAccess });
      
      const { error } = await supabase.rpc(
        user.hasFreeAccess ? 'remove_role_from_user' : 'add_role_to_user',
        { target_user_id: user.id, role_name: 'Free User' }
      );
      
      if (error) {
        updateUserInState(user.id, { hasFreeAccess: user.hasFreeAccess });
        throw error;
      }
      
      toast.success(`Free access ${user.hasFreeAccess ? 'revoked' : 'granted'} for ${user.email}`);
      
    } catch (error) {
      console.error('Error toggling free access:', error);
      toast.error(`Failed to update free access for ${user.email}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAcademyAccess = async (user: UserData) => {
    const actionKey = `academy-access-${user.id}`;
    try {
      setActionLoading(actionKey);
      updateUserInState(user.id, { hasAcademyAccess: !user.hasAcademyAccess });
      
      const { error } = await supabase.rpc(
        user.hasAcademyAccess ? 'remove_role_from_user' : 'add_role_to_user',
        { target_user_id: user.id, role_name: 'academy_student' }
      );
      
      if (error) {
        updateUserInState(user.id, { hasAcademyAccess: user.hasAcademyAccess });
        throw error;
      }
      
      toast.success(`Academy access ${user.hasAcademyAccess ? 'revoked' : 'granted'} for ${user.email}`);
    } catch (error) {
      console.error('Error toggling academy access:', error);
      toast.error(`Failed to update academy access for ${user.email}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAdmin = async (user: UserData) => {
    const actionKey = `admin-${user.id}`;
    try {
      setActionLoading(actionKey);
      updateUserInState(user.id, { isAdmin: !user.isAdmin });
      
      const { error } = await supabase.rpc(
        user.isAdmin ? 'remove_role_from_user' : 'add_role_to_user',
        { target_user_id: user.id, role_name: 'admin' }
      );
      
      if (error) {
        updateUserInState(user.id, { isAdmin: user.isAdmin });
        throw error;
      }
      
      toast.success(`Admin role ${user.isAdmin ? 'revoked' : 'granted'} for ${user.email}`);
    } catch (error) {
      console.error('Error toggling admin role:', error);
      toast.error(`Failed to update admin role for ${user.email}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    if (user.id === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }
    
    try {
      setActionLoading(`delete-${user.id}`);
      
      const response = await supabase.functions.invoke('delete-user', {
        body: { userId: user.id },
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to delete user');
      }
      
      toast.success(`User ${user.email} has been deleted successfully`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      
      clearCache();
      await fetchUsers(currentPage, debouncedSearch, platformFilter);
      
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(`Failed to delete user: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Selection functions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleRefresh = useCallback(() => {
    clearCache();
    fetchUsers(currentPage, debouncedSearch, platformFilter);
  }, [currentPage, debouncedSearch, platformFilter, fetchUsers]);

  // Stats by platform
  const stats = useMemo(() => {
    const allUsers = users.length;
    const wigglyUsers = users.filter(u => 
      u.roles.some(r => r.role_name === 'wiggly_only') || 
      (!u.hasAcademyAccess && !u.hasPremiumAccess)
    ).length;
    const academyUsers = users.filter(u => u.hasAcademyAccess).length;
    const premiumUsers = users.filter(u => u.hasPremiumAccess).length;
    const activeSubscriptions = users.filter(u => u.subscription?.status === 'active').length;
    const totalEnrollments = users.reduce((acc, user) => acc + (user.enrollments?.length || 0), 0);

    return { 
      total: totalCount, 
      wigglyUsers, 
      academyUsers, 
      premiumUsers, 
      activeSubscriptions,
      totalEnrollments,
      currentPage: allUsers
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
                Enhanced User Management
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Unified user management across Wiggly and Academy platforms
              </p>
            </div>
            <div className="flex items-center gap-2">
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
          </div>
        </CardHeader>
      </Card>

      {/* Platform Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Platform:</span>
            <div className="flex items-center gap-2">
              <Button
                variant={platformFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPlatformFilter('all')}
              >
                All Users
              </Button>
              <Button
                variant={platformFilter === 'wiggly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPlatformFilter('wiggly')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Wiggly
              </Button>
              <Button
                variant={platformFilter === 'academy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPlatformFilter('academy')}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Academy
              </Button>
            </div>
          </div>
        </CardContent>
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
              <p className="text-2xl font-bold text-orange-600">{stats.wigglyUsers}</p>
              <p className="text-sm text-muted-foreground">Wiggly</p>
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
              <p className="text-2xl font-bold text-cyan-600">{stats.activeSubscriptions}</p>
              <p className="text-sm text-muted-foreground">Active Subs</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-600">{stats.totalEnrollments}</p>
              <p className="text-sm text-muted-foreground">Enrollments</p>
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

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="enrollments" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Enrollments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Bulk Actions Toolbar */}
          {selectedUsers.length > 0 && (
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUsers([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {/* handleBulkGrantFreeAccess */}}
                      disabled={bulkActionLoading}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Grant Free Access
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {/* handleBulkGrantAcademyAccess */}}
                      disabled={bulkActionLoading}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Grant Academy Access
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setBulkDeleteDialogOpen(true)}
                      disabled={bulkActionLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle>
                    Users ({stats.currentPage} of {stats.total})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">Select All</span>
                  </div>
                </div>
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
                <div className="space-y-4">
                  {users.map((user) => {
                    const isSelected = selectedUsers.includes(user.id);

                    return (
                      <div key={user.id} className={`border rounded-lg p-4 ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                            />
                            
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
                                  <Badge key={index} variant="secondary">
                                    {role.role_name}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {user.subscription && (
                                  <span className="flex items-center gap-1">
                                    <Crown className="h-3 w-3" />
                                    {user.subscription.status}
                                  </span>
                                )}
                                {user.enrollments && user.enrollments.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    {user.enrollments.length} courses
                                  </span>
                                )}
                                <span>
                                  Joined: {new Date(user.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  {actionLoading?.includes(user.id) ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <MoreVertical className="h-4 w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleToggleFreeAccess(user)}>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  {user.hasFreeAccess ? 'Revoke' : 'Grant'} Free Access
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleAcademyAccess(user)}>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  {user.hasAcademyAccess ? 'Revoke' : 'Grant'} Academy Access
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleAdmin(user)}>
                                  <Crown className="h-4 w-4 mr-2" />
                                  {user.isAdmin ? 'Revoke' : 'Grant'} Admin Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setUserToDelete(user);
                                    setDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600"
                                  disabled={user.id === currentUser?.id}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <CardTitle>Course Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Course enrollment management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Platform Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Unified analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete User Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete User Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete the user account for{' '}
              <span className="font-semibold">{userToDelete?.email}</span>? 
              This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading?.includes('delete')}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
              disabled={actionLoading?.includes('delete')}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading?.includes('delete') ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnhancedUserManagement;
