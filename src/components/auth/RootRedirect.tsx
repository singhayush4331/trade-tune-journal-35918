
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import HavenArkCompanyLandingPage from '@/pages/HavenArkCompanyLandingPage';

const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Show loading while checking authentication status
  if (isLoading) {
    return (
      <div className="grid h-screen place-items-center">
        <span className="loader"></span>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard-redirect" replace />;
  }

  // If user is not authenticated, show the landing page
  return <HavenArkCompanyLandingPage />;
};

export default RootRedirect;
