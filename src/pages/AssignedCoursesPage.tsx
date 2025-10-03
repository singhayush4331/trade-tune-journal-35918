
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AcademyLayout from '@/components/layout/AcademyLayout';
import AssignedCoursesViewer from '@/components/academy/AssignedCoursesViewer';

const AssignedCoursesPage = () => {
  return (
    <>
      <Helmet>
        <title>My Assigned Courses | Haven Ark Academy</title>
        <meta name="description" content="View and access your assigned trading courses." />
      </Helmet>
      <AcademyLayout>
        <AssignedCoursesViewer />
      </AcademyLayout>
    </>
  );
};

export default AssignedCoursesPage;
