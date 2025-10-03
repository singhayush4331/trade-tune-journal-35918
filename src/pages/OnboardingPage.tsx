import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, RocketIcon } from 'lucide-react';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { PersonalInfoStep } from '@/components/onboarding/PersonalInfoStep';
import { ExperienceStep } from '@/components/onboarding/ExperienceStep';
import { FundingStep } from '@/components/onboarding/FundingStep';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { toast } from 'sonner';
import { updateOnboardingStatus } from '@/services/auth-service';
import { saveOnboardingDataToProfile } from '@/services/profile-service';

export interface OnboardingData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  initialFund: number;
}

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<OnboardingData>({
    name: '',
    email: '',
    phone: '',
    experience: 'beginner',
    initialFund: 10000
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const updateUserData = (data: Partial<OnboardingData>) => {
    setUserData(prev => ({
      ...prev,
      ...data
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    setIsSaving(true);
    
    try {
      // Save to local storage as fallback
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Save to Supabase profiles table
      await saveOnboardingDataToProfile(userData);
      
      // Update onboarding status
      updateOnboardingStatus(true);
      
      setIsCompleted(true);
      
      setTimeout(() => {
        console.log('Onboarding completed, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }, 2000);
      
      toast.success(`Welcome to Wiggly, ${userData.name}!`, {
        description: "Your trading journal is ready to use.",
        icon: <RocketIcon className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast.error('Error completing onboarding. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const steps = [{
    title: "Welcome",
    component: <WelcomeStep onNext={handleNext} />
  }, {
    title: "Personal Info",
    component: <PersonalInfoStep data={userData} updateData={updateUserData} onNext={handleNext} onBack={handleBack} />
  }, {
    title: "Experience",
    component: <ExperienceStep data={userData} updateData={updateUserData} onNext={handleNext} onBack={handleBack} />
  }, {
    title: "Funding",
    component: <FundingStep data={userData} updateData={updateUserData} onNext={handleNext} onBack={handleBack} />
  }];

  const stepTitles = steps.map(s => s.title);

  const pageVariants = {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.7
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (isCompleted) {
    return (
      <motion.div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-6" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
      >
        <motion.div className="mb-10">
          <img 
            src="/lovable-uploads/2780255e-6d53-44a4-8fcf-7fa8a4a25bc1.png" 
            alt="Wiggly Logo" 
            className="w-36 h-36 object-contain"
          />
        </motion.div>
        
        <motion.div className="bg-gradient-to-br from-primary/30 via-blue-500/20 to-green-500/30 rounded-full p-10 mb-6 relative" initial={{
        scale: 0.5,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} transition={{
        type: "spring",
        stiffness: 300,
        damping: 10,
        delay: 0.2
      }}>
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-70"></div>
          <motion.div initial={{
          rotate: 0
        }} animate={{
          rotate: 360
        }} transition={{
          duration: 1,
          delay: 0.3
        }} className="bg-gradient-to-r from-primary to-green-500 p-5 rounded-full shadow-xl">
            <Check className="h-14 w-14 text-white" />
          </motion.div>
        </motion.div>
        
        <motion.h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-primary via-blue-500 to-green-500 bg-clip-text text-transparent" initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.4
      }}>
          All Set!
        </motion.h1>
        
        <motion.p className="text-muted-foreground text-center max-w-md mb-8 text-lg" initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.5
      }}>
          Preparing your personalized trading dashboard...
        </motion.p>
        
        <motion.div className="relative w-64 h-4 bg-muted rounded-full overflow-hidden shadow-inner" initial={{
        width: 0,
        opacity: 0
      }} animate={{
        width: "16rem",
        opacity: 1
      }} transition={{
        delay: 0.6
      }}>
          <motion.div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-blue-500 to-green-500 rounded-full" initial={{
          width: "0%"
        }} animate={{
          width: "100%"
        }} transition={{
          duration: 1.5,
          delay: 0.7
        }} />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 overflow-hidden relative" 
      variants={pageVariants} 
      initial="initial" 
      animate="animate" 
      exit="exit"
    >
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full filter blur-3xl opacity-50 animate-pulse" style={{
        animationDuration: '8s'
      }}></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-blue-500/5 to-transparent rounded-full filter blur-3xl opacity-50 animate-pulse" style={{
        animationDuration: '10s',
        animationDelay: '1s'
      }}></div>
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-green-500/5 to-transparent rounded-full filter blur-3xl opacity-40 animate-pulse" style={{
        animationDuration: '12s',
        animationDelay: '2s'
      }}></div>
        
        <motion.div animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.6, 0.3]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }} className="absolute top-[15%] right-[15%] w-24 h-24 bg-blue-500/10 rounded-full filter blur-2xl"></motion.div>
        
        <motion.div animate={{
        y: [0, 30, 0],
        opacity: [0.2, 0.5, 0.2]
      }} transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }} className="absolute bottom-[20%] right-[25%] w-32 h-32 bg-primary/10 rounded-full filter blur-2xl"></motion.div>
        
        <motion.div animate={{
        x: [0, 20, 0],
        opacity: [0.3, 0.6, 0.3]
      }} transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }} className="absolute top-[30%] left-[10%] w-28 h-28 bg-green-500/10 rounded-full filter blur-2xl"></motion.div>
      </div>
      
      <div className="max-w-3xl mx-auto pt-8 px-4 pb-24 min-h-screen flex flex-col">
        <div className="mb-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-4"
          >
            <img 
              src="/lovable-uploads/2780255e-6d53-44a4-8fcf-7fa8a4a25bc1.png" 
              alt="Wiggly Logo" 
              className="h-16 object-contain" 
            />
          </motion.div>
          
          <motion.h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent" initial={{
          y: -20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 0.2
        }}>
            {steps[step].title}
          </motion.h1>
        </div>
        
        <StepIndicator steps={stepTitles} currentStep={step} />
        
        <div className="flex-grow flex flex-col relative">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{
            x: 50,
            opacity: 0
          }} animate={{
            x: 0,
            opacity: 1
          }} exit={{
            x: -50,
            opacity: 0
          }} transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }} className="flex-grow flex flex-col">
              {steps[step].component}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default OnboardingPage;
