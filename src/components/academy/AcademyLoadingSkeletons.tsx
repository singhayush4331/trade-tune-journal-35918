
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from 'framer-motion';

export const CourseCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-4"
  >
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
  </motion.div>
);

export const HeroSkeleton = () => (
  <div className="space-y-6 text-center py-20">
    <Skeleton className="h-8 w-64 mx-auto" />
    <Skeleton className="h-12 w-96 mx-auto" />
    <Skeleton className="h-6 w-[600px] mx-auto" />
    <div className="flex justify-center gap-4 pt-4">
      <Skeleton className="h-12 w-32" />
      <Skeleton className="h-12 w-40" />
    </div>
  </div>
);

export const FiltersSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-12 w-full max-w-2xl mx-auto rounded-2xl" />
    <div className="flex flex-wrap justify-center gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-lg" />
      ))}
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  </div>
);
