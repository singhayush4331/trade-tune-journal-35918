
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users,
  BarChart3,
  UserCheck,
  BellRing,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import BroadcastMessaging from '@/components/admin/BroadcastMessaging';
import EnhancedDuplicateAccountsManager from '@/components/admin/EnhancedDuplicateAccountsManager';
import HavenArkAccountManager from '@/components/admin/HavenArkAccountManager';
import ComprehensiveUserManagement from '@/components/admin/ComprehensiveUserManagement';
import UnifiedAdminDashboard from '@/components/admin/UnifiedAdminDashboard';
import UnifiedAcademyManagement from '@/components/admin/UnifiedAcademyManagement';
import UnifiedAnalyticsDashboard from '@/components/admin/UnifiedAnalyticsDashboard';

const AdminPage = () => {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Handle URL parameters for direct tab navigation
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['dashboard', 'users', 'academy', 'analytics', 'communications', 'system'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Check admin access
  React.useEffect(() => {
    const checkAdminAccess = async () => {
      if (!currentUser) return;

      try {
        const ADMIN_EMAIL = 'shadygamer007@gmail.com';
        
        if (currentUser.email === ADMIN_EMAIL) {
          // Force grant admin role for known admin
          const { error: adminRoleError } = await supabase
            .rpc('add_role_to_user', { target_user_id: currentUser.id, role_name: 'admin' });
            
          if (adminRoleError) {
            console.error('Failed to ensure admin role:', adminRoleError);
            toast.error('Failed to setup admin privileges');
            navigate('/dashboard');
            return;
          }
        } else {
          // Check admin status for other users
          const { data: isAdmin, error } = await supabase
            .rpc('is_admin_secure', { check_user_id: currentUser.id });

          if (error || !isAdmin) {
            toast.error('You do not have admin privileges');
            navigate('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        toast.error('Error checking admin access, please try again');
        navigate('/dashboard');
      }
    };

    if (!authLoading) {
      checkAdminAccess();
    }
  }, [currentUser, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Unified management for Wiggly platform and Academy
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="academy" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Academy</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="communications" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            <span className="hidden sm:inline">Comms</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <UnifiedAdminDashboard />
        </TabsContent>
        
        <TabsContent value="users">
          <ComprehensiveUserManagement />
        </TabsContent>
        
        <TabsContent value="academy">
          <UnifiedAcademyManagement />
        </TabsContent>
        
        <TabsContent value="analytics">
          <UnifiedAnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="communications">
          <BroadcastMessaging />
        </TabsContent>
        
        <TabsContent value="system">
          <div className="space-y-6">
            <HavenArkAccountManager />
            <EnhancedDuplicateAccountsManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
