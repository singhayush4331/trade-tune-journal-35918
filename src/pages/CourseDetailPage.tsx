
import React from 'react';
import AcademyLayout from '@/components/layout/AcademyLayout';
import CourseDetail from '@/components/academy/CourseDetail';

const CourseDetailPage: React.FC = () => {
  return (
    <AcademyLayout>
      <CourseDetail />
    </AcademyLayout>
  );
};

export default CourseDetailPage;
