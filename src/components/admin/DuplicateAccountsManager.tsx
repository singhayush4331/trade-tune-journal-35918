
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
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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

interface DuplicateAccount {
  email: string;
  user_ids: string[];
  count: number;
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  roles: string[];
}

const DuplicateAccountsManager: React.FC = () => {
  const [duplicates, setDuplicates] = useState<DuplicateAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedDuplicate, setSelectedDuplicate] = useState<DuplicateAccount | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, UserData>>({});
  const [showMergeDialog, setShowMergeDialog] = useState(false);

  useEffect(() => {
    findDuplicateAccounts();
  }, []);

  const findDuplicateAccounts = async () => {
    try {
      setLoading(true);
      console.log('🔍 Finding duplicate accounts...');
      
      // Get all profiles grouped by email
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .not('email', 'is', null);
      
      if (profilesError) throw profilesError;
      
      // Group by email and find duplicates
      const emailGroups: Record<string, UserData[]> = {};
      
      for (const profile of profiles || []) {
        if (!emailGroups[profile.email]) {
          emailGroups[profile.email] = [];
        }
        emailGroups[profile.email].push({
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name || 'No Name',
          created_at: profile.created_at,
          roles: []
        });
      }
      
      // Find emails with more than one account
      const duplicatesList: DuplicateAccount[] = [];
      const userDetailsMap: Record<string, UserData> = {};
      
      for (const [email, users] of Object.entries(emailGroups)) {
        if (users.length > 1) {
          duplicatesList.push({
            email,
            user_ids: users.map(u => u.id),
            count: users.length
          });
          
          // Get roles for each user
          for (const user of users) {
            try {
              const { data: roles } = await supabase
                .from('user_roles')
                .select(`
                  roles!inner(name)
                `)
                .eq('user_id', user.id);
              
              user.roles = roles?.map(r => r.roles.name) || [];
              userDetailsMap[user.id] = user;
            } catch (error) {
              console.error('Error fetching roles for user:', user.id, error);
              user.roles = [];
              userDetailsMap[user.id] = user;
            }
          }
        }
      }
      
      setDuplicates(duplicatesList);
      setUserDetails(userDetailsMap);
      console.log('✅ Found duplicates:', duplicatesList.length);
      
    } catch (error) {
      console.error('❌ Error finding duplicates:', error);
      toast.error('Failed to find duplicate accounts');
    } finally {
      setLoading(false);
    }
  };

  const mergeDuplicateAccounts = async (duplicate: DuplicateAccount) => {
    try {
      setProcessing(duplicate.email);
      console.log(`🔄 Merging duplicate accounts for: ${duplicate.email}`);
      
      // Sort user IDs by creation date (keep the newest)
      const sortedUsers = duplicate.user_ids
        .map(id => userDetails[id])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      const keepUserId = sortedUsers[0].id;
      const removeUserIds = sortedUsers.slice(1).map(u => u.id);
      
      console.log(`📝 Keeping user: ${keepUserId}, removing: ${removeUserIds.join(', ')}`);
      
      // Merge each duplicate account
      for (const removeUserId of removeUserIds) {
        const { data, error } = await supabase
          .rpc('merge_duplicate_accounts', {
            keep_user_id: keepUserId,
            remove_user_id: removeUserId
          });
        
        if (error) {
          console.error(`❌ Error merging ${removeUserId}:`, error);
          throw error;
        }
        
        console.log(`✅ Merged ${removeUserId} into ${keepUserId}`);
      }
      
      toast.success(`Successfully merged ${removeUserIds.length} duplicate accounts for ${duplicate.email}`);
      
      // Refresh the list
      await findDuplicateAccounts();
      
    } catch (error) {
      console.error('❌ Error merging accounts:', error);
      toast.error(`Failed to merge accounts: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleMergeClick = (duplicate: DuplicateAccount) => {
    setSelectedDuplicate(duplicate);
    setShowMergeDialog(true);
  };

  const confirmMerge = async () => {
    if (selectedDuplicate) {
      await mergeDuplicateAccounts(selectedDuplicate);
    }
    setShowMergeDialog(false);
    setSelectedDuplicate(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Scanning for duplicate accounts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Duplicate Account Manager
          </CardTitle>
          <CardDescription>
            Identify and merge duplicate user accounts to maintain data integrity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">
                Found {duplicates.length} email addresses with duplicate accounts
              </span>
            </div>
            <Button onClick={findDuplicateAccounts} variant="outline" size="sm">
              Refresh Scan
            </Button>
          </div>
          
          {duplicates.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Duplicate Accounts Found</h3>
              <p className="text-muted-foreground">
                All user accounts have unique email addresses.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {duplicates.map((duplicate) => (
                <Card key={duplicate.email} className="border border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{duplicate.email}</span>
                        <Badge variant="destructive">{duplicate.count} accounts</Badge>
                      </div>
                      <Button
                        onClick={() => handleMergeClick(duplicate)}
                        disabled={processing === duplicate.email}
                        size="sm"
                        variant="default"
                      >
                        {processing === duplicate.email ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Merging...
                          </>
                        ) : (
                          <>
                            <Merge className="h-3 w-3 mr-1" />
                            Merge Accounts
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {duplicate.user_ids.map((userId) => {
                        const user = userDetails[userId];
                        if (!user) return null;
                        
                        return (
                          <div key={userId} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div>
                              <div className="text-sm font-medium">{user.full_name}</div>
                              <div className="text-xs text-muted-foreground">
                                ID: {userId.slice(0, 8)}... • Created: {new Date(user.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {user.roles.map((role) => (
                                <Badge key={role} variant="outline" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Merge Confirmation Dialog */}
      <AlertDialog open={showMergeDialog} onOpenChange={setShowMergeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Merge Duplicate Accounts</AlertDialogTitle>
            <AlertDialogDescription>
              This will merge all duplicate accounts for <strong>{selectedDuplicate?.email}</strong>.
              The newest account will be kept, and all data from older accounts will be transferred to it.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMerge}>
              Merge Accounts
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DuplicateAccountsManager;
