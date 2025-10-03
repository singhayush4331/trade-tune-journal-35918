import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookTemplate, Target, TrendingUp, Check, Sparkles, 
  X, Save, Tag, Rocket, Zap, FlaskConical, Lightbulb, BarChart3, 
  BookOpenCheck, Flame, ScrollText
} from 'lucide-react';
import { toast } from 'sonner';
import StrategyTemplates from '@/components/playbooks/StrategyTemplates';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { createPlaybook, fetchPlaybookById, updatePlaybook } from '@/services/playbooks-service';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const predefinedTags = [
  { id: "price-action", label: "Price Action", color: "bg-blue-400/20 text-blue-500 border-blue-300/20" },
  { id: "breakout", label: "Breakout", color: "bg-green-400/20 text-green-500 border-green-300/20" },
  { id: "momentum", label: "Momentum", color: "bg-purple-400/20 text-purple-500 border-purple-300/20" },
  { id: "reversal", label: "Reversal", color: "bg-amber-400/20 text-amber-600 border-amber-300/20" },
  { id: "trend-following", label: "Trend Following", color: "bg-teal-400/20 text-teal-600 border-teal-300/20" },
  { id: "institutional", label: "Institutional", color: "bg-indigo-400/20 text-indigo-600 border-indigo-300/20" },
  { id: "smart-money", label: "Smart Money", color: "bg-violet-400/20 text-violet-600 border-violet-300/20" },
  { id: "support-resistance", label: "Support/Resistance", color: "bg-rose-400/20 text-rose-600 border-rose-300/20" },
  { id: "fibonacci", label: "Fibonacci", color: "bg-amber-400/20 text-amber-600 border-amber-300/20" },
  { id: "candlestick", label: "Candlestick Patterns", color: "bg-red-400/20 text-red-600 border-red-300/20" },
  { id: "indicator", label: "Indicator-Based", color: "bg-sky-400/20 text-sky-600 border-sky-300/20" },
  { id: "volume", label: "Volume Analysis", color: "bg-emerald-400/20 text-emerald-600 border-emerald-300/20" },
  { id: "swing", label: "Swing Trading", color: "bg-fuchsia-400/20 text-fuchsia-600 border-fuchsia-300/20" },
  { id: "day", label: "Day Trading", color: "bg-cyan-400/20 text-cyan-600 border-cyan-300/20" },
  { id: "position", label: "Position Trading", color: "bg-blue-400/20 text-blue-500 border-blue-300/20" },
  { id: "scalping", label: "Scalping", color: "bg-pink-400/20 text-pink-600 border-pink-300/20" },
  { id: "mean-reversion", label: "Mean Reversion", color: "bg-orange-400/20 text-orange-600 border-orange-300/20" },
  { id: "order-block", label: "Order Blocks", color: "bg-slate-400/20 text-slate-600 border-slate-300/20" },
  { id: "fair-value-gap", label: "Fair Value Gaps", color: "bg-lime-400/20 text-lime-600 border-lime-300/20" },
  { id: "liquidity", label: "Liquidity Grab", color: "bg-purple-400/20 text-purple-500 border-purple-300/20" }
];

const tagCategories = {
  "Technical Analysis": ["price-action", "support-resistance", "fibonacci", "candlestick", "indicator"],
  "Trading Styles": ["day", "swing", "position", "scalping"],
  "Market Concepts": ["momentum", "reversal", "trend-following", "breakout", "mean-reversion"],
  "Advanced Concepts": ["institutional", "smart-money", "order-block", "fair-value-gap", "liquidity"],
  "Analysis Types": ["volume"]
};

