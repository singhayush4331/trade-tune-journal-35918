import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  BookOpen, 
  BarChart3,
  Search,
  Filter,
  Star,
  Clock,
  DollarSign,
  Eye,
  TrendingUp,
  Award,
  Play,
  Settings,
  FileEdit,
  ChevronDown,
  Loader2,
  Sparkles,
  Crown
} from 'lucide-react';
import { 
  getAllCoursesAdmin, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  bulkEnrollUsersByEmail,
  type Course 
} from '@/services/academy-service';
import CourseCreationWizard from './CourseCreationWizard';
import CourseContentEditor from './CourseContentEditor';
import UserManagement from './UserManagement';
import BatchCourseCreationModal from './BatchCourseCreationModal';
import EnhancedBulkAssignmentModal from './EnhancedBulkAssignmentModal';

const ModernAdminAcademy: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showBatchCreation, setShowBatchCreation] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, statusFilter]);

  const loadCourses = async () => {
    setLoading(true);
    const coursesData = await getAllCoursesAdmin();
    // Type cast to ensure proper typing
    const typedCourses = coursesData.map((course: any): Course => ({
      ...course,
      difficulty_level: course.difficulty_level as 'beginner' | 'intermediate' | 'advanced',
      status: course.status as 'draft' | 'published' | 'trial' | 'archived' | 'flagship'
    }));
    setCourses(typedCourses);
    setLoading(false);
  };

  const filterCourses = () => {
    let filtered = courses;
    
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }
    
    setFilteredCourses(filtered);
  };

  const handleQuickStatusChange = async (courseId: string, newStatus: 'draft' | 'published' | 'trial' | 'archived' | 'flagship') => {
    setUpdatingStatus(prev => ({ ...prev, [courseId]: true }));
    
    try {
      const success = await updateCourse(courseId, { status: newStatus });
      if (success) {
        // Update the course in the local state immediately
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === courseId ? { ...course, status: newStatus } : course
          )
        );
      }
    } catch (error) {
      console.error('Error updating course status:', error);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const handleCreateCourse = async (courseData: any) => {
    const newCourse = await createCourse(courseData);
    if (newCourse) {
      await loadCourses();
      setShowCreateWizard(false);
      setEditingCourse(null);
    }
  };

  const handleUpdateCourse = async (courseData: any) => {
    if (editingCourse) {
      const success = await updateCourse(editingCourse.id, courseData);
      if (success) {
        await loadCourses();
        setShowCreateWizard(false);
        setEditingCourse(null);
      }
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowCreateWizard(true);
  };

  const handleManageContent = (course: Course) => {
    setSelectedCourse(course);
    setShowContentEditor(true);
  };

  const handleDelete = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      const success = await deleteCourse(courseId);
      if (success) {
        await loadCourses();
        if (selectedCourse?.id === courseId) {
          setSelectedCourse(null);
        }
      }
    }
  };

  const getBatchCourses = () => {
    return courses.filter(course => 
      course.title.toLowerCase().includes('master class batch')
    );
  };

  const getRegularCourses = () => {
    return courses.filter(course => 
      !course.title.toLowerCase().includes('master class batch')
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'trial': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      case 'flagship': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-300 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getCoursesStats = () => {
    const published = courses.filter(c => c.status === 'published').length;
    const draft = courses.filter(c => c.status === 'draft').length;
    const trial = courses.filter(c => c.status === 'trial').length;
    const flagship = courses.filter(c => c.status === 'flagship').length;
    const archived = courses.filter(c => c.status === 'archived').length;
    const totalRevenue = courses.filter(c => c.status === 'published').reduce((sum, c) => sum + (c.price || 0), 0);
    
    return { published, draft, trial, flagship, archived, totalRevenue, total: courses.length };
  };

  const stats = getCoursesStats();

  const StatusDropdown = ({ course }: { course: Course }) => {
    const isUpdating = updatingStatus[course.id];
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${getStatusColor(course.status)} px-3 py-1 h-auto text-xs font-medium hover:opacity-80`}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : null}
            {course.status}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background border-border">
          <DropdownMenuItem 
            onClick={() => handleQuickStatusChange(course.id, 'draft')}
            disabled={course.status === 'draft' || isUpdating}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Draft
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleQuickStatusChange(course.id, 'published')}
            disabled={course.status === 'published' || isUpdating}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Published
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleQuickStatusChange(course.id, 'trial')}
            disabled={course.status === 'trial' || isUpdating}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Trial
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleQuickStatusChange(course.id, 'flagship')}
            disabled={course.status === 'flagship' || isUpdating}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Flagship
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleQuickStatusChange(course.id, 'archived')}
            disabled={course.status === 'archived' || isUpdating}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              Archived
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Academy Management
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Create and manage your educational content</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowBatchCreation(true)}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-500/10"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Batch Course
          </Button>
          <Button 
            onClick={() => {
              setEditingCourse(null);
              setShowCreateWizard(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="user-management" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 font-medium dark:text-blue-400">Total Courses</p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950/50 dark:to-green-900/50 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 font-medium dark:text-green-400">Published</p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.published}</p>
                  </div>
                  <Award className="h-12 w-12 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-950/50 dark:to-purple-900/50 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 font-medium dark:text-purple-400">Trial Courses</p>
                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.trial}</p>
                  </div>
                  <Sparkles className="h-12 w-12 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-950/50 dark:to-amber-900/50 dark:border-amber-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-600 font-medium dark:text-amber-400">Flagship Courses</p>
                    <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.flagship}</p>
                  </div>
                  <Crown className="h-12 w-12 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-950/50 dark:to-orange-900/50 dark:border-orange-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 font-medium dark:text-orange-400">Drafts</p>
                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{stats.draft}</p>
                  </div>
                  <Edit className="h-12 w-12 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 dark:from-indigo-950/50 dark:to-indigo-900/50 dark:border-indigo-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-600 font-medium dark:text-indigo-400">Revenue</p>
                    <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">₹{stats.totalRevenue}</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-indigo-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Batch Courses Section */}
          {getBatchCourses().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Batch Courses</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBatchCreation(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Batch
                  </Button>
                </CardTitle>
                <CardDescription>Master Class batches for group enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getBatchCourses().slice(0, 3).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors duration-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {course.title.match(/\d+/)?.[0] || 'B'}
                        </div>
                        <div>
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusDropdown course={course} />
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(course)} className="hover:bg-accent" title="Edit Course Details">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleManageContent(course)} className="hover:bg-accent" title="Manage Content">
                          <FileEdit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Regular Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Courses</CardTitle>
              <CardDescription>Your latest course creations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRegularCourses().slice(0, 5).map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {course.title.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusDropdown course={course} />
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(course)} className="hover:bg-accent" title="Edit Course Details">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleManageContent(course)} className="hover:bg-accent" title="Manage Content">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="flagship">Flagship</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Courses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                  <div className={`h-40 relative ${
                    course.title.toLowerCase().includes('master class batch')
                      ? 'bg-gradient-to-br from-green-500 to-blue-500'
                      : course.status === 'flagship'
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                      : 'bg-gradient-to-br from-blue-500 to-purple-500'
                  }`}>
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        {course.status === 'flagship' ? (
                          <Crown className="h-12 w-12 text-white" />
                        ) : (
                          <Play className="h-12 w-12 text-white" />
                        )}
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <StatusDropdown course={course} />
                    </div>
                    {course.title.toLowerCase().includes('master class batch') && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          Batch Course
                        </Badge>
                      </div>
                    )}
                    {course.status === 'flagship' && !course.title.toLowerCase().includes('master class batch') && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                          <Crown className="h-3 w-3 mr-1" />
                          Flagship
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-2">
                          {course.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Instructor:</span>
                        <span className="font-medium">{course.instructor}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(course.duration)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {course.price > 0 ? `₹${course.price}` : 'Free'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(course.difficulty_level || 'beginner')}>
                          {course.difficulty_level}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(course)} className="hover:bg-accent" title="Edit Course Details">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleManageContent(course)} className="hover:bg-accent" title="Manage Content">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(course.id)} className="hover:bg-accent" title="Delete Course">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredCourses.length === 0 && !loading && (
            <Card className="border-dashed">
              <CardContent className="text-center py-16">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  {searchQuery || statusFilter !== 'all' ? 'No courses found' : 'No courses created yet'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Start building your academy by creating your first course'
                  }
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={() => setShowCreateWizard(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Button>
                    <Button 
                      onClick={() => setShowBatchCreation(true)}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-500/10"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Batch Course
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="user-management" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Course Analytics</CardTitle>
              <CardDescription>View engagement metrics and student performance</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Detailed analytics tools are under development. Soon you'll be able to track student 
                  progress, engagement metrics, and content performance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Batch Course Creation Modal */}
      <BatchCourseCreationModal
        open={showBatchCreation}
        onOpenChange={setShowBatchCreation}
        onSuccess={loadCourses}
      />

      {/* Course Creation Wizard */}
      <CourseCreationWizard
        open={showCreateWizard}
        onOpenChange={setShowCreateWizard}
        onCreateCourse={editingCourse ? handleUpdateCourse : handleCreateCourse}
        editingCourse={editingCourse}
      />

      {/* Enhanced Course Content Editor */}
      <CourseContentEditor
        isOpen={showContentEditor}
        onClose={() => setShowContentEditor(false)}
        selectedCourse={selectedCourse}
      />
    </div>
  );
};

export default ModernAdminAcademy;
