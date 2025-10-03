
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getSessionUser } from "@/utils/auth-cache";

// Fetch current user's profile
export const fetchUserProfile = async () => {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("User not authenticated");
    
    const userId = user.id;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return { data: null, error };
  }
};

// Update user profile
export const updateUserProfile = async (profileData: any) => {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("User not authenticated");
    
    const userId = user.id;
    
    const updatedProfile = {
      full_name: profileData.fullName,
      experience_level: profileData.experienceLevel,
      trading_style: profileData.tradingStyle,
      avatar_url: profileData.avatarUrl,
      phone: profileData.phone,
      starting_fund: profileData.startingFund,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Profile updated successfully");
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    toast.error(error.message || "Failed to update profile");
    return { data: null, error };
  }
};

// Save onboarding data to profile
export const saveOnboardingDataToProfile = async (onboardingData: any) => {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("User not authenticated");
    
    const userId = user.id;
    
    // Convert initialFund to number if it's a string
    let startingFund = onboardingData.initialFund;
    if (typeof startingFund === 'string') {
      startingFund = parseFloat(startingFund.replace(/[^\d.-]/g, ''));
    }
    
    const profileData = {
      full_name: onboardingData.name,
      phone: onboardingData.phone,
      experience_level: onboardingData.experience,
      starting_fund: startingFund,
      email: onboardingData.email,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;

    // Create initial capital deposit in funds table if starting fund is provided
    if (startingFund && startingFund > 0) {
      // Check if user already has an initial deposit to avoid duplicates
      const { data: existingDeposit } = await supabase
        .from('funds')
        .select('id')
        .eq('user_id', userId)
        .eq('transaction_type', 'deposit')
        .eq('notes', 'Initial capital')
        .single();

      if (!existingDeposit) {
        const { error: fundsError } = await supabase
          .from('funds')
          .insert({
            user_id: userId,
            amount: startingFund,
            transaction_type: 'deposit',
            notes: 'Initial capital',
            date: new Date().toISOString()
          });

        if (fundsError) {
          console.error("Error creating initial capital deposit:", fundsError);
          // Don't throw error here, just log it so profile save still succeeds
        }
      }
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error saving onboarding data:", error);
    return { data: null, error };
  }
};

// Upload avatar image
export const uploadAvatar = async (file: File) => {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("User not authenticated");
    
    const userId = user.id;
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    // Update the user's profile with the avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    toast.success("Avatar uploaded successfully");
    
    return { data: data.publicUrl, error: null };
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    toast.error(error.message || "Failed to upload avatar");
    return { data: null, error };
  }
};
