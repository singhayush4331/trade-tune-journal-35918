
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Shield, Target, TrendingUp, Star, Crown, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

const HavenArkSignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, create the user account with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            signup_type: 'haven_ark',
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        // Send custom Haven Ark branded email
        try {
          const { error: emailError } = await supabase.functions.invoke('send-signup-email', {
            body: {
              email: formData.email,
              redirectUrl: `${window.location.origin}/email-verification?source=signup`,
              fullName: formData.fullName,
              signupType: 'haven_ark'
            }
          });

          if (emailError) {
            console.error('Haven Ark branded email error:', emailError);
            // Don't block the signup process for email issues
          }
        } catch (emailError) {
          console.error('Error sending Haven Ark branded email:', emailError);
        }

        setEmailSent(true);
      }
    } catch (error) {
      console.error('Haven Ark signup error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Crown,
      title: 'Elite Trading Masterclass',
      description: 'Exclusive access to institutional-grade trading strategies and techniques',
      gradient: 'from-[#00FF88] to-[#00E87A]'
    },
    {
      icon: Target,
      title: 'Professional Mentorship',
      description: 'Direct guidance from SEBI registered experts and market professionals',
      gradient: 'from-emerald-500 to-green-400'
    },
    {
      icon: TrendingUp,
      title: 'Live Market Sessions',
      description: 'Real-time trading sessions with professional strategy implementation',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      icon: Shield,
      title: 'Risk Management Mastery',
      description: 'Advanced risk management techniques used by institutional traders',
      gradient: 'from-purple-500 to-pink-400'
    }
  ];

  const benefits = [
    { icon: Star, text: 'Premium Course Access' },
    { icon: Zap, text: 'Live Trading Sessions' },
    { icon: Target, text: 'Expert Mentorship' },
    { icon: Shield, text: 'Institutional Strategies' }
  ];

  const stats = [
    { number: '2,500+', label: 'Students Trained' },
    { number: '₹35K', label: 'Course Value' },
    { number: '8+', label: 'Expert Modules' },
    { number: '4.9/5', label: 'Success Rating' }
  ];

  return (
    <>
      <Helmet>
        <title>Haven Ark Masterclass Signup | Elite Trading Education</title>
        <meta name="description" content="Join Haven Ark's elite trading masterclass. Learn institutional trading strategies from SEBI registered experts and market professionals." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-[#0A0B0D] via-gray-900 to-[#0A0B0D] relative overflow-hidden">
        {/* Haven Ark Brand Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-[#00FF88]/10 to-[#00E87A]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-[#00E87A]/10 to-[#00FF88]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#00FF88]/5 to-[#00E87A]/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Link to="/haven-ark" className="inline-flex items-center text-[#00FF88] hover:text-[#00E87A] mb-8 transition-colors">
              ← Back to Haven Ark
            </Link>
            
            {/* Haven Ark Logo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center space-x-3 mb-6"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#00FF88] to-[#00E87A] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00FF88]/25">
                <span className="text-black font-black text-xl">HA</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl font-black text-white tracking-tight">Haven Ark</span>
                <span className="text-sm text-[#00FF88] font-medium">Masterclass</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-2 border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88]">
                <Crown className="h-4 w-4 mr-2" />
                Elite Masterclass Access
              </Badge>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">Join </span>
              <span className="text-[#00FF88]">Haven Ark</span>
              <br />
              <span className="bg-gradient-to-r from-white via-gray-200 to-[#00FF88] bg-clip-text text-transparent">
                Masterclass
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Master institutional trading strategies with India's elite trading community. 
              Learn from SEBI registered experts and join 2,500+ successful traders.
            </motion.p>

            {/* Stats Row */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-[#00FF88] mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Masterclass Highlights</h2>
                <div className="grid gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                      className="group relative"
                    >
                      <div className="relative p-6 rounded-2xl border border-[#00FF88]/20 bg-[#00FF88]/5 backdrop-blur-xl hover:bg-[#00FF88]/10 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-[#00FF88]/40">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg`}>
                            <feature.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Benefits List */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="grid grid-cols-2 gap-4"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 + index * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#00FF88]/5 border border-[#00FF88]/20"
                  >
                    <benefit.icon className="h-5 w-5 text-[#00FF88]" />
                    <span className="text-sm text-gray-300">{benefit.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Community Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 }}
              >
                <Card className="border-[#00FF88]/20 bg-gradient-to-r from-[#00FF88]/10 to-[#00E87A]/10 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <ArrowRight className="h-5 w-5 text-[#00FF88]" />
                      Join Elite Community
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Connect with 9,500+ active traders in India's largest trading community. Get access to live sessions, expert mentorship, and proven strategies.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-[#00FF88]">
                      <CheckCircle className="h-4 w-4" />
                      Lifetime access to community and updates
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Signup Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="relative"
            >
              {/* Form Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FF88]/20 to-[#00E87A]/20 rounded-3xl blur-xl"></div>
              
              <Card className="relative shadow-2xl border-[#00FF88]/20 bg-[#00FF88]/10 backdrop-blur-xl">
                {!emailSent ? (
                  <>
                    <CardHeader className="text-center pb-8">
                      <CardTitle className="text-2xl text-white">Create Your Haven Ark Account</CardTitle>
                      <CardDescription className="text-gray-300 text-lg">
                        Join India's elite trading community
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.3 }}
                        >
                          <Label htmlFor="fullName" className="text-white text-sm font-medium">Full Name</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="mt-2 bg-white/10 border-[#00FF88]/20 text-white placeholder:text-gray-400 focus:border-[#00FF88] focus:ring-[#00FF88]/20"
                          />
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.4 }}
                        >
                          <Label htmlFor="email" className="text-white text-sm font-medium">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="mt-2 bg-white/10 border-[#00FF88]/20 text-white placeholder:text-gray-400 focus:border-[#00FF88] focus:ring-[#00FF88]/20"
                          />
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.5 }}
                        >
                          <Label htmlFor="password" className="text-white text-sm font-medium">Password</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Create a password"
                            minLength={6}
                            className="mt-2 bg-white/10 border-[#00FF88]/20 text-white placeholder:text-gray-400 focus:border-[#00FF88] focus:ring-[#00FF88]/20"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.6 }}
                        >
                          <Button 
                            type="submit" 
                            className="w-full h-12 bg-gradient-to-r from-[#00FF88] to-[#00E87A] hover:from-[#00E87A] hover:to-[#00FF88] text-black font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" 
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                Creating Account...
                              </div>
                            ) : (
                              'Join Haven Ark Masterclass'
                            )}
                          </Button>
                        </motion.div>
                      </form>

                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.7 }}
                        className="text-center pt-4 border-t border-[#00FF88]/20"
                      >
                        <p className="text-gray-300">
                          Already have an account?{' '}
                          <Link to="/haven-ark/login" className="text-[#00FF88] hover:text-[#00E87A] font-medium transition-colors">
                            Sign in here
                          </Link>
                        </p>
                      </motion.div>
                    </CardContent>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardHeader className="text-center pb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#00FF88] to-[#00E87A] rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-black" />
                      </div>
                      <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
                      <CardDescription className="text-gray-300 text-lg">
                        We've sent a verification link to your email address
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                      <div className="p-4 rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/20">
                        <p className="text-white font-medium mb-2">Email sent to:</p>
                        <p className="text-[#00FF88] font-semibold">{formData.email}</p>
                      </div>
                      
                      <div className="space-y-3 text-gray-300">
                        <p>To complete your Haven Ark registration:</p>
                        <div className="text-left space-y-2 text-sm">
                          <p className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-[#00FF88] text-black rounded-full flex items-center justify-center text-xs font-bold">1</span>
                            Check your email inbox (and spam folder)
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-[#00FF88] text-black rounded-full flex items-center justify-center text-xs font-bold">2</span>
                            Click the verification link in the email
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-[#00FF88] text-black rounded-full flex items-center justify-center text-xs font-bold">3</span>
                            You'll be automatically redirected to the Academy
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#00FF88]/20">
                        <p className="text-gray-400 text-sm">
                          Didn't receive an email?{' '}
                          <button 
                            onClick={() => setEmailSent(false)}
                            className="text-[#00FF88] hover:text-[#00E87A] font-medium transition-colors"
                          >
                            Try again
                          </button>
                        </p>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HavenArkSignupPage;
