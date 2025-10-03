
import React, { useState, useEffect } from 'react';
import AcademyLayout from '@/components/layout/AcademyLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar, Save, Loader2, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { fetchUserProfile, updateUserProfile } from '@/services/profile-service';
import { useAuth } from '@/hooks/use-auth';

const AcademyProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    startingFund: '',
    joinedDate: ''
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      
      try {
        // First, populate with auth data that we definitely have
        if (user) {
          setFormData(prev => ({
            ...prev,
            name: user.user_metadata?.full_name || '',
            email: user.email || '',
          }));
        }
        
        // Then try to get profile data from supabase
        const { data, error } = await fetchUserProfile();
        
        if (data) {
          const formattedFund = data.starting_fund ? `₹${data.starting_fund.toLocaleString()}` : '';
          
          setFormData(prev => ({
            ...prev,
            name: data.full_name || prev.name,
            phone: data.phone || '',
            experience: data.experience_level || '',
            startingFund: formattedFund,
            joinedDate: new Date(data.created_at || Date.now()).toLocaleDateString()
          }));
        } else {
          console.log("No profile data found, falling back to localStorage");
          // Fallback to localStorage if no supabase data
          const storedUserData = localStorage.getItem('user_data');
          if (storedUserData) {
            const parsedData = JSON.parse(storedUserData);
            
            setFormData(prev => ({
              ...prev,
              phone: parsedData.phone || '',
              experience: parsedData.experience || '',
              startingFund: parsedData.initialFund ? `₹${parsedData.initialFund.toLocaleString()}` : '',
              joinedDate: new Date(parsedData.joinedDate || Date.now()).toLocaleDateString()
            }));
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    
    try {
      // Parse starting fund to remove currency symbol and commas
      let startingFund = null;
      if (formData.startingFund) {
        startingFund = parseFloat(formData.startingFund.replace(/[^\d.-]/g, ''));
      }
      
      const profileData = {
        fullName: formData.name,
        phone: formData.phone,
        startingFund: startingFund,
      };
      
      await updateUserProfile(profileData);
      toast.success('Profile updated successfully');
      
      // Also update localStorage as fallback
      const storedData = localStorage.getItem('user_data');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const updatedData = {
          ...parsedData,
          name: formData.name,
          phone: formData.phone,
          initialFund: startingFund
        };
        localStorage.setItem('user_data', JSON.stringify(updatedData));
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AcademyLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </AcademyLayout>
    );
  }

  return (
    <AcademyLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-transparent p-5 rounded-xl shadow-sm border border-emerald-200/30 dark:border-emerald-600/30">
            <div className="bg-emerald-500/20 p-2.5 rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <User className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-300">
              Academy Profile Settings
            </h1>
          </div>
          
          <Card className="shadow-md bg-white/95 dark:bg-emerald-950/95 border border-emerald-200/40 dark:border-emerald-600/30">
            <CardHeader>
              <CardTitle className="text-emerald-800 dark:text-emerald-200">Personal Information</CardTitle>
              <CardDescription className="text-emerald-600 dark:text-emerald-400">Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-emerald-700 dark:text-emerald-300">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 border-emerald-200 focus:border-emerald-500 dark:border-emerald-600 dark:focus:border-emerald-400"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-emerald-700 dark:text-emerald-300">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                      <Input 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-emerald-50/50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-600"
                        placeholder="Your email"
                        type="email"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-emerald-700 dark:text-emerald-300">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 border-emerald-200 focus:border-emerald-500 dark:border-emerald-600 dark:focus:border-emerald-400"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-emerald-700 dark:text-emerald-300">Trading Experience</Label>
                    <div className="relative">
                      <Input 
                        id="experience"
                        value={formData.experience}
                        className="bg-emerald-50/50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-600"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startingFund" className="text-emerald-700 dark:text-emerald-300">Starting Capital</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                      <Input 
                        id="startingFund"
                        name="startingFund"
                        value={formData.startingFund}
                        onChange={handleInputChange}
                        className="pl-10 border-emerald-200 focus:border-emerald-500 dark:border-emerald-600 dark:focus:border-emerald-400"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="joinedDate" className="text-emerald-700 dark:text-emerald-300">Member Since</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                      <Input 
                        id="joinedDate"
                        value={formData.joinedDate}
                        className="pl-10 bg-emerald-50/50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-600"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveProfile} 
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AcademyLayout>
  );
};

export default AcademyProfilePage;
