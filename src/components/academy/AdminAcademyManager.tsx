import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Users, BookOpen, BarChart3, Search, UserSearch } from 'lucide-react';
import { 
  getAllCoursesAdmin, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  type Course 
} from '@/services/academy-service';
import ContentManager from './ContentManager';
import UserManagement from './UserManagement';
import UserSearchManager from './UserSearchManager';

const AdminAcademyManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [userManagementMode, setUserManagementMode] = useState<'course-specific' | 'global'>('global');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    difficulty_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: 0,
    price: 0,
    status: 'draft' as 'draft' | 'published' | 'archived' | 'trial' | 'flagship',
    category: 'trading' as 'trading' | 'technical' | 'options' | 'crypto',
    tags: '',
    prerequisites: ''
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const coursesData = await getAllCoursesAdmin();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading courses:', error);
      // Set empty array on error to allow UI to render
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      difficulty_level: 'beginner',
      duration: 0,
      price: 0,
      status: 'draft',
      category: 'trading',
      tags: '',
      prerequisites: ''
    });
    setEditingCourse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const courseData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      prerequisites: formData.prerequisites.split(',').map(prereq => prereq.trim()).filter(Boolean),
      thumbnail_url: null,
      intro_video_url: null
    };

    let success = false;
    if (editingCourse) {
      success = await updateCourse(editingCourse.id, courseData);
    } else {
      const newCourse = await createCourse(courseData);
      success = !!newCourse;
    }

    if (success) {
      await loadCourses();
      setShowCreateDialog(false);
      resetForm();
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      instructor: course.instructor || '',
      difficulty_level: (course.difficulty_level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
      duration: course.duration || 0,
      price: course.price || 0,
      status: course.status,
      category: (course.category as 'trading' | 'technical' | 'options' | 'crypto') || 'trading',
      tags: course.tags?.join(', ') || '',
      prerequisites: course.prerequisites?.join(', ') || ''
    });
    setShowCreateDialog(true);
  };

  const handleDelete = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      const success = await deleteCourse(courseId);
      if (success) {
        await loadCourses();
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'trial': return 'bg-purple-100 text-purple-800';
      case 'flagship': return 'bg-amber-100 text-amber-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academy Management</h1>
          <p className="text-muted-foreground">Manage courses, content, and student enrollments</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instructor</label>
                  <Input
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      setFormData({ ...formData, difficulty_level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: 'trading' | 'technical' | 'options' | 'crypto') => 
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trading">Trading</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="options">Options</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (₹)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'draft' | 'published' | 'archived' | 'trial' | 'flagship') => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="flagship">Flagship</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="trading, finance, stocks"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prerequisites (comma-separated)</label>
                <Input
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  placeholder="Basic knowledge of markets, Computer literacy"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(course)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Instructor:</span>
                        <span>{course.instructor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{formatDuration(course.duration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span>{course.price > 0 ? `₹${course.price}` : 'Free'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <span className="capitalize">{course.difficulty_level}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {courses.length === 0 && !loading && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No courses created yet</h3>
                <p className="text-muted-foreground mb-4">Start by creating your first course</p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Course to Manage</CardTitle>
                <CardDescription>Choose a course to manage its modules and lessons</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedCourse?.id || ''}
                  onValueChange={(value) => {
                    const course = courses.find(c => c.id === value);
                    setSelectedCourse(course || null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a course..." />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{course.title}</span>
                          <Badge className={getStatusColor(course.status)} variant="secondary">
                            {course.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <ContentManager selectedCourse={selectedCourse} />
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="space-y-6">
            {/* User Management Mode Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Choose between global user search or course-specific user management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Button
                    size="lg"
                    variant={userManagementMode === 'global' ? 'default' : 'outline'}
                    onClick={() => setUserManagementMode('global')}
                    className="flex items-center gap-2 px-6 py-3"
                  >
                    <UserSearch className="h-5 w-5" />
                    Global User Search
                  </Button>
                  <Button
                    size="lg"
                    variant={userManagementMode === 'course-specific' ? 'default' : 'outline'}
                    onClick={() => setUserManagementMode('course-specific')}
                    className="flex items-center gap-2 px-6 py-3"
                  >
                    <Search className="h-5 w-5" />
                    Course-Specific Management
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Conditional Rendering Based on Mode */}
            {userManagementMode === 'global' ? (
              <UserSearchManager />
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Course to Manage Users</CardTitle>
                    <CardDescription>Choose a course to manage its enrolled users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={selectedCourse?.id || ''}
                      onValueChange={(value) => {
                        const course = courses.find(c => c.id === value);
                        setSelectedCourse(course || null);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a course..." />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{course.title}</span>
                              <Badge className={getStatusColor(course.status)} variant="secondary">
                                {course.status}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <UserManagement />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View course performance and student engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAcademyManager;
