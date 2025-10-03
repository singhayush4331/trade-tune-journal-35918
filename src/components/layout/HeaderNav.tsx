import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CalendarDays,
  Home,
  LayoutDashboard,
  Library,
  Menu,
  Images,
  IndianRupee,
  Bot,
  X,
  BookText,
  FileText,
  Link as LinkIcon,
  GraduationCap
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from 'next-themes';

interface HeaderNavProps {
  isAcademyOnly: boolean;
  userRolesLoaded: boolean;
}

const HeaderNav: React.FC<HeaderNavProps> = ({ isAcademyOnly, userRolesLoaded }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Check if current route is academy-related
  const isAcademyPage = location.pathname.startsWith('/academy');

  // Define emerald colors for academy pages
  const academyColors = {
    light: '#065F46', // emerald-800
    dark: '#6EE7B7'   // emerald-300
  };
  
  // ... keep existing code (allMenuItems array definition)
  const allMenuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      description: 'View your trading performance metrics and insights',
      academyAllowed: false
    },
    {
      title: 'Trades',
      path: '/trades',
      icon: FileText,
      description: 'View and manage your trade entries',
      academyAllowed: false
    },
    {
      title: 'Calendar',
      path: '/calendar',
      icon: CalendarDays,
      description: 'Analyze your trading performance over time',
      academyAllowed: false
    },
    {
      title: 'Gallery',
      path: '/gallery',
      icon: Images,
      description: 'View screenshots of your trade setups',
      academyAllowed: false
    },
    {
      title: 'Wiggly AI',
      path: '/wiggly-AI',
      icon: Bot,
      description: 'Get AI-powered insights on your trading',
      academyAllowed: false
    },
    {
      title: 'Notebook',
      path: '/notebook',
      icon: BookText,
      description: 'Take notes on market conditions and strategies',
      academyAllowed: false
    },
    {
      title: 'Playbooks',
      path: '/playbooks',
      icon: Library,
      description: 'Create and manage your trading strategies',
      academyAllowed: false
    },
    {
      title: 'Funds',
      path: '/funds',
      icon: IndianRupee,
      description: 'Track your trading capital and performance',
      academyAllowed: false
    }
  ];

  // Filter menu items based on user role
  const menuItems = userRolesLoaded ? 
    (isAcademyOnly ? 
      allMenuItems.filter(item => item.academyAllowed) : 
      allMenuItems
    ) : 
    []; // Don't show any navigation until roles are loaded

  // If user roles aren't loaded yet, show a simple loading state
  if (!userRolesLoaded) {
    return (
      <div className="flex items-center">
        <div className="hidden md:flex items-center space-x-3">
          <div className="h-8 w-8 bg-primary/10 animate-pulse rounded-md"></div>
          <div className="h-8 w-8 bg-primary/10 animate-pulse rounded-md"></div>
          <div className="h-8 w-8 bg-primary/10 animate-pulse rounded-md"></div>
        </div>
        <div className="md:hidden">
          <div className="h-8 w-8 bg-primary/10 animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }

  // Helper function to get academy-specific styles for navigation items
  const getNavItemStyles = (isActiveItem: boolean) => {
    if (isAcademyPage) {
      if (isActiveItem) {
        return {
          className: "px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors bg-emerald-500/15 dark:bg-emerald-400/15 animate-scale-in",
          style: {
            color: resolvedTheme === 'dark' ? academyColors.dark : academyColors.light
          } as React.CSSProperties
        };
      } else {
        return {
          className: "px-2 py-2 rounded-md text-sm font-medium flex items-center transition-colors hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10",
          style: {
            color: resolvedTheme === 'dark' ? academyColors.dark : academyColors.light
          } as React.CSSProperties
        };
      }
    } else {
      return {
        className: cn(
          "px-2 py-2 rounded-md text-sm font-medium flex items-center transition-colors",
          isActiveItem 
            ? "bg-primary/10 text-primary px-3 animate-scale-in" 
            : "hover:bg-accent hover:text-accent-foreground"
        ),
        style: {}
      };
    }
  };

  // Helper function for mobile nav item styles
  const getMobileNavItemStyles = (isActiveItem: boolean) => {
    if (isAcademyPage) {
      return {
        className: cn(
          "flex items-center gap-3 p-3 rounded-md transition-colors",
          isActiveItem
            ? "bg-emerald-500/15 dark:bg-emerald-400/15"
            : "hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10"
        ),
        style: {
          color: resolvedTheme === 'dark' ? academyColors.dark : academyColors.light
        } as React.CSSProperties
      };
    } else {
      return {
        className: cn(
          "flex items-center gap-3 p-3 rounded-md transition-colors",
          isActiveItem
            ? "bg-primary/10 text-primary"
            : "hover:bg-accent hover:text-accent-foreground"
        ),
        style: {}
      };
    }
  };

  return (
    <div className="flex items-center">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-3" role="navigation" aria-label="Main Navigation">
        <TooltipProvider delayDuration={200}>
          {menuItems.map((item) => {
            const isActiveItem = isActive(item.path);
            const navItemStyles = getNavItemStyles(isActiveItem);
            
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link 
                    to={item.path}
                    className={navItemStyles.className}
                    style={navItemStyles.style}
                    aria-label={item.description}
                    aria-current={isActiveItem ? "page" : undefined}
                    itemScope
                    itemType="http://schema.org/SiteNavigationElement"
                    itemProp="url"
                  >
                    <item.icon 
                      className={cn("h-5 w-5", isActiveItem ? "mr-1.5" : "")} 
                      aria-hidden="true"
                      style={isAcademyPage ? {
                        color: resolvedTheme === 'dark' ? academyColors.dark : academyColors.light
                      } : {}}
                    />
                    {isActiveItem && <span className="animate-fade-in" itemProp="name">{item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {!isActiveItem && (
                  <TooltipContent 
                    side="bottom" 
                    className="font-medium bg-popover/90 backdrop-blur-sm shadow-lg"
                    sideOffset={6}
                  >
                    {item.title}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative" 
              aria-label="Open navigation menu"
              style={isAcademyPage ? {
                color: resolvedTheme === 'dark' ? academyColors.dark : academyColors.light
              } : {}}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] sm:w-[350px] pt-10">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-left text-lg font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-1" role="navigation" aria-label="Mobile Navigation" itemScope itemType="http://schema.org/SiteNavigationElement">
              {menuItems.map((item) => {
                const isActiveItem = isActive(item.path);
                const mobileNavStyles = getMobileNavItemStyles(isActiveItem);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={mobileNavStyles.className}
                    style={mobileNavStyles.style}
                    onClick={() => setOpen(false)}
                    aria-label={item.description}
                    aria-current={isActiveItem ? "page" : undefined}
                    itemProp="url"
                  >
                    <item.icon 
                      className="h-5 w-5" 
                      aria-hidden="true"
                      style={isAcademyPage ? {
                        color: resolvedTheme === 'dark' ? academyColors.dark : academyColors.light
                      } : {}}
                    />
                    <span className="text-base" itemProp="name">{item.title}</span>
                  </Link>
                );
              })}
            </nav>
            {/* Add sitemap link for SEO crawlers (hidden visually but available for bots) */}
            <div className="sr-only">
              <a href="/sitemap.xml">Sitemap</a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default HeaderNav;
