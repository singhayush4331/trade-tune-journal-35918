
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
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BellRing, 
  CheckCircle, 
  Clock, 
  File, 
  Filter, 
  Info, 
  Loader2, 
  Mail, 
  Megaphone, 
  Send, 
  Users,
  AlertTriangle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

// Define the schema for the broadcast form
const broadcastFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  message: z.string().min(1, "Message is required").max(1000),
  audience: z.enum(["all", "active", "inactive", "subscribed", "free", "admin"]),
  priority: z.enum(["normal", "high", "urgent"]),
  notification_type: z.enum(["in_app", "email", "both"]),
  schedule: z.enum(["now", "later"]),
  scheduled_time: z.date().optional(),
  include_action_link: z.boolean().default(false),
  action_link: z.string().url().optional().or(z.literal("")),
  action_text: z.string().max(30).optional(),
});

type BroadcastFormValues = z.infer<typeof broadcastFormSchema>;

interface NotificationHistory {
  id: string;
  title: string;
  message: string;
  audience: string;
  created_at: string;
  sent_by: string;
  status: "sent" | "scheduled" | "failed";
  sent_count: number;
  priority: "normal" | "high" | "urgent";
  notification_type: "in_app" | "email" | "both";
}

const BroadcastMessaging = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("compose");

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastFormSchema),
    defaultValues: {
      title: "",
      message: "",
      audience: "all",
      priority: "normal",
      notification_type: "in_app",
      schedule: "now",
      include_action_link: false,
      action_link: "",
      action_text: "",
    },
  });

  const watchSchedule = form.watch("schedule");
  const watchIncludeActionLink = form.watch("include_action_link");
  const watchAudience = form.watch("audience");

  useEffect(() => {
    if (selectedTab === "history") {
      fetchNotificationHistory();
    }
  }, [selectedTab]);

  const fetchNotificationHistory = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from a notifications table
      // For now, we'll use mock data
      setTimeout(() => {
        const mockHistory: NotificationHistory[] = [
          {
            id: "1",
            title: "Important System Update",
            message: "We've updated our trade analytics system with new features.",
            audience: "all",
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            sent_by: "admin@example.com",
            status: "sent",
            sent_count: 245,
            priority: "high",
            notification_type: "both"
          },
          {
            id: "2",
            title: "New Feature Announcement",
            message: "Try our new position sizing calculator!",
            audience: "active",
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            sent_by: "admin@example.com",
            status: "sent",
            sent_count: 142,
            priority: "normal",
            notification_type: "in_app"
          },
          {
            id: "3",
            title: "Scheduled Maintenance",
            message: "The system will be down for maintenance on Saturday.",
            audience: "all",
            created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            sent_by: "admin@example.com",
            status: "scheduled",
            sent_count: 0,
            priority: "urgent",
            notification_type: "email"
          }
        ];
        
        setNotificationHistory(mockHistory);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching notification history:", error);
      toast.error("Failed to load notification history");
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BroadcastFormValues) => {
    setIsLoading(true);
    
    try {
      // Log the notification data
      console.log("Broadcasting notification:", data);
      
      // In a real implementation, this would send to a backend endpoint
      // or insert into a notifications table in Supabase
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Notification broadcast successfully");
      
      // Add to history (in a real implementation, this would come from the DB)
      const newNotification: NotificationHistory = {
        id: Date.now().toString(),
        title: data.title,
        message: data.message,
        audience: data.audience,
        created_at: new Date().toISOString(),
        sent_by: "current_admin@example.com", // In real app, get from auth
        status: data.schedule === "now" ? "sent" : "scheduled",
        sent_count: Math.floor(Math.random() * 200) + 50, // Mock data
        priority: data.priority,
        notification_type: data.notification_type
      };
      
      setNotificationHistory(prev => [newNotification, ...prev]);
      
      // Reset form
      form.reset();
      
      // Switch to history tab to show the sent notification
      setSelectedTab("history");
    } catch (error) {
      console.error("Error sending broadcast:", error);
      toast.error("Failed to send notification");
    } finally {
      setIsLoading(false);
    }
  };

  const getAudienceEstimate = (audience: string) => {
    // In real app, these would be actual counts from the database
    switch (audience) {
      case "all": return "~300 users";
      case "active": return "~180 users";
      case "inactive": return "~120 users";
      case "subscribed": return "~150 users";
      case "free": return "~150 users";
      case "admin": return "~5 users";
      default: return "Unknown";
    }
  };

  const getPriorityBadge = (priority: "normal" | "high" | "urgent") => {
    switch (priority) {
      case "normal":
        return <Badge variant="outline">Normal</Badge>;
      case "high":
        return <Badge variant="secondary">High</Badge>;
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Broadcast Messaging</h2>
          <p className="text-muted-foreground">
            Send notifications and messages to users across the platform
          </p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList>
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            <span>Compose</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose Notification</CardTitle>
              <CardDescription>
                Create a new notification to broadcast to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Notification title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Write your message here..." 
                                className="min-h-[150px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="audience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Audience</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="active">Active Users</SelectItem>
                                <SelectItem value="inactive">Inactive Users</SelectItem>
                                <SelectItem value="subscribed">Subscribed Users</SelectItem>
                                <SelectItem value="free">Free Users</SelectItem>
                                <SelectItem value="admin">Admin Users</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Target audience: {getAudienceEstimate(watchAudience)}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notification_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notification Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="in_app" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    In-App Only
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="email" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Email Only
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="both" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Both In-App and Email
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="schedule"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="now" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Send immediately
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="later" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Schedule for later
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchSchedule === "later" && (
                        <FormField
                          control={form.control}
                          name="scheduled_time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Scheduled Time</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" 
                                  value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ''} 
                                  onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : undefined;
                                    field.onChange(date);
                                  }} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="include_action_link"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Include Call-to-Action
                          </FormLabel>
                          <FormDescription>
                            Add a button with a link to direct users to a specific page
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {watchIncludeActionLink && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="action_text"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Button Text</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Learn More" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="action_link"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/page" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Confirmation Required</AlertTitle>
                    <AlertDescription>
                      This notification will be sent to {getAudienceEstimate(watchAudience)}. 
                      This action cannot be undone.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isLoading} 
                      className="flex gap-2 items-center"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Megaphone className="h-4 w-4" />
                      )}
                      {watchSchedule === "now" ? "Send Notification" : "Schedule Notification"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                View past notifications sent to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : notificationHistory.length === 0 ? (
                <div className="text-center py-8">
                  <BellRing className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                  <p className="text-muted-foreground">No notifications have been sent yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reach</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notificationHistory.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>{notification.audience === "all" ? "All Users" : `${notification.audience} Users`}</TableCell>
                        <TableCell>
                          {notification.notification_type === "both" ? (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" />
                              <BellRing className="h-3.5 w-3.5" />
                            </div>
                          ) : notification.notification_type === "email" ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <BellRing className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell>{getPriorityBadge(notification.priority)}</TableCell>
                        <TableCell>{format(new Date(notification.created_at), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          {notification.status === "sent" ? (
                            <Badge variant="success" className="bg-green-500">Sent</Badge>
                          ) : notification.status === "scheduled" ? (
                            <Badge variant="outline">Scheduled</Badge>
                          ) : (
                            <Badge variant="destructive">Failed</Badge>
                          )}
                        </TableCell>
                        <TableCell>{notification.sent_count} users</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>
                Create and manage reusable notification templates
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12 flex-col">
              <AlertTriangle className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <p className="text-lg text-muted-foreground mb-2">Template feature coming soon</p>
              <p className="text-sm text-muted-foreground max-w-md text-center">
                This feature is under development and will allow you to create, save, and reuse notification templates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BroadcastMessaging;
