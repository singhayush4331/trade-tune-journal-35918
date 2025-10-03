
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import AcademyLayout from '@/components/layout/AcademyLayout';
import StudentCourseViewer from '@/components/academy/StudentCourseViewer';

const CourseViewerPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Helmet>
        <title>Course Viewer | Haven Ark Academy</title>
        <meta name="description" content="Learn with interactive course content and track your progress." />
      </Helmet>
      <AcademyLayout>
        <StudentCourseViewer />
      </AcademyLayout>
    </>
  );
};

export default CourseViewerPage;
