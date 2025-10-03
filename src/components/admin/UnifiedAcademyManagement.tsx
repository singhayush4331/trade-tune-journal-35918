
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Users, 
  BarChart3,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import ModernAdminAcademy from '@/components/academy/ModernAdminAcademy';

const UnifiedAcademyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Academy Management
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            Complete academy administration including courses, batches, and user management
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="batches" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Batch Courses
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Academy Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ModernAdminAcademy />
        </TabsContent>

        <TabsContent value="courses">
          <ModernAdminAcademy />
        </TabsContent>

        <TabsContent value="batches">
          <ModernAdminAcademy />
        </TabsContent>

        <TabsContent value="users">
          <ModernAdminAcademy />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedAcademyManagement;
