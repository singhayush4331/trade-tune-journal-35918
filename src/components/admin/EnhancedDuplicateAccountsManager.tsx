import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Users, 
  Merge, 
  Trash2, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Bug,
  RefreshCw,
  UserX
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getSessionUser } from '@/utils/auth-cache';
import { toast } from 'sonner';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DuplicateAccount {
  email: string;
  user_ids: string[];
  count: number;
  type: 'profile_duplicate' | 'auth_mismatch' | 'orphaned_enrollments';
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  roles: string[];
  has_profile: boolean;
  has_enrollments: boolean;
  enrollment_count?: number;
}

interface SessionMismatch {
  email: string;
  session_user_id: string;
  profile_user_id: string;
  enrollments_user_id?: string;
  issue_type: 'no_profile' | 'different_profile' | 'enrollment_mismatch';
}

const EnhancedDuplicateAccountsManager: React.FC = () => {
  const [profileDuplicates, setProfileDuplicates] = useState<DuplicateAccount[]>([]);
  const [sessionMismatches, setSessionMismatches] = useState<SessionMismatch[]>([]);
  const [orphanedEnrollments, setOrphanedEnrollments] = useState<DuplicateAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<DuplicateAccount | SessionMismatch | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, UserData>>({});
  const [showFixDialog, setShowFixDialog] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState<{
    id: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    findAllAccountIssues();
    getCurrentUserInfo();
  }, []);

  const getCurrentUserInfo = async () => {
    try {
      const user = await getSessionUser();
      if (user) {
        setCurrentUserInfo({
          id: user.id,
          email: user.email || 'Unknown'
        });
      }
    } catch (error) {
      console.error('Error getting current user info:', error);
    }
  };

  const findAllAccountIssues = async () => {
    try {
      setLoading(true);
      console.log('🔍 Finding all account issues...');
      
      // 1. Find profile duplicates (existing logic)
      await findProfileDuplicates();
      
      // 2. Find session mismatches
      await findSessionMismatches();
      
      // 3. Find orphaned enrollments
      await findOrphanedEnrollments();
      
    } catch (error) {
      console.error('❌ Error finding account issues:', error);
      toast.error('Failed to analyze account issues');
    } finally {
      setLoading(false);
    }
  };

  const findProfileDuplicates = async () => {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at')
      .not('email', 'is', null);
    
    if (profilesError) throw profilesError;
    
    const emailGroups: Record<string, UserData[]> = {};
    const userDetailsMap: Record<string, UserData> = {};
    
    for (const profile of profiles || []) {
      if (!emailGroups[profile.email]) {
        emailGroups[profile.email] = [];
      }
      
      const userData: UserData = {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || 'No Name',
        created_at: profile.created_at,
        roles: [],
        has_profile: true,
        has_enrollments: false
      };
      
      emailGroups[profile.email].push(userData);
      userDetailsMap[profile.id] = userData;
    }
    
    const duplicatesList: DuplicateAccount[] = [];
    
    for (const [email, users] of Object.entries(emailGroups)) {
      if (users.length > 1) {
        duplicatesList.push({
          email,
          user_ids: users.map(u => u.id),
          count: users.length,
          type: 'profile_duplicate'
        });
      }
    }
    
    setProfileDuplicates(duplicatesList);
    setUserDetails(prev => ({ ...prev, ...userDetailsMap }));
  };

  const findSessionMismatches = async () => {
    try {
      console.log('🔍 Checking for session mismatches...');
      
      const sessionUser = await getSessionUser();
      if (!sessionUser) return;
      
      console.log('Current session user:', sessionUser.id, sessionUser.email);
      
      // Check if profile exists for current session user
      const { data: sessionProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();
      
      // Check for profiles with same email but different user ID
      const { data: emailProfiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', sessionUser.email);
      
      // Check for enrollments with current session user ID
      const { data: sessionEnrollments } = await supabase
        .from('user_enrollments')
        .select('*')
        .eq('user_id', sessionUser.id);
      
      // Check for enrollments with same email but different user ID
      const { data: emailEnrollments } = await supabase
        .from('user_enrollments')
        .select('user_id, course_id')
        .in('user_id', emailProfiles?.map(p => p.id) || []);
      
      const mismatches: SessionMismatch[] = [];
      
      // Case 1: No profile for current session user
      if (!sessionProfile && emailProfiles && emailProfiles.length > 0) {
        const profileWithEnrollments = emailProfiles.find(p => 
          emailEnrollments?.some(e => e.user_id === p.id)
        );
        
        if (profileWithEnrollments) {
          mismatches.push({
            email: sessionUser.email || 'Unknown',
            session_user_id: sessionUser.id,
            profile_user_id: profileWithEnrollments.id,
            enrollments_user_id: profileWithEnrollments.id,
            issue_type: 'no_profile'
          });
        }
      }
      
      // Case 2: Profile exists but enrollments are tied to different user ID
      if (sessionProfile && emailEnrollments && emailEnrollments.length > 0) {
        const enrollmentUserIds = [...new Set(emailEnrollments.map(e => e.user_id))];
        const otherEnrollmentUsers = enrollmentUserIds.filter(id => id !== sessionUser.id);
        
        if (otherEnrollmentUsers.length > 0 && sessionEnrollments?.length === 0) {
          mismatches.push({
            email: sessionUser.email || 'Unknown',
            session_user_id: sessionUser.id,
            profile_user_id: sessionProfile.id,
            enrollments_user_id: otherEnrollmentUsers[0],
            issue_type: 'enrollment_mismatch'
          });
        }
      }
      
      console.log('Found session mismatches:', mismatches);
      setSessionMismatches(mismatches);
      
    } catch (error) {
      console.error('Error finding session mismatches:', error);
    }
  };

  const findOrphanedEnrollments = async () => {
    try {
      console.log('🔍 Finding orphaned enrollments...');
      
      // Get all enrollments
      const { data: enrollments } = await supabase
        .from('user_enrollments')
        .select('user_id');
      
      if (!enrollments) return;
      
      // Get all profile user IDs
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email');
      
      const profileUserIds = new Set(profiles?.map(p => p.id) || []);
      const orphanedUserIds = [...new Set(enrollments
        .map(e => e.user_id)
        .filter(id => !profileUserIds.has(id))
      )];
      
      console.log('Orphaned enrollment user IDs:', orphanedUserIds);
      
      if (orphanedUserIds.length > 0) {
        const orphaned: DuplicateAccount[] = orphanedUserIds.map(userId => ({
          email: 'Unknown (Orphaned Enrollments)',
          user_ids: [userId],
          count: 1,
          type: 'orphaned_enrollments'
        }));
        
        setOrphanedEnrollments(orphaned);
      }
      
    } catch (error) {
      console.error('Error finding orphaned enrollments:', error);
    }
  };

  const fixSessionMismatch = async (mismatch: SessionMismatch) => {
    try {
      setProcessing(mismatch.email);
      console.log('🔄 Fixing session mismatch for:', mismatch.email);
      
      if (mismatch.issue_type === 'no_profile') {
        // Use the security definer function to create profile
        const { data, error: profileError } = await supabase.rpc('create_profile_for_user', {
          target_user_id: mismatch.session_user_id,
          user_email: mismatch.email,
          user_full_name: mismatch.email.split('@')[0]
        });
        
        if (profileError || !data) {
          throw profileError || new Error('Failed to create profile');
        }
        
        // Transfer enrollments to current session user
        if (mismatch.enrollments_user_id) {
          const { error: enrollmentError } = await supabase
            .from('user_enrollments')
            .update({ user_id: mismatch.session_user_id })
            .eq('user_id', mismatch.enrollments_user_id);
          
          if (enrollmentError) throw enrollmentError;
        }
        
        toast.success(`Fixed session mismatch for ${mismatch.email}`);
      } else if (mismatch.issue_type === 'enrollment_mismatch') {
        // Transfer enrollments to current session user
        const { error: enrollmentError } = await supabase
          .from('user_enrollments')
          .update({ user_id: mismatch.session_user_id })
          .eq('user_id', mismatch.enrollments_user_id || '');
        
        if (enrollmentError) throw enrollmentError;
        
        toast.success(`Transferred enrollments for ${mismatch.email}`);
      }
      
      // Refresh the analysis
      await findAllAccountIssues();
      
    } catch (error) {
      console.error('❌ Error fixing session mismatch:', error);
      toast.error(`Failed to fix session mismatch: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleFixClick = (issue: DuplicateAccount | SessionMismatch) => {
    setSelectedIssue(issue);
    setShowFixDialog(true);
  };

  const confirmFix = async () => {
    if (selectedIssue) {
      if ('session_user_id' in selectedIssue) {
        await fixSessionMismatch(selectedIssue);
      }
      // Add other fix types as needed
    }
    setShowFixDialog(false);
    setSelectedIssue(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Analyzing account issues...</p>
        </CardContent>
      </Card>
    );
  }

  const totalIssues = profileDuplicates.length + sessionMismatches.length + orphanedEnrollments.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Enhanced Account Issue Manager
          </CardTitle>
          <CardDescription>
            Comprehensive detection of account duplicates, session mismatches, and orphaned data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              <span className="text-sm font-medium">
                Found {totalIssues} account issues
              </span>
            </div>
            <Button onClick={findAllAccountIssues} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>

          {/* Current User Debug Info */}
          {currentUserInfo && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Current Session Debug Info:</h4>
              <div className="text-sm space-y-1">
                <p><strong>Session User ID:</strong> {currentUserInfo.id}</p>
                <p><strong>Email:</strong> {currentUserInfo.email}</p>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="session-mismatches" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="session-mismatches">
                Session Issues ({sessionMismatches.length})
              </TabsTrigger>
              <TabsTrigger value="profile-duplicates">
                Profile Duplicates ({profileDuplicates.length})
              </TabsTrigger>
              <TabsTrigger value="orphaned-data">
                Orphaned Data ({orphanedEnrollments.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="session-mismatches" className="space-y-4">
              {sessionMismatches.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Session Issues</h3>
                  <p className="text-muted-foreground">
                    All user sessions are properly aligned with profiles and data.
                  </p>
                </div>
              ) : (
                sessionMismatches.map((mismatch) => (
                  <Card key={`${mismatch.email}-${mismatch.session_user_id}`} className="border border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <UserX className="h-4 w-4 text-red-500" />
                          <span className="font-medium">{mismatch.email}</span>
                          <Badge variant="destructive">{mismatch.issue_type}</Badge>
                        </div>
                        <Button
                          onClick={() => handleFixClick(mismatch)}
                          disabled={processing === mismatch.email}
                          size="sm"
                          variant="default"
                        >
                          {processing === mismatch.email ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Fixing...
                            </>
                          ) : (
                            <>
                              <Merge className="h-3 w-3 mr-1" />
                              Fix Issue
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="p-2 bg-muted rounded">
                          <div><strong>Session User ID:</strong> {mismatch.session_user_id}</div>
                          <div><strong>Profile User ID:</strong> {mismatch.profile_user_id}</div>
                          {mismatch.enrollments_user_id && (
                            <div><strong>Enrollments User ID:</strong> {mismatch.enrollments_user_id}</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="profile-duplicates">
              {/* Existing profile duplicates logic */}
              {profileDuplicates.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Profile Duplicates</h3>
                  <p className="text-muted-foreground">
                    All user profiles have unique email addresses.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">Profile duplicate handling coming soon...</p>
              )}
            </TabsContent>
            
            <TabsContent value="orphaned-data">
              {orphanedEnrollments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Orphaned Data</h3>
                  <p className="text-muted-foreground">
                    All enrollments are properly linked to user profiles.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">Orphaned data handling coming soon...</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Fix Confirmation Dialog */}
      <AlertDialog open={showFixDialog} onOpenChange={setShowFixDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fix Account Issue</AlertDialogTitle>
            <AlertDialogDescription>
              This will attempt to fix the account issue for{' '}
              <strong>
                {'email' in (selectedIssue || {}) ? (selectedIssue as any).email : 'selected account'}
              </strong>.
              This action will modify user data and cannot be easily undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmFix}>
              Fix Issue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnhancedDuplicateAccountsManager;
