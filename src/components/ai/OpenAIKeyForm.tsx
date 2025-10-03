import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Key, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getOpenAIKey, setOpenAIKey, clearOpenAIKey } from '@/services/ai-chat-service';
import { motion } from 'framer-motion';
const OpenAIKeyForm: React.FC = () => {
  const [apiKey, setApiKey] = useState(getOpenAIKey() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter a valid OpenAI API Key");
      return;
    }
    setIsSubmitting(true);
    try {
      setOpenAIKey(apiKey.trim());
      toast.success("OpenAI API Key saved successfully");
      setIsSubmitting(false);

      // Refresh the current page to apply changes
      window.dispatchEvent(new CustomEvent('globalDataRefresh'));
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
      setIsSubmitting(false);
    }
  };
  const clearKey = () => {
    if (window.confirm("Are you sure you want to remove your OpenAI API key?")) {
      clearOpenAIKey();
      setApiKey('');
      toast.info("OpenAI API Key removed");
    }
  };
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const particleVariants = {
    hidden: {
      opacity: 0,
      y: 10
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="relative z-10">
      {/* Decorative elements */}
      <div className="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-10 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2]
      }} transition={{
        repeat: Infinity,
        duration: 5,
        ease: "easeInOut"
      }} />
        <motion.div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" animate={{
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.25, 0.2]
      }} transition={{
        repeat: Infinity,
        duration: 7,
        ease: "easeInOut",
        delay: 1
      }} />
      </div>
      
      {/* Main card */}
      <Card className="w-full max-w-lg shadow-xl border-2 border-primary/20 bg-card/80 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent opacity-60 z-0"></div>
        
        <CardHeader className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <motion.div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20" whileHover={{
            scale: 1.05,
            rotate: [0, 5, -5, 0],
            transition: {
              duration: 0.5
            }
          }}>
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              OpenAI API Key
            </CardTitle>
          </div>
          <CardDescription className="text-base leading-relaxed">
            Connect your OpenAI API key to unlock Wiggly's powerful AI features including personalized trading insights and pattern recognition.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="relative z-10 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiKey" className="text-md font-medium flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  API Key
                </Label>
                <motion.button type="button" className="text-xs text-primary/70 hover:text-primary flex items-center gap-1" onClick={toggleVisibility} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                  {isVisible ? "Hide" : "Show"} key
                </motion.button>
              </div>
              
              <div className="relative">
                <Input type={isVisible ? "text" : "password"} id="apiKey" placeholder="sk-..." value={apiKey} onChange={e => setApiKey(e.target.value)} className="pr-12 bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/20 transition-all duration-300" />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  {apiKey && <ShieldCheck className={`h-4 w-4 ${apiKey.startsWith('sk-') ? 'text-green-500' : 'text-amber-500'}`} />}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Your API key is stored securely in your browser's local storage and never shared.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                
              </div>
              
              <div>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-sm inline-flex items-center gap-1.5 text-primary hover:text-primary/80 hover:underline transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Get an OpenAI API Key
                </a>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col items-stretch gap-4 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <Button type="submit" className="sm:col-span-3 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 transition-all duration-300 group h-11" disabled={isSubmitting}>
                <motion.div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-md transition-opacity" animate={{
                opacity: isSubmitting ? [0.0, 0.2, 0.0] : 0
              }} transition={{
                repeat: isSubmitting ? Infinity : 0,
                duration: 1.5
              }} />
                
                <span className="flex items-center gap-2">
                  {isSubmitting ? <>
                      <motion.div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full" animate={{
                    rotate: 360
                  }} transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear"
                  }} />
                      Saving...
                    </> : <>
                      <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                      Save API Key
                    </>}
                </span>
              </Button>
              
              {getOpenAIKey() && <Button type="button" variant="outline" onClick={clearKey} className="sm:col-span-1 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-colors duration-300">
                  Clear
                </Button>}
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>;
};
export default OpenAIKeyForm;