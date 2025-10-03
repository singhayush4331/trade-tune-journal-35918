
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AcademyLayout from '@/components/layout/AcademyLayout';
import SimpleAcademyHero from '@/components/academy/SimpleAcademyHero';
import SimplifiedCourseCatalog from '@/components/academy/SimplifiedCourseCatalog';
import { HeroSkeleton } from '@/components/academy/AcademyLoadingSkeletons';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/use-auth';
import { useSimplifiedAcademyData } from '@/hooks/use-simplified-academy-data';

const AcademyPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [pageReady, setPageReady] = useState(false);
  const navigate = useNavigate();
  
  const {
    courses,
    loading: coursesLoading,
    isAcademyStudent,
    hasEnrollments
  } = useSimplifiedAcademyData();

  console.log('AcademyPage: Rendering with data:', {
    user: user?.id,
    authLoading,
    coursesLoading,
    coursesCount: courses.length,
    isAcademyStudent,
    hasEnrollments,
    pageReady
  });

  useEffect(() => {
    if (!authLoading) {
      setPageReady(true);
    }
  }, [authLoading]);

  if (authLoading || !pageReady) {
    console.log('AcademyPage: Showing loading state');
    return (
      <>
        <Helmet>
          <title>Haven Ark Trading Academy | Wiggly</title>
          <meta name="description" content="Master professional trading with Haven Ark's comprehensive academy courses and expert educational content." />
        </Helmet>
        <AcademyLayout>
          <div className="min-h-screen bg-background">
            <HeroSkeleton />
          </div>
        </AcademyLayout>
      </>
    );
  }

  console.log('AcademyPage: Rendering main content');

  return (
    <>
      <Helmet>
        <title>Haven Ark Trading Academy | Wiggly</title>
        <meta name="description" content="Master professional trading with Haven Ark's comprehensive academy courses and expert educational content." />
      </Helmet>
      <AcademyLayout>
        <div className="min-h-screen bg-background">
          {/* Simple Hero Section */}
          <SimpleAcademyHero isAcademyStudent={isAcademyStudent} />
          
          {/* Simplified Course Catalog */}
          <SimplifiedCourseCatalog 
            courses={courses}
            loading={coursesLoading}
            isAcademyStudent={isAcademyStudent}
            hasEnrollments={hasEnrollments}
          />
        </div>
      </AcademyLayout>
    </>
  );
};

export default AcademyPage;
