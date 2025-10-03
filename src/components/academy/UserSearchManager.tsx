
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User, Mail, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { 
  getAllCoursesAdmin,
  getUserEnrollmentsAdmin,
  enrollUserInCourse,
  revokeUserCourseAccess,
  type Course 
} from '@/services/academy-service';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import UserDetailModal from './UserDetailModal';

interface UserSearchResult {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  roles?: string[];
}

const UserSearchManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const coursesData = await getAllCoursesAdmin();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading courses:', error);
      // Set empty array on error to allow component to render
      setCourses([]);
      setError('Failed to load courses. Some features may be limited.');
    }
  };

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter an email to search');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Searching for users with email:', searchTerm);
      
      // Search for users by email using profiles table
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .ilike('email', `%${searchTerm}%`)
        .limit(10);

      if (error) {
        console.error('Error searching users:', error);
        setError('Failed to search users. You may not have permission to access this data.');
        setSearchResults([]);
        return;
      }

      console.log('Found profiles:', profiles);

      if (!profiles || profiles.length === 0) {
        setSearchResults([]);
        toast.info('No users found with that email');
        return;
      }

      // Get roles for each user (with error handling)
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          try {
            const { data: userRoles, error: rolesError } = await supabase
              .from('user_roles')
              .select(`
                roles!inner(name)
              `)
              .eq('user_id', profile.id)
              .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

            const roles = rolesError ? [] : userRoles?.map(ur => ur.roles?.name).filter(Boolean) || [];

            return {
              ...profile,
              roles
            };
          } catch (error) {
            console.error('Error fetching roles for user:', profile.id, error);
            return {
              ...profile,
              roles: []
            };
          }
        })
      );

      setSearchResults(usersWithRoles);
      console.log('Search results with roles:', usersWithRoles);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users. Please check your permissions or try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: UserSearchResult) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleEnrollCourse = async (userId: string, courseId: string): Promise<boolean> => {
    try {
      const success = await enrollUserInCourse(userId, courseId);
      if (success) {
        toast.success('User enrolled successfully');
        return true;
      } else {
        toast.error('Failed to enroll user');
        return false;
      }
    } catch (error) {
      console.error('Error enrolling user:', error);
      toast.error('Failed to enroll user');
      return false;
    }
  };

  const handleRevokeAccess = async (userId: string, courseId: string): Promise<boolean> => {
    try {
      const success = await revokeUserCourseAccess(userId, courseId);
      if (success) {
        toast.success('Course access revoked successfully');
        return true;
      } else {
        toast.error('Failed to revoke course access');
        return false;
      }
    } catch (error) {
      console.error('Error revoking course access:', error);
      toast.error('Failed to revoke course access');
      return false;
    }
  };

  const handleUpdateRole = async (userId: string, roleId: string): Promise<boolean> => {
    // This would be implemented when role management is needed
    toast.info('Role management functionality coming soon');
    return false;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'academy_student': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'free user': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            User Search & Management
          </CardTitle>
          <CardDescription>
            Search for users by email and manage their course access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">{error}</span>
            </div>
          )}
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search by email address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              />
            </div>
            <Button onClick={searchUsers} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Search Results ({searchResults.length})
              </h4>
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <Card 
                    key={user.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleUserClick(user)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="font-medium">{user.full_name || 'No Name'}</h5>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Joined {formatDate(user.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex flex-wrap gap-1 justify-end">
                            {user.roles && user.roles.length > 0 ? (
                              user.roles.map((role) => (
                                <Badge 
                                  key={role} 
                                  variant="secondary"
                                  className={`text-xs ${getRoleBadgeColor(role)}`}
                                >
                                  {role}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                No roles
                              </Badge>
                            )}
                          </div>
                          <Button size="sm" variant="outline">
                            <User className="h-3 w-3 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {searchResults.length === 0 && searchTerm && !loading && !error && (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h4 className="font-medium mb-2">No users found</h4>
                <p className="text-sm text-muted-foreground">
                  No users found with email containing "{searchTerm}"
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <UserDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        user={selectedUser}
        courses={courses}
        userRoles={selectedUser?.roles || []}
        onUpdateRole={handleUpdateRole}
        onEnrollCourse={handleEnrollCourse}
        onRevokeAccess={handleRevokeAccess}
        onRefresh={() => {
          // Refresh search results
          if (searchTerm) {
            searchUsers();
          }
        }}
      />
    </div>
  );
};

export default UserSearchManager;
