
import React, { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/layout/Header';

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
  hideTrialBanner?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children,
  hideNav = false,
  hideTrialBanner = false
}) => {
  const { user } = useAuth();

  console.log('AppLayout: Rendering with user:', user?.id);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main content area - mobile optimized */}
      <main className="flex-1 overflow-x-hidden">
        <div className="w-full px-2 sm:px-4 py-2 sm:py-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
