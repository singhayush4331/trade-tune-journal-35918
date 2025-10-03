import React, { useEffect, useState } from 'react';
import { User, LogOut, CreditCard, ArrowLeftRight, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ThemeToggle from '@/components/theme/ThemeToggle';
import HeaderNav from './HeaderNav';
import { signOutUser } from '@/services/auth-service';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserRoles } from '@/utils/roles-cache';

const getPageTitle = (pathname: string): string => {
  const paths: Record<string, string> = {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/trades': 'Trades',
    '/trades/new': 'New Trade',
    '/calendar': 'Calendar',
    '/calendarview': 'Calendar',
    '/position-sizing': 'Position',
    '/funds': 'Funds',
    '/playbooks': 'Playbooks',
    '/academy': 'Academy',
    '/profile': 'Profile',
    '/ai-chatbot': 'AI',
    '/gallery': 'Gallery',
    '/subscription': 'Subscription',
  };
  
  return paths[pathname] || 'Dashboard';
};

// Helper function to determine if current context is Wiggly platform
const isWigglyContext = (pathname: string): boolean => {
  const wigglyRoutes = [
    '/wiggly', '/wiggly-AI'
  ];
  
  return wigglyRoutes.some(route => pathname.startsWith(route));
};

// Helper function to normalize role names for comparison
const normalizeRoleName = (roleName: string): string => {
  return roleName.toLowerCase().replace(/\s+/g, '_');
};

// Helper function to check if a role indicates premium access
const isPremiumRole = (roleName: string): boolean => {
  const normalizedRole = normalizeRoleName(roleName);
  const premiumRoles = [
    'premium_user', 'premium', 'basic_user', 'basic', 
    'trial_user', 'trial', 'free_user', 'free'
  ];
  return premiumRoles.includes(normalizedRole);
};

