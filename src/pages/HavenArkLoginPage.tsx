
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInUser } from '@/services/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

const HavenArkLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await signInUser(formData.email, formData.password);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success('Welcome back to Haven ARK!');
        navigate('/academy');
      }
    } catch (error) {
      console.error('Haven ARK login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Haven ARK Login | Elite Trading Masterclass</title>
        <meta name="description" content="Access your Haven ARK elite trading masterclass account. Continue your journey to trading mastery." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-[#0A0B0D] via-gray-900 to-[#0A0B0D] relative overflow-hidden">
        {/* Haven ARK Brand Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-[#00FF88]/10 to-[#00E87A]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-[#00E87A]/10 to-[#00FF88]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#00FF88]/5 to-[#00E87A]/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <Link to="/" className="inline-flex items-center text-[#00FF88] hover:text-[#00E87A] mb-8 transition-colors">
                ← Back to Haven ARK
              </Link>
              
              {/* Haven ARK Logo */}
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
                  <span className="text-2xl font-black text-white tracking-tight">Haven ARK</span>
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
                  Welcome Back
                </Badge>
              </motion.div>
            </motion.div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              {/* Form Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FF88]/20 to-[#00E87A]/20 rounded-3xl blur-xl"></div>
              
              <Card className="relative shadow-2xl border-[#00FF88]/20 bg-[#00FF88]/10 backdrop-blur-xl">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl text-white">Access Your Haven ARK Account</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Continue your elite trading journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
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
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="password" className="text-white text-sm font-medium">Password</Label>
                      <div className="relative mt-2">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          className="bg-white/10 border-[#00FF88]/20 text-white placeholder:text-gray-400 focus:border-[#00FF88] focus:ring-[#00FF88]/20 pr-12"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00FF88] transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-[#00FF88] to-[#00E87A] hover:from-[#00E87A] hover:to-[#00FF88] text-black font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                            Signing In...
                          </div>
                        ) : (
                          'Access Haven ARK'
                        )}
                      </Button>
                    </motion.div>
                  </form>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center pt-4 border-t border-[#00FF88]/20"
                  >
                    <p className="text-gray-300 mb-3">
                      Don't have an account?{' '}
                      <Link to="/haven-ark/signup" className="text-[#00FF88] hover:text-[#00E87A] font-medium transition-colors">
                        Join Haven ARK Masterclass
                      </Link>
                    </p>
                    <p className="text-sm text-gray-400">
                      <Link to="/forgot-password" className="text-[#00FF88] hover:text-[#00E87A] transition-colors">
                        Forgot your password?
                      </Link>
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HavenArkLoginPage;
