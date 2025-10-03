import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Activity, 
  AlertCircle, 
  Check, 
  Clock, 
  Loader2, 
  Lock, 
  Search,
  Settings, 
  Shield, 
  Sliders,
  AlertTriangle,
  BookOpen,
  Bookmark,
  Calendar,
  ChartBar,
  FileText,
  Gauge,
  History,
  User,
  UserCheck,
  Zap
} from 'lucide-react';

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  status: 'stable' | 'beta' | 'alpha' | 'dev';
  category: string;
  restricted_to: string[];
  created_at: string;
  last_modified: string;
  last_modified_by: string;
}

interface AppSetting {
  id: string;
  key: string;
  name: string;
  value: string | number | boolean;
  description: string;
  category: string;
  data_type: 'string' | 'number' | 'boolean';
  editable: boolean;
  created_at: string;
  updated_at: string;
}

const FeatureManagement = () => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [appSettings, setAppSettings] = useState<AppSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchFeatureFlags();
    fetchAppSettings();
  }, []);

  const fetchFeatureFlags = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from a feature_flags table
      // For now, we'll use mock data
      setTimeout(() => {
        const mockFeatureFlags: FeatureFlag[] = [
          {
            id: "1",
            name: "AI Trading Assistant",
            key: "ai_assistant",
            description: "Enables the AI trading assistant feature",
            enabled: true,
            status: 'stable',
            category: 'ai',
            restricted_to: ['admin', 'premium'],
            created_at: new Date(Date.now() - 5000000).toISOString(),
            last_modified: new Date(Date.now() - 500000).toISOString(),
            last_modified_by: "admin@example.com"
          },
          {
            id: "2",
            name: "Enhanced Analytics",
            key: "enhanced_analytics",
            description: "Enables advanced analytics dashboards and reports",
            enabled: true,
            status: 'beta',
            category: 'analytics',
            restricted_to: ['premium'],
            created_at: new Date(Date.now() - 15000000).toISOString(),
            last_modified: new Date(Date.now() - 2000000).toISOString(),
            last_modified_by: "admin@example.com"
          },
          {
            id: "3",
            name: "Social Trading",
            key: "social_trading",
            description: "Allows users to share trades and follow other traders",
            enabled: false,
            status: 'alpha',
            category: 'social',
            restricted_to: [],
            created_at: new Date(Date.now() - 25000000).toISOString(),
            last_modified: new Date(Date.now() - 25000000).toISOString(),
            last_modified_by: "admin@example.com"
          },
          {
            id: "4",
            name: "Backtesting Engine",
            key: "backtesting",
            description: "Enables strategy backtesting capabilities",
            enabled: false,
            status: 'dev',
            category: 'analytics',
            restricted_to: ['admin'],
            created_at: new Date(Date.now() - 35000000).toISOString(),
            last_modified: new Date(Date.now() - 35000000).toISOString(),
            last_modified_by: "admin@example.com"
          },
          {
            id: "5",
            name: "Multi-broker Integration",
            key: "multi_broker",
            description: "Support for multiple brokerage connections",
            enabled: true,
            status: 'beta',
            category: 'integration',
            restricted_to: ['premium'],
            created_at: new Date(Date.now() - 20000000).toISOString(),
            last_modified: new Date(Date.now() - 1000000).toISOString(),
            last_modified_by: "admin@example.com"
          }
        ];
        
        setFeatureFlags(mockFeatureFlags);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching feature flags:", error);
      toast.error("Failed to load feature flags");
      setIsLoading(false);
    }
  };

  const fetchAppSettings = async () => {
    try {
      // In a real implementation, this would fetch from an app_settings table
      // For now, we'll use mock data
      setTimeout(() => {
        const mockAppSettings: AppSetting[] = [
          {
            id: "1",
            key: "max_trades_per_day",
            name: "Max Trades Per Day",
            value: 50,
            description: "Maximum number of trades a user can log per day",
            category: 'limits',
            data_type: 'number',
            editable: true,
            created_at: new Date(Date.now() - 5000000).toISOString(),
            updated_at: new Date(Date.now() - 500000).toISOString(),
          },
          {
            id: "2",
            key: "max_file_upload_size",
            name: "Max File Upload Size",
            value: 10,
            description: "Maximum file upload size in MB",
            category: 'limits',
            data_type: 'number',
            editable: true,
            created_at: new Date(Date.now() - 15000000).toISOString(),
            updated_at: new Date(Date.now() - 2000000).toISOString(),
          },
          {
            id: "3",
            key: "maintenance_mode",
            name: "Maintenance Mode",
            value: false,
            description: "When enabled, the site will display a maintenance page to all non-admin users",
            category: 'system',
            data_type: 'boolean',
            editable: true,
            created_at: new Date(Date.now() - 25000000).toISOString(),
            updated_at: new Date(Date.now() - 25000000).toISOString(),
          },
          {
            id: "4",
            key: "support_email",
            name: "Support Email",
            value: "support@traderjournal.com",
            description: "Email address displayed for support inquiries",
            category: 'contact',
            data_type: 'string',
            editable: true,
            created_at: new Date(Date.now() - 35000000).toISOString(),
            updated_at: new Date(Date.now() - 15000000).toISOString(),
          },
          {
            id: "5",
            key: "allow_guest_access",
            name: "Allow Guest Access",
            value: false,
            description: "Enables limited functionality for non-authenticated users",
            category: 'access',
            data_type: 'boolean',
            editable: true,
            created_at: new Date(Date.now() - 20000000).toISOString(),
            updated_at: new Date(Date.now() - 1000000).toISOString(),
          },
          {
            id: "6",
            key: "analytics_retention_days",
            name: "Analytics Data Retention",
            value: 365,
            description: "Number of days to retain user analytics data",
            category: 'data',
            data_type: 'number',
            editable: true,
            created_at: new Date(Date.now() - 40000000).toISOString(),
            updated_at: new Date(Date.now() - 3000000).toISOString(),
          }
        ];
        
        setAppSettings(mockAppSettings);
      }, 800);
    } catch (error) {
      console.error("Error fetching app settings:", error);
      toast.error("Failed to load application settings");
    }
  };

  const toggleFeatureFlag = async (id: string, currentStatus: boolean) => {
    setIsUpdating(true);
    try {
      // In a real implementation, this would update the feature_flags table
      setFeatureFlags(prevFlags => 
        prevFlags.map(flag => 
          flag.id === id 
            ? { 
                ...flag, 
                enabled: !currentStatus,
                last_modified: new Date().toISOString(),
                last_modified_by: "current_admin@example.com" // In real app, get from auth
              } 
            : flag
        )
      );
      
      toast.success(`Feature flag ${currentStatus ? 'disabled' : 'enabled'} successfully`);
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error updating feature flag:", error);
      toast.error("Failed to update feature flag");
      
      // Revert the change in case of error
      setFeatureFlags(prevFlags => 
        prevFlags.map(flag => 
          flag.id === id 
            ? { ...flag, enabled: currentStatus } 
            : flag
        )
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const updateAppSetting = async (id: string, newValue: string | number | boolean) => {
    setIsUpdating(true);
    try {
      // In a real implementation, this would update the app_settings table
      setAppSettings(prevSettings => 
        prevSettings.map(setting => 
          setting.id === id 
            ? { 
                ...setting, 
                value: newValue,
                updated_at: new Date().toISOString()
              } 
            : setting
        )
      );
      
      toast.success("Setting updated successfully");
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error updating app setting:", error);
      toast.error("Failed to update setting");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: 'stable' | 'beta' | 'alpha' | 'dev') => {
    switch (status) {
      case 'stable':
        return <Badge className="bg-green-500">Stable</Badge>;
      case 'beta':
        return <Badge variant="secondary">Beta</Badge>;
      case 'alpha':
        return <Badge variant="outline">Alpha</Badge>;
      case 'dev':
        return <Badge variant="destructive">Development</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredFeatureFlags = featureFlags.filter(flag => {
    const matchesSearch = 
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      flag.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredAppSettings = appSettings.filter(setting => {
    return (
      setting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setting.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const groupSettingsByCategory = () => {
    const grouped: Record<string, AppSetting[]> = {};
    
    appSettings.forEach(setting => {
      if (!grouped[setting.category]) {
        grouped[setting.category] = [];
      }
      grouped[setting.category].push(setting);
    });
    
    return grouped;
  };

  const categorizedSettings = groupSettingsByCategory();
  const categories = [...new Set(featureFlags.map(flag => flag.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Feature Management</h2>
          <p className="text-muted-foreground">
            Control feature flags and application settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span>Feature Flags</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>App Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Enable or disable features across the platform
              </CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredFeatureFlags.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                  <p className="text-muted-foreground">No feature flags match your search</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Feature</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Access</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead className="text-right">Toggle</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFeatureFlags.map((feature) => (
                        <TableRow key={feature.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{feature.name}</p>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                              <p className="text-xs font-mono text-muted-foreground mt-1">
                                {feature.key}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(feature.status)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {feature.category.charAt(0).toUpperCase() + feature.category.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {feature.restricted_to.length === 0 ? (
                                <Badge variant="outline">All Users</Badge>
                              ) : (
                                feature.restricted_to.map(role => (
                                  <Badge key={role} variant="outline">
                                    {role}
                                  </Badge>
                                ))
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(feature.last_modified).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Switch
                              checked={feature.enabled}
                              onCheckedChange={() => toggleFeatureFlag(feature.id, feature.enabled)}
                              disabled={isUpdating}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Here's the fix: Changed variant="warning" to variant="default" and added custom styling */}
          <Alert variant="default" className="border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle>Feature Flag Best Practices</AlertTitle>
            <AlertDescription>
              Remember to thoroughly test features before enabling them platform-wide. 
              Consider enabling features for admin users first, then gradually roll out to other user groups.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and parameters
              </CardDescription>
              
              <Input
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-2"
              />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : Object.keys(categorizedSettings).length === 0 ? (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                  <p className="text-muted-foreground">No settings available</p>
                </div>
              ) : (
                <Accordion type="multiple" className="w-full" defaultValue={Object.keys(categorizedSettings)}>
                  {Object.entries(categorizedSettings).map(([category, settings]) => {
                    // Filter settings based on search
                    const visibleSettings = searchQuery === '' 
                      ? settings 
                      : settings.filter(setting => 
                          setting.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          setting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          setting.key.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                    
                    if (visibleSettings.length === 0) {
                      return null;
                    }
                    
                    return (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger className="capitalize">
                          {category} ({visibleSettings.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-6 pt-2">
                            {visibleSettings.map((setting) => (
                              <div key={setting.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                <div className="md:col-span-5">
                                  <div className="font-medium">{setting.name}</div>
                                  <div className="text-sm text-muted-foreground">{setting.description}</div>
                                  <div className="text-xs font-mono text-muted-foreground mt-1">{setting.key}</div>
                                </div>
                                <div className="md:col-span-5">
                                  {setting.data_type === 'boolean' ? (
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        checked={setting.value as boolean}
                                        onCheckedChange={(checked) => updateAppSetting(setting.id, checked)}
                                        disabled={isUpdating || !setting.editable}
                                      />
                                      <Label htmlFor={setting.id}>
                                        {(setting.value as boolean) ? 'Enabled' : 'Disabled'}
                                      </Label>
                                    </div>
                                  ) : setting.data_type === 'number' ? (
                                    <Input
                                      type="number"
                                      value={setting.value as number}
                                      onChange={(e) => {
                                        const newValue = parseInt(e.target.value, 10);
                                        if (!isNaN(newValue)) {
                                          updateAppSetting(setting.id, newValue);
                                        }
                                      }}
                                      disabled={isUpdating || !setting.editable}
                                    />
                                  ) : (
                                    <Input
                                      type="text"
                                      value={setting.value as string}
                                      onChange={(e) => updateAppSetting(setting.id, e.target.value)}
                                      disabled={isUpdating || !setting.editable}
                                    />
                                  )}
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                  {!setting.editable && (
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                      <Lock className="h-3.5 w-3.5" />
                                      <span className="text-xs">Locked</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Last refreshed: {new Date().toLocaleString()}
              </div>
              <Button variant="outline" onClick={fetchAppSettings} disabled={isLoading}>
                Refresh Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                View and manage the current system status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Maintenance Mode</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {appSettings.find(s => s.key === 'maintenance_mode')?.value ? 
                          'Currently Active' : 
                          'Not Active'}
                      </div>
                      <Switch
                        checked={(appSettings.find(s => s.key === 'maintenance_mode')?.value as boolean) || false}
                        onCheckedChange={(checked) => {
                          const setting = appSettings.find(s => s.key === 'maintenance_mode');
                          if (setting) {
                            updateAppSetting(setting.id, checked);
                          }
                        }}
                        disabled={isUpdating}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Guest Access</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {appSettings.find(s => s.key === 'allow_guest_access')?.value ? 
                          'Allowed' : 
                          'Restricted'}
                      </div>
                      <Switch
                        checked={(appSettings.find(s => s.key === 'allow_guest_access')?.value as boolean) || false}
                        onCheckedChange={(checked) => {
                          const setting = appSettings.find(s => s.key === 'allow_guest_access');
                          if (setting) {
                            updateAppSetting(setting.id, checked);
                          }
                        }}
                        disabled={isUpdating}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Analytics Retention</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {appSettings.find(s => s.key === 'analytics_retention_days')?.value || 0} days
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureManagement;
