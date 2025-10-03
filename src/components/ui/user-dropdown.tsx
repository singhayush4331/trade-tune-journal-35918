
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useTrialStatus } from '@/hooks/use-trial-status';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  User, Settings, LogOut, CreditCard, Clock
} from 'lucide-react';
import { signOutUser } from '@/services/auth-service';

const UserDropdown = () => {
  const { user } = useAuth();
  const { isTrialActive, hoursRemaining } = useTrialStatus();
  
  if (!user) return null;
  
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getTimeRemaining = () => {
    if (hoursRemaining <= 1) {
      return `${Math.max(0, hoursRemaining * 60)} minutes`;
    }
    return `${hoursRemaining} hours`;
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url || ''} />
            <AvatarFallback>
              {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        {isTrialActive && hoursRemaining > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="bg-primary/10 p-1 rounded-full">
                <Clock size={14} className="text-primary" />
              </div>
              <div className="text-xs">
                <p className="text-muted-foreground">Trial active</p>
                <p className="font-medium">{getTimeRemaining()} remaining</p>
              </div>
            </div>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Subscription</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