// Helper function to check if a role indicates academy access
const isAcademyRole = (roleName: string): boolean => {
  const normalizedRole = normalizeRoleName(roleName);
  return normalizedRole.includes('academy') || normalizedRole.includes('haven_ark');
};

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);
  const { user, refreshData } = useAuth();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAcademyOnly, setIsAcademyOnly] = useState(false);
  const [hasHavenArkAccess, setHavenArkAccess] = useState(false);
  const [userRolesLoaded, setUserRolesLoaded] = useState(false);
  
  // Check if current route is academy-related
  const isAcademyPage = location.pathname.startsWith('/academy');
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is academy-only
  useEffect(() => {
    const checkUserRoles = async () => {
      if (!user?.id) {
        setIsAcademyOnly(false);
        setUserRolesLoaded(true);
        return;
      }

        const { roles: userRoles, maxHierarchyLevel } = await getCurrentUserRoles();

        const isAdmin = maxHierarchyLevel >= 90;
        
        // Check for new Haven ARK Masterclass role
        const hasHavenArkRole = userRoles.some(role => 
          normalizeRoleName(role).includes('haven_ark')
        );
        
        // Check for academy roles
        const hasAcademyRole = userRoles.some(role => 
          isAcademyRole(role)
        );
        
        // Check for premium/platform access roles with improved logic
        const hasPremiumAccess = userRoles.some(role => {
          const normalizedRole = normalizeRoleName(role);
          return isPremiumRole(role) || 
                 normalizedRole.includes('premium') ||
                 normalizedRole.includes('basic') ||
                 normalizedRole.includes('trial') ||
                 normalizedRole.includes('free') ||
                 normalizedRole.includes('wiggly');
        });
        
        // Academy-only users are those who ONLY have academy roles and no platform access
        const academyOnly = hasAcademyRole && !hasPremiumAccess && !isAdmin;

        setIsAcademyOnly(academyOnly);
        setHavenArkAccess(hasHavenArkRole);
        setUserRolesLoaded(true);
    };

    checkUserRoles();
  }, [user?.id, user?.email]);

  const handleLogout = () => {
    toast('Are you sure you want to log out?', {
      action: {
        label: 'Log out',
        onClick: async () => {
          try {
            const { error } = await signOutUser();
            
            if (error) {
              throw error;
            }
            
            toast.success('Logged out successfully');
            refreshData(); // Trigger data refresh
            
            navigate('/login', { replace: true });
          } catch (error: any) {
            toast.error(error.message || 'Failed to log out');
            console.error('Logout error:', error);
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
        },
      },
      duration: 5000,
    });
  };

  const lightLogoUrl = "/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png";
  const darkLogoUrl = "/lovable-uploads/6120e2e2-296a-403d-a2a3-7cae3e7241fa.png";
  
  const logoUrl = mounted && resolvedTheme === 'dark' ? darkLogoUrl : lightLogoUrl;

  // Determine the logo link destination based on context and user roles
  const getLogoDestination = () => {
    if (!userRolesLoaded) return '#'; // Don't navigate until we know the user's roles
    
    // For Academy pages, always go to academy
    if (isAcademyPage) {
      return '/academy';
    }
    
    // For Academy-only users, go to academy
    if (isAcademyOnly) {
      return '/academy';
    }
    
    // For Wiggly marketing/landing pages, stay in Wiggly context
    if (isWigglyContext(location.pathname)) {
      return '/wiggly';
    }
    
    // For all main app pages (dashboard, trades, etc.), go to dashboard
    return '/dashboard';
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (!userRolesLoaded) {
      e.preventDefault();
      return;
    }
    // Let the Link handle the navigation normally
  };

  // Academy-specific header styling with enhanced emerald color scheme
  const getHeaderClasses = () => {
    if (isAcademyPage) {
      return "border-b border-emerald-300/30 dark:border-emerald-500/30 sticky top-0 z-30 bg-gradient-to-r from-emerald-50/98 via-emerald-100/98 to-emerald-50/98 dark:from-emerald-950/98 dark:via-emerald-900/98 dark:to-emerald-950/98 backdrop-blur-lg shadow-lg";
    }
    return "border-b border-border/40 sticky top-0 z-30 bg-background/95 backdrop-blur-md shadow-sm";
  };

  // Define emerald colors for academy pages
  const academyColors = {
    light: '#065F46', // emerald-800
    dark: '#6EE7B7'   // emerald-300
  };

  const getAcademyTextColor = () => {
    if (!isAcademyPage) return {};
    return {
      color: resolvedTheme === 'dark' ? academyColors.dark : academyColors.light,
      '--text-color': resolvedTheme === 'dark' ? academyColors.dark : academyColors.light
    } as React.CSSProperties;
  };

  const getUserDropdownProps = () => {
    if (isAcademyPage) {
      return {
        className: "rounded-full hover:bg-emerald-500/15 dark:hover:bg-emerald-400/15 w-8 h-8 sm:w-9 sm:h-9 transition-all duration-200",
        style: {
          color: resolvedTheme === 'dark' ? academyColors.dark : academyColors.light
        }
      };
    }
    return {
      className: "rounded-full hover:bg-primary/10 w-8 h-8 sm:w-9 sm:h-9"
    };
  };

  const getDropdownContentClasses = () => {
    if (isAcademyPage) {
      return "border-emerald-200/30 dark:border-emerald-600/30 shadow-xl bg-white/98 dark:bg-emerald-950/98 backdrop-blur-lg w-48 sm:w-56";
    }
    return "border-border/40 shadow-lg bg-card/80 backdrop-blur-md w-48 sm:w-56";
  };

  const getDropdownSeparatorClasses = () => {
    if (isAcademyPage) {
      return "bg-emerald-200/40 dark:bg-emerald-600/30";
    }
    return "bg-border/40";
  };

  const getDropdownItemClasses = () => {
    if (isAcademyPage) {
      return "text-emerald-800 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-emerald-100 hover:bg-emerald-100/40 dark:hover:bg-emerald-500/15";
    }
    return "";
  };

  const getThemeToggleClasses = () => {
    if (isAcademyPage) {
      return "hover:bg-emerald-200/30 dark:hover:bg-emerald-500/20 rounded-md p-1 transition-all duration-200";
    }
    return "";
  };

  // Academy page title with forced emerald colors using inline styles
  const getPageTitleProps = () => {
    if (isAcademyPage) {
      return {
        className: 'font-bold drop-shadow-sm',
        style: {
          color: resolvedTheme === 'dark' ? '#6EE7B7 !important' : '#065F46 !important', // emerald-300 dark, emerald-800 light with !important
        }
      };
    }
    return {
      className: 'bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold'
    };
  };

  const userDropdownProps = getUserDropdownProps();
  const pageTitleProps = getPageTitleProps();

  return (
    <header className={getHeaderClasses()}>
      <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md flex items-center justify-center mr-1 sm:mr-2 overflow-hidden p-1">
            {mounted ? (
              <Link to={getLogoDestination()} onClick={handleLogoClick}>
                <img 
                  src={logoUrl} 
                  alt="Wiggly Logo" 
                  className="w-full h-full object-contain"
                  style={{ minWidth: "100%", minHeight: "100%" }}
                />
              </Link>
            ) : (
              <div className="w-full h-full bg-primary/10 animate-pulse"></div>
            )}
          </div>
          
          <h1 
            className={`text-lg sm:text-xl hidden md:block ${pageTitleProps.className}`}
            style={pageTitleProps.style}
          >
            {pageTitle}
          </h1>
          
          {/* Academy Interface Switching Button - Moved to left side */}
          {userRolesLoaded && !isAcademyOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const targetPath = isAcademyPage ? '/dashboard' : '/academy';
                navigate(targetPath);
              }}
              className={`
                hidden sm:flex items-center gap-2 text-xs px-3 py-1 h-8 transition-all duration-200 ml-4
                ${isAcademyPage 
                  ? 'border-emerald-200/40 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/50 hover:border-emerald-300/60 dark:border-emerald-600/40 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-800/30' 
                  : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/30'
                }
              `}
            >
              {isAcademyPage ? (
                <>
                  <TrendingUp className="h-3.5 w-3.5" />
                  Trading Tools
                </>
              ) : (
                <>
                  <BookOpen className="h-3.5 w-3.5" />
                  Academy
                </>
              )}
            </Button>
          )}
        </div>
        
        <div className="flex-1 flex items-center justify-between md:justify-end">
          <div className="md:hidden ml-1 sm:ml-2">
            <h1 
              className={`text-base sm:text-lg ${pageTitleProps.className}`}
              style={pageTitleProps.style}
            >
              {pageTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <HeaderNav isAcademyOnly={isAcademyOnly} userRolesLoaded={userRolesLoaded} />
            
            <div className="flex items-center gap-1 sm:gap-2">
              <div className={getThemeToggleClasses()}>
                <ThemeToggle />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={userDropdownProps.className}
                    style={userDropdownProps.style}
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={getDropdownContentClasses()}>
                  <DropdownMenuLabel className={`text-xs sm:text-sm truncate ${isAcademyPage ? 'text-emerald-800 dark:text-emerald-200' : ''}`}>
                    {user ? user.user_metadata?.full_name || user.email : 'My Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className={getDropdownSeparatorClasses()} />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className={`text-xs sm:text-sm ${getDropdownItemClasses()}`}>
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {!isAcademyOnly && (
                    <DropdownMenuItem asChild>
                      <Link to="/subscription" className={`text-xs sm:text-sm ${getDropdownItemClasses()}`}>
                        <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                        Subscription
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className={getDropdownSeparatorClasses()} />
                  <DropdownMenuItem onClick={handleLogout} className={`text-xs sm:text-sm ${getDropdownItemClasses()}`}>
                    <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
