
import React, { useState, useEffect } from 'react';
import { User, LogOut, CreditCard, TrendingUp, Shield } from 'lucide-react';
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
import { signOutUser } from '@/services/auth-service';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from 'next-themes';
import { getMaxHierarchyLevel } from '@/utils/roles-cache';
const getPageTitle = (pathname: string): string => {
  const paths: Record<string, string> = {
    '/academy': 'Academy',
    '/academy/admin': 'Academy Admin',
    '/academy/courses': 'Courses',
    '/academy/assigned-courses': 'My Courses',
  };
  
  // Handle dynamic course routes
  if (pathname.startsWith('/academy/course/')) {
    return 'Course';
  }
  
  return paths[pathname] || 'Academy';
};

const AcademyHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);
  const { user, refreshData } = useAuth();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is admin for Academy Admin Panel
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        return;
      }

      try {
        const level = await getMaxHierarchyLevel();
        setIsAdmin(level >= 90);
      } catch (error) {
        console.error('Error checking admin role:', error);
      }
    };

    checkAdminRole();
  }, [user]);

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
            refreshData();
            
            // Redirect to Academy login page instead of Wiggly login
            navigate('/haven-ark/login', { replace: true });
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

  const handleSwitchToWiggly = () => {
    navigate('/dashboard');
  };

  // Define emerald colors for academy pages
  const academyColors = {
    light: '#065F46', // emerald-800
    dark: '#6EE7B7'   // emerald-300
  };

  const getHeaderClasses = () => {
    return "border-b border-emerald-300/30 dark:border-emerald-500/30 sticky top-0 z-30 bg-gradient-to-r from-emerald-50/98 via-emerald-100/98 to-emerald-50/98 dark:from-emerald-950/98 dark:via-emerald-900/98 dark:to-emerald-950/98 backdrop-blur-lg shadow-lg";
  };

  const getUserDropdownProps = () => {
    return {
      className: "rounded-full hover:bg-emerald-500/15 dark:hover:bg-emerald-400/15 w-8 h-8 sm:w-9 sm:h-9 transition-all duration-200",
      style: {
        color: resolvedTheme === 'dark' ? academyColors.dark : academyColors.light
      }
    };
  };

  const getDropdownContentClasses = () => {
    return "border-emerald-200/30 dark:border-emerald-600/30 shadow-xl bg-white/98 dark:bg-emerald-950/98 backdrop-blur-lg w-48 sm:w-56";
  };

  const getDropdownSeparatorClasses = () => {
    return "bg-emerald-200/40 dark:bg-emerald-600/30";
  };

  const getDropdownItemClasses = () => {
    return "text-emerald-800 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-emerald-100 hover:bg-emerald-100/40 dark:hover:bg-emerald-500/15";
  };

  const getThemeToggleClasses = () => {
    return "hover:bg-emerald-200/30 dark:hover:bg-emerald-500/20 rounded-md p-1 transition-all duration-200";
  };

  const getPageTitleProps = () => {
    return {
      className: 'font-bold drop-shadow-sm',
      style: {
        color: resolvedTheme === 'dark' ? '#6EE7B7 !important' : '#065F46 !important',
      }
    };
  };

  const userDropdownProps = getUserDropdownProps();
  const pageTitleProps = getPageTitleProps();

  return (
    <header className={getHeaderClasses()}>
      <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Haven Ark Branding */}
          <div className="flex items-center mr-2 sm:mr-4">
            <Link to="/academy" className="flex items-center">
              <h1 
                className="text-xl sm:text-2xl font-bold tracking-tight"
                style={{
                  color: resolvedTheme === 'dark' ? academyColors.dark : academyColors.light
                }}
              >
                Haven Ark
              </h1>
            </Link>
          </div>
          
          <h2 
            className={`text-lg sm:text-xl hidden md:block ${pageTitleProps.className}`}
            style={pageTitleProps.style}
          >
            {pageTitle}
          </h2>
        </div>
        
        <div className="flex-1 flex items-center justify-between md:justify-end">
          <div className="md:hidden ml-1 sm:ml-2">
            <h2 
              className={`text-base sm:text-lg ${pageTitleProps.className}`}
              style={pageTitleProps.style}
            >
              {pageTitle}
            </h2>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {/* Switch to Wiggly Platform Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwitchToWiggly}
              className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 h-7 transition-all duration-200 text-emerald-600/80 hover:text-emerald-700 hover:bg-emerald-100/40 dark:text-emerald-400/80 dark:hover:text-emerald-300 dark:hover:bg-emerald-500/15"
            >
              <img 
                src={resolvedTheme === 'dark' ? 
                  "/lovable-uploads/6120e2e2-296a-403d-a2a3-7cae3e7241fa.png" : 
                  "/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png"
                } 
                alt="Wiggly Logo" 
                className="w-3.5 h-3.5 object-contain"
              />
              Wiggly
            </Button>

            {/* Academy Admin Panel Button for Admins */}
            {isAdmin && (
              <Button 
                asChild 
                variant="outline" 
                size="sm"
                className="hidden sm:flex items-center gap-2 text-xs px-3 py-1 h-8 border-emerald-200/40 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/50 hover:border-emerald-300/60 dark:border-emerald-600/40 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-800/30"
              >
                <Link to="/academy/admin" className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  Admin Panel
                </Link>
              </Button>
            )}
            
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
                  <DropdownMenuLabel className={`text-xs sm:text-sm truncate text-emerald-800 dark:text-emerald-200`}>
                    {user ? user.user_metadata?.full_name || user.email : 'My Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className={getDropdownSeparatorClasses()} />
                  <DropdownMenuItem asChild>
                    <Link to="/academy/profile" className={`text-xs sm:text-sm ${getDropdownItemClasses()}`}>
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
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

export default AcademyHeader;
