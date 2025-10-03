
import React, { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import AcademyHeader from '@/components/layout/AcademyHeader';

interface AcademyLayoutProps {
  children: ReactNode;
}

const AcademyLayout: React.FC<AcademyLayoutProps> = ({ 
  children
}) => {
  const { user } = useAuth();

  console.log('AcademyLayout: Rendering with user:', user?.id);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Academy Header */}
      <AcademyHeader />
      
      {/* Main content area - mobile optimized */}
      <main className="flex-1 overflow-x-hidden">
        <div className="w-full px-2 sm:px-4 py-2 sm:py-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AcademyLayout;
