import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Shield, 
  UserX,
  Clock,
  Settings
} from 'lucide-react';
import { detectRoleConflicts, resolveUserRoleConflicts, cleanupExpiredRoles, scheduleRoleCleanup } from '@/services/academy-service';
import { toast } from 'sonner';

interface RoleConflict {
  userId: string;
  email: string;
  conflictingRoles: string[];
  conflictType: string;
}

const RoleConflictManager: React.FC = () => {
  const [conflicts, setConflicts] = useState<RoleConflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);
  const [cleaning, setCleaning] = useState(false);

  const loadConflicts = async () => {
    try {
      setLoading(true);
      const conflictData = await detectRoleConflicts();
      setConflicts(conflictData);
    } catch (error) {
      console.error('Error loading role conflicts:', error);
      toast.error('Failed to load role conflicts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConflicts();
  }, []);

  const handleResolveConflict = async (userId: string, email: string) => {
    try {
      setResolving(userId);
      const success = await resolveUserRoleConflicts(userId);
      
      if (success) {
        toast.success(`Resolved role conflicts for ${email}`);
        await loadConflicts(); // Reload to see changes
      } else {
        toast.error(`Failed to resolve conflicts for ${email}`);
      }
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast.error('Error resolving role conflict');
    } finally {
      setResolving(null);
    }
  };

  const handleCleanupExpiredRoles = async () => {
    try {
      setCleaning(true);
      const success = await cleanupExpiredRoles();
      
      if (success) {
        toast.success('Cleaned up expired roles');
        await loadConflicts(); // Reload to see changes
      } else {
        toast.error('Failed to cleanup expired roles');
      }
    } catch (error) {
      console.error('Error cleaning up roles:', error);
      toast.error('Error cleaning up expired roles');
    } finally {
      setCleaning(false);
    }
  };

  const handleScheduleCleanup = async () => {
    try {
      const success = await scheduleRoleCleanup();
      
      if (success) {
        toast.success('Scheduled role cleanup completed');
        await loadConflicts(); // Reload to see changes
      } else {
        toast.error('Failed to complete scheduled cleanup');
      }
    } catch (error) {
      console.error('Error with scheduled cleanup:', error);
      toast.error('Error with scheduled cleanup');
    }
  };

  const getConflictTypeColor = (type: string) => {
    switch (type) {
      case 'premium_trial_conflict':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'premium_free_conflict':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'hierarchy_conflict':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getConflictTypeLabel = (type: string) => {
    switch (type) {
      case 'premium_trial_conflict':
        return 'Premium + Trial';
      case 'premium_free_conflict':
        return 'Premium + Free';
      case 'hierarchy_conflict':
        return 'Hierarchy Conflict';
      default:
        return 'Other Conflict';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Conflict Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading role conflicts...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Conflict Manager
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Detect and resolve user role conflicts automatically
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadConflicts}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCleanupExpiredRoles}
                disabled={cleaning}
              >
                <Clock className={`h-4 w-4 mr-2 ${cleaning ? 'animate-spin' : ''}`} />
                Cleanup Expired
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleScheduleCleanup}
              >
                <Settings className="h-4 w-4 mr-2" />
                Full Cleanup
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{conflicts.length}</p>
                <p className="text-sm text-muted-foreground">Total Conflicts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <UserX className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {conflicts.filter(c => c.conflictType === 'premium_trial_conflict').length}
                </p>
                <p className="text-sm text-muted-foreground">Premium + Trial</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {conflicts.filter(c => c.conflictType === 'hierarchy_conflict').length}
                </p>
                <p className="text-sm text-muted-foreground">Hierarchy Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflicts List */}
      <Card>
        <CardHeader>
          <CardTitle>Role Conflicts ({conflicts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {conflicts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-3" />
              <p className="text-lg font-medium text-green-800">No Role Conflicts Found</p>
              <p className="text-sm text-muted-foreground">All user roles are properly configured</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {conflicts.map((conflict) => (
                  <div key={conflict.userId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {conflict.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{conflict.email}</p>
                            <p className="text-xs text-muted-foreground">ID: {conflict.userId}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getConflictTypeColor(conflict.conflictType)}>
                            {getConflictTypeLabel(conflict.conflictType)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {conflict.conflictingRoles.length} conflicting roles
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {conflict.conflictingRoles.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleResolveConflict(conflict.userId, conflict.email)}
                        disabled={resolving === conflict.userId}
                        className="ml-4"
                      >
                        {resolving === conflict.userId ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Resolving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Resolve
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Information */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Role Conflict Resolution:</strong> The system automatically resolves conflicts by removing lower-tier roles when higher-tier roles are present. 
          Premium roles take precedence over Trial and Free roles. Backup data is logged for audit purposes.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default RoleConflictManager;