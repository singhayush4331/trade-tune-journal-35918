import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  IndianRupee,
  Home,
  LayoutDashboard,
  Library,
  PlusCircle,
  Calculator,
  Images,
  Brain,
  BookText,
  Settings,
  User,
  Link as LinkIcon,
  GraduationCap
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserRoles } from '@/utils/roles-cache';
// Helper function to determine if current context is Wiggly platform
const isWigglyContext = (pathname: string): boolean => {
  const wigglyRoutes = [
    '/dashboard', '/trades', '/calendar', '/calendarview', '/position-sizing',
    '/funds', '/playbooks', '/profile', '/ai-chatbot', '/gallery', '/subscription',
    '/wiggly-AI', '/notebook', '/admin'
  ];
  
  return wigglyRoutes.some(route => pathname.startsWith(route)) || pathname === '/';
};

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAcademyOnly, setIsAcademyOnly] = useState(false);
  const ADMIN_EMAIL = 'shadygamer007@gmail.com';
  
  useEffect(() => {
    setMounted(true);
    
    // Check if current user is admin or academy-only
    const checkUserAccess = async () => {
      if (!user) return;

      try {
        // Special handling for known admin email
        if (user.email === ADMIN_EMAIL) {
          setIsAdmin(true);
          setIsAcademyOnly(false);
          return;
        }

        // Check admin status
        const { data: adminStatus, error: adminError } = await supabase
          .rpc('is_admin_secure', { check_user_id: user.id });

        if (!adminError) {
          setIsAdmin(adminStatus || false);
        }
        
        // Check academy-only status (via cached roles)
        try {
          const { roles } = await getCurrentUserRoles();
          const hasAcademyRole = roles.includes('academy_student');
          setIsAcademyOnly(hasAcademyRole && !(adminStatus || false));
        } catch (e) {
          setIsAcademyOnly(false);
        }
      } catch (error) {
        console.error('Error checking user access:', error);
        setIsAdmin(false);
        setIsAcademyOnly(false);
      }
    };

    checkUserAccess();
  }, [user]);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Trades',
      path: '/trades',
      icon: Home
    },
    {
      title: 'Calendar',
      path: '/calendar',
      icon: CalendarDays
    },
    {
      title: 'Gallery',
      path: '/gallery',
      icon: Images
    },
    {
      title: 'Position Sizing',
      path: '/position-sizing',
      icon: Calculator
    },
    {
      title: 'Wiggly AI',
      path: '/wiggly-AI',
      icon: Brain
    },
    {
      title: 'Notebook',
      path: '/notebook',
      icon: BookText
    },
    {
      title: 'Playbooks',
      path: '/playbooks',
      icon: Library
    },
    {
      title: 'Academy',
      path: '/academy',
      icon: GraduationCap
    },
    {
      title: 'Funds',
      path: '/funds',
      icon: IndianRupee
    }
  ];

  // Filter menu items based on user access
  const filteredMenuItems = isAcademyOnly 
    ? menuItems.filter(item => item.path === '/academy')
    : menuItems;

  // Add admin page to menu items if user is admin
  const adminItems = isAdmin ? [
    {
      title: 'Platform Admin',
      path: '/admin',
      icon: Settings
    },
    {
      title: 'Academy Admin',
      path: '/admin/academy',
      icon: GraduationCap
    },
  ] : [];

  const lightLogoUrl = "/lovable-uploads/cee9ac58-3a60-4703-840f-425403c6488c.png";
  const darkLogoUrl = "/lovable-uploads/cee9ac58-3a60-4703-840f-425403c6488c.png";
  const logoUrl = mounted && resolvedTheme === 'dark' ? darkLogoUrl : lightLogoUrl;

  // Determine the logo link destination based on context and user roles
  const getLogoDestination = () => {
    // For Academy-only users, go to academy
    if (isAcademyOnly) {
      return '/academy';
    }
    
    // For Wiggly platform context, go to Wiggly landing page
    if (isWigglyContext(location.pathname)) {
      return '/wiggly';
    }
    
    // Default fallback to dashboard
    return '/dashboard';
  };

  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <div className="flex items-center justify-center mb-4">
          <Link to={getLogoDestination()} className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden">
              {mounted ? (
                <img 
                  src={logoUrl} 
                  alt="Wiggly logo - trading dashboard"
                  className="w-full h-full object-contain"
                  style={{ minWidth: "100%", minHeight: "100%" }}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 animate-pulse"></div>
              )}
            </div>
            <span className="text-base sm:text-lg font-bold text-sidebar-foreground">Wiggly</span>
          </Link>
        </div>
        {!isAcademyOnly && (
          <Button className="w-full text-sm" onClick={() => navigate('/trade-form')}>
            <PlusCircle className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Log Trade
          </Button>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs">
            {isAcademyOnly ? "Academy" : "Trading"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className={cn(
                    isActive(item.path) && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}>
                    <Link to={item.path} className="flex items-center text-xs sm:text-sm">
                      <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="ml-2 truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {isAdmin && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-xs">Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild className={cn(
                      isActive(item.path) && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}>
                      <Link to={item.path} className="flex items-center text-xs sm:text-sm">
                        <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="ml-2 truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs">User</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(
                  isActive('/profile') && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}>
                  <Link to="/profile" className="flex items-center text-xs sm:text-sm">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="ml-2 truncate">Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="pb-4">
        <div className="px-3 mt-4">
          <SidebarTrigger variant="outline" className="w-full" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