const formSchema = z.object({
  name: z.string().min(1, "Strategy name is required"),
  description: z.string().optional(),
  riskReward: z.string().optional(),
  entryRules: z.string().optional(),
  exitRules: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PlaybookEditorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: playbookId } = useParams();
  const [activeTab, setActiveTab] = useState("create");
  const [currentPlaybook, setCurrentPlaybook] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      riskReward: "",
      entryRules: "",
      exitRules: "",
      notes: "",
    },
  });
  
  useEffect(() => {
    const loadPlaybook = async () => {
      if (playbookId) {
        setIsLoading(true);
        try {
          const { data, error } = await fetchPlaybookById(playbookId);
          
          if (error) {
            toast.error("Failed to load playbook");
            console.error("Error loading playbook:", error);
            return;
          }
          
          if (data) {
            setCurrentPlaybook(data);
            if (data.tags) {
              setSelectedTags(data.tags);
            }
            
            form.reset({
              name: data.name || "",
              description: data.description || "",
              riskReward: data.risk_reward || "",
              entryRules: data.entry_rules || "",
              exitRules: data.exit_rules || "",
              notes: data.notes || "",
            });
          }
        } catch (err) {
          console.error("Error in loadPlaybook:", err);
          toast.error("Failed to load playbook data");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadPlaybook();
  }, [playbookId, form]);
  
  useEffect(() => {
    if (location.state?.template) {
      const template = location.state.template;
      setSelectedTemplate(template);
      if (template.tags) {
        setSelectedTags(template.tags);
      }
      
      form.reset({
        name: template.name || "",
        description: template.description || "",
        riskReward: template.riskReward || "",
        entryRules: template.entryRules || "",
        exitRules: template.exitRules || "",
        notes: template.notes || "",
      });
      
      setActiveTab("create");
    }
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state, form]);
  
  const useTemplate = (template: any) => {
    setSelectedTemplate(template);
    
    form.reset({
      name: template.name || "",
      description: template.description || "",
      riskReward: template.riskReward || "",
      entryRules: template.entryRules || "",
      exitRules: template.exitRules || "",
      notes: template.notes || "",
    });
    
    if (template.tags) {
      setSelectedTags(template.tags);
    }
    
    setActiveTab("create");
  };
  
  const savePlaybook = async (values: FormValues) => {
    const playbook = {
      name: values.name,
      description: values.description,
      tags: selectedTags,
      entryRules: values.entryRules,
      exitRules: values.exitRules,
      riskReward: values.riskReward,
      notes: values.notes,
    };
    
    setIsLoading(true);
    
    try {
      if (currentPlaybook?.id || playbookId) {
        const id = currentPlaybook?.id || playbookId;
        const { error } = await updatePlaybook(id, playbook);
        
        if (error) {
          toast.error("Failed to update playbook");
          console.error("Error updating playbook:", error);
          return;
        }
        
        toast.success("Playbook updated successfully");
      } else {
        const { error } = await createPlaybook(playbook);
        
        if (error) {
          toast.error("Failed to create playbook");
          console.error("Error creating playbook:", error);
          return;
        }
        
        toast.success("Playbook created successfully");
      }
      
      navigate('/playbooks');
    } catch (err) {
      console.error("Error saving playbook:", err);
      toast.error("An error occurred while saving the playbook");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };

  const getTagColorById = (tagId: string) => {
    const tag = predefinedTags.find(tag => tag.id === tagId);
    return tag ? tag.color : "bg-primary/20 text-primary";
  };

  const renderTagsByCategory = (categoryName: string, tagIds: string[]) => {
    return (
      <div key={categoryName} className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
          <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
          {categoryName}
        </h4>
        <div className="grid grid-cols-1 gap-1.5">
          {tagIds.map(tagId => {
            const tag = predefinedTags.find(t => t.id === tagId);
            if (!tag) return null;
            
            return (
              <motion.div
                key={tagId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoveredTag(tagId)}
                onMouseLeave={() => setHoveredTag(null)}
                className={`group flex items-center space-x-2 rounded-md px-3 py-2 border transition-all duration-200 ${
                  selectedTags.includes(tagId) 
                    ? tag.color + " ring-1 ring-offset-1 ring-primary/30" 
                    : "border-muted/50 hover:border-primary/30 bg-card/40 hover:bg-card/60"
                }`}
              >
                <Checkbox 
                  id={`tag-${tagId}`} 
                  checked={selectedTags.includes(tagId)}
                  onCheckedChange={() => handleTagToggle(tagId)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <label
                  htmlFor={`tag-${tagId}`}
                  className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {tag.label}
                </label>
                {selectedTags.includes(tagId) && (
                  <X 
                    className="h-3.5 w-3.5 opacity-70 hover:opacity-100 cursor-pointer" 
                    onClick={() => handleTagToggle(tagId)}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const EnhancedTabHeader = ({ 
    icon: Icon, 
    title, 
    description, 
    active 
  }: { 
    icon: React.ElementType, 
    title: string, 
    description: string,
    active: boolean 
  }) => (
    <motion.div 
      className={`flex items-center gap-4 p-4 rounded-lg ${
        active ? "bg-gradient-to-r from-primary/20 to-indigo-500/20 shadow-inner" : ""
      }`}
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`p-3 rounded-full ${
        active 
          ? "bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/20" 
          : "bg-muted/30 text-foreground/80"
      }`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="container px-4 py-6">
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold flex items-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600 pb-2">
                    {currentPlaybook ? 'Edit Playbook' : 'Create Playbook'}
                  </span>
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.3 }}
                    className="ml-3"
                  >
                    <Rocket className="h-6 w-6 text-primary" />
                  </motion.div>
                </h1>
                <p className="text-muted-foreground mt-1 md:text-lg">
                  {currentPlaybook 
                    ? 'Refine your strategy and improve your trading results'
                    : 'Design your winning strategy and amplify your trading performance'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/playbooks')} 
                className="border-primary/20 hover:bg-primary/5"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={form.handleSubmit(savePlaybook)} 
                className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : (currentPlaybook ? 'Update' : 'Save')} Playbook
              </Button>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            <div className="lg:col-span-5 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4 bg-card/30 w-full p-1 rounded-xl overflow-hidden shadow-inner">
                  <TabsTrigger 
                    value="create" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-indigo-600/90 data-[state=active]:text-white rounded-lg py-3 flex items-center justify-center gap-2"
                  >
                    <FlaskConical className="h-5 w-5 mr-1" />
                    <span className="flex items-center">{selectedTemplate ? 'Edit Template' : (currentPlaybook ? 'Edit Playbook' : 'Create Playbook')}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="templates" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-indigo-600/90 data-[state=active]:text-white rounded-lg py-3 flex items-center justify-center gap-2"
                  >
                    <Lightbulb className="h-5 w-5 mr-1" />
                    <span className="flex items-center">Browse Templates</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="space-y-8 animate-fade-in">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(savePlaybook)} className="space-y-8">
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={container}
                        className="p-8 rounded-2xl border border-primary/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md shadow-xl"
                      >
                        <motion.div variants={item} className="flex items-center gap-3 mb-6">
                          <div className="p-3 rounded-full bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/20">
                            <BookOpenCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                              Strategy Overview
                            </h2>
                            <p className="text-muted-foreground">
                              Define your core trading strategy details
                            </p>
                          </div>
                        </motion.div>
                        
                        <div className="grid gap-6">
                          <motion.div variants={item}>
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-medium">Strategy Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="E.g., Pullback Trend Trading"
                                      className="border-primary/10 bg-card/50 backdrop-blur-sm focus:border-primary/30 text-base"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </motion.div>
                          
                          <motion.div variants={item}>
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-medium">Description</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Brief description of this strategy's approach"
                                      className="border-primary/10 bg-card/50 backdrop-blur-sm focus:border-primary/30 text-base"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </motion.div>
                          
                          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label className="text-base font-medium">Tags</Label>
                              <div className="relative mt-2">
                                <Input
                                  value={selectedTags.length > 0 ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected` : "Select tags from sidebar"}
                                  className="border-primary/10 bg-card/50 backdrop-blur-sm pl-9 text-base"
                                  readOnly
                                />
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                              </div>
                              
                              {selectedTags.length > 0 && (
                                <motion.div 
                                  className="flex flex-wrap gap-2 mt-3"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {selectedTags.map((tagId) => {
                                    const tag = predefinedTags.find(t => t.id === tagId);
                                    return (
                                      <Badge 
                                        key={tagId} 
                                        className={`${getTagColorById(tagId)} cursor-pointer hover:opacity-80 py-1.5 pl-2 pr-1 flex items-center gap-1`}
                                        onClick={() => handleTagToggle(tagId)}
                                      >
                                        {tag?.label || tagId}
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-4 w-4 rounded-full hover:bg-white/20 p-0 ml-0.5"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleTagToggle(tagId);
                                          }}
                                        >
                                          <X className="h-2.5 w-2.5" />
                                        </Button>
                                      </Badge>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="riskReward"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-medium">Risk/Reward Ratio</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="E.g., 1:3"
                                      className="border-primary/10 bg-card/50 backdrop-blur-sm focus:border-primary/30 text-base"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </motion.div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={container}
                        className="p-8 rounded-2xl border border-primary/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md shadow-xl"
                      >
                        <motion.div variants={item} className="flex items-center gap-3 mb-6">
                          <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20">
                            <Target className="h-5 w-5" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                              Entry Criteria
                            </h2>
                            <p className="text-muted-foreground">
                              Define when to enter a trade with this strategy
                            </p>
                          </div>
                        </motion.div>
                        
                        <motion.div variants={item}>
                          <FormField
                            control={form.control}
                            name="entryRules"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium">Entry Rules</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="List your entry criteria and rules in detail..."
                                    className="min-h-[200px] border-primary/10 bg-card/50 backdrop-blur-sm focus:border-primary/30 text-base resize-none"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </motion.div>
                      
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={container}
                        className="p-8 rounded-2xl border border-primary/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md shadow-xl"
                      >
                        <motion.div variants={item} className="flex items-center gap-3 mb-6">
                          <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/20">
                            <TrendingUp className="h-5 w-5" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-600">
                              Exit Criteria
                            </h2>
                            <p className="text-muted-foreground">
                              Define when to exit a trade with this strategy
                            </p>
                          </div>
                        </motion.div>
                        
                        <motion.div variants={item}>
                          <FormField
                            control={form.control}
                            name="exitRules"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium">Exit Rules</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="List your exit criteria and rules in detail..."
                                    className="min-h-[200px] border-primary/10 bg-card/50 backdrop-blur-sm focus:border-primary/30 text-base resize-none"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </motion.div>
                    
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={container}
                        className="p-8 rounded-2xl border border-primary/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md shadow-xl"
                      >
                        <motion.div variants={item} className="flex items-center gap-3 mb-6">
                          <div className="p-3 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/20">
                            <ScrollText className="h-5 w-5" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600">
                              Additional Notes
                            </h2>
                            <p className="text-muted-foreground">
                              Any other important details or observations
                            </p>
                          </div>
                        </motion.div>
                        
                        <motion.div variants={item}>
                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium">Notes & Observations</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Additional notes, observations, or cautions about this strategy..."
                                    className="min-h-[150px] border-primary/10 bg-card/50 backdrop-blur-sm focus:border-primary/30 text-base resize-none"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-end gap-3 pt-4"
                      >
                        <Button 
                          type="button"
                          variant="outline" 
                          onClick={() => navigate('/playbooks')} 
                          className="border-primary/20 hover:bg-primary/5"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white"
                          disabled={isLoading}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? 'Saving...' : 'Save Strategy'}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="templates" className="animate-fade-in">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border border-primary/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md shadow-xl overflow-hidden p-0">
                      <div className="bg-gradient-to-r from-primary/10 to-indigo-500/10 p-6 border-b border-primary/10">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-full bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/20">
                            <Lightbulb className="h-5 w-5" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                              Strategy Templates
                            </h2>
                            <p className="text-muted-foreground">
                              Select a pre-built strategy template to jumpstart your trading playbook
                            </p>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <StrategyTemplates onSelectTemplate={useTemplate} />
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
            
            {activeTab === "create" && (
              <motion.div
                className="lg:col-span-2 pt-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-primary/10 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-lg shadow-xl sticky top-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 to-indigo-500/10 p-4 border-b border-primary/10">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Tag className="h-5 w-5 mr-2 text-primary" />
                      Strategy Tags
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Select tags that best describe your trading strategy
                    </p>
                  </div>
                  
                  <CardContent className="p-4">
                    <ScrollArea className="h-[520px] pr-4">
                      <div className="space-y-1">
                        {Object.entries(tagCategories).map(([category, tagIds]) => 
                          renderTagsByCategory(category, tagIds)
                        )}
                      </div>
                    </ScrollArea>
                    
                    {selectedTags.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-border animate-fade-in">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">Selected Tags ({selectedTags.length})</p>
                          {selectedTags.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedTags([])} 
                              className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                            >
                              Clear All
                            </Button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map(tagId => {
                            const tag = predefinedTags.find(t => t.id === tagId);
                            return (
                              <motion.div
                                key={tagId}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Badge 
                                  className={`${getTagColorById(tagId)} cursor-pointer hover:opacity-80 pl-2 pr-1 py-1 flex items-center`}
                                  onClick={() => handleTagToggle(tagId)}
                                >
                                  {tag?.label || tagId}
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-4 w-4 ml-1 hover:bg-white/20 rounded-full p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTagToggle(tagId);
                                    }}
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </Button>
                                </Badge>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PlaybookEditorPage;
