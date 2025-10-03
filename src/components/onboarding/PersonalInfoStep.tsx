
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, User, Mail, Phone, Shield } from 'lucide-react';
import { OnboardingData } from '@/pages/OnboardingPage';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface PersonalInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Validation schema
const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}) => {
  // Set up form with validation
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: data.name,
      email: data.email,
      phone: data.phone,
    }
  });

  // Handle form submission
  const onSubmit = (values: PersonalInfoValues) => {
    updateData(values);
    onNext();
  };

  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    })
  };

  return (
    <div className="flex-grow flex flex-col h-full">
      <div className="mb-6 max-w-lg mx-auto w-full">
        <motion.div
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible" 
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl flex items-center justify-center shadow-inner">
            <Shield className="h-10 w-10 text-primary" />
          </div>
        </motion.div>
        
        <motion.p 
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="text-muted-foreground text-center mb-8"
        >
          Let's get to know you better! This information helps us personalize your experience.
        </motion.p>
      </div>
    
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow flex flex-col space-y-6 max-w-lg mx-auto w-full">
          <motion.div
            custom={1}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="group"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="backdrop-blur-sm border border-primary/10 p-4 rounded-lg group-hover:border-primary/30 transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/5">
                  <FormLabel className="flex items-center gap-2 text-base">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    Your Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Rahul Sharma" 
                      {...field} 
                      className="bg-card/50 backdrop-blur-sm border-primary/10 group-hover:border-primary/20 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div
            custom={2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="group"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="backdrop-blur-sm border border-primary/10 p-4 rounded-lg group-hover:border-primary/30 transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/5">
                  <FormLabel className="flex items-center gap-2 text-base">
                    <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="rahul@example.com" 
                      type="email" 
                      {...field} 
                      className="bg-card/50 backdrop-blur-sm border-primary/10 group-hover:border-primary/20 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div
            custom={3}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="group"
          >
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="backdrop-blur-sm border border-primary/10 p-4 rounded-lg group-hover:border-primary/30 transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/5">
                  <FormLabel className="flex items-center gap-2 text-base">
                    <div className="p-1.5 rounded-md bg-green-500/10 text-green-500">
                      <Phone className="h-4 w-4" />
                    </div>
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+91 98765 43210" 
                      {...field} 
                      className="bg-card/50 backdrop-blur-sm border-primary/10 group-hover:border-primary/20 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div 
            className="flex justify-between mt-auto pt-8"
            custom={4}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="group relative overflow-hidden border-primary/20 hover:border-primary/40"
            >
              <span className="relative z-10 flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back
              </span>
              <span className="absolute inset-0 bg-primary/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Button>
            
            <Button 
              type="submit" 
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-blue-500 hover:shadow-lg hover:shadow-primary/20"
            >
              <span className="relative z-10 flex items-center">
                Continue
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Button>
          </motion.div>
        </form>
      </Form>
    </div>
  );
};
