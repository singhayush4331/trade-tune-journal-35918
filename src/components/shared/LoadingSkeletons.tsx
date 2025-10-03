
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const TradeFormSkeleton = () => {
  return (
    <div className="space-y-6 p-4">
      <Skeleton className="h-8 w-64" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
};

export const CalendarSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-60 w-full rounded-lg" />
    </div>
  );
};

export const CourseGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const AcademyPageSkeleton = () => {
  return (
    <div className="space-y-12">
      {/* Hero Skeleton */}
      <div className="space-y-6 text-center py-20">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-6 w-[600px] mx-auto" />
        <div className="flex justify-center gap-4 pt-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
      
      {/* Filters Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-12 w-full max-w-2xl mx-auto rounded-2xl" />
        <div className="flex flex-wrap justify-center gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-lg" />
          ))}
        </div>
      </div>
      
      {/* Course Grid Skeleton */}
      <CourseGridSkeleton />
    </div>
  );
};
