
import React from 'react';
import { motion } from 'framer-motion';
import { type Course } from '@/services/academy-service';
import FlagshipCourseCard from './FlagshipCourseCard';
import FlagshipBenefitsShowcase from './FlagshipBenefitsShowcase';

interface FlagshipCourseShowcaseProps {
  course: Course;
  onContactAdmin: () => void;
  variant?: 'default' | 'featured';
  isAcademyUser?: boolean;
}

const FlagshipCourseShowcase: React.FC<FlagshipCourseShowcaseProps> = ({
  course,
  onContactAdmin,
  variant = 'default',
  isAcademyUser = false
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side - Clean flagship course card with Free vs Premium below it */}
      <div className="flex flex-col space-y-6">
        <FlagshipCourseCard 
          course={course}
          onContactAdmin={onContactAdmin}
          variant={variant}
          isAcademyUser={isAcademyUser}
        />
        
        {/* Free vs Premium Card - Directly below the flagship course card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-card/90 to-green-50/5 dark:to-green-900/5 rounded-xl border border-green-500/20 p-6">
            <div className="text-center space-y-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <span className="font-bold text-lg text-green-700 dark:text-green-400">Free vs Premium</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { feature: "Basic Course Access", free: true, premium: true },
                { feature: "Advanced Strategies", free: false, premium: true },
                { feature: "Live Trading Sessions", free: false, premium: true },
                { feature: "1-on-1 Mentorship", free: false, premium: true },
                { feature: "Portfolio Review", free: false, premium: true },
                { feature: "Priority Support", free: false, premium: true }
              ].map((item, index) => (
                <motion.div
                  key={item.feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.5 + index * 0.05 }}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10"
                >
                  <span className="text-sm font-medium">{item.feature}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Free</span>
                      {item.free ? (
                        <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-green-600 font-medium">Premium</span>
                      <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Benefits showcase */}
      <div className="w-full">
        <FlagshipBenefitsShowcase />
      </div>
    </div>
  );
};

export default FlagshipCourseShowcase;
