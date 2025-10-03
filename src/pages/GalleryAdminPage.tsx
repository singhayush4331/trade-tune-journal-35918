import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Video, 
  Edit3, 
  Trash2, 
  Save,
  Plus,
  Eye,
  ArrowLeft,
  Settings,
  TrendingUp,
  Users,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GalleryItem, GallerySettings, RealResult } from '@/types/gallery';
import { loadGalleryData, saveGalleryItems, saveGallerySettings, uploadGalleryFile } from '@/utils/gallery-utils';
import { loadRealResultsData, saveRealResults, uploadRealResultFile } from '@/utils/real-results-utils';
import { useAuth } from '@/hooks/use-auth';

const GalleryAdminPage = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [realResults, setRealResults] = useState<RealResult[]>([]);
  const [settings, setSettings] = useState<GallerySettings>({ showTitles: false });
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadingRealResult, setUploadingRealResult] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingResult, setEditingResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    type: 'image' as 'image' | 'video'
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [galleryData, resultsData] = await Promise.all([
        loadGalleryData(),
        loadRealResultsData()
      ]);
      
      setGalleryItems(galleryData.items);
      setSettings(galleryData.settings);
      setRealResults(resultsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load gallery data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateGalleryItems = async (items: GalleryItem[]) => {
    try {
      setGalleryItems(items);
      await saveGalleryItems(items);
      window.dispatchEvent(new Event('gallery-updated'));
    } catch (error) {
      console.error('Error saving gallery items:', error);
      toast({
        title: "Error Saving Items",
        description: "Failed to save gallery items. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateRealResults = async (results: RealResult[]) => {
    try {
      setRealResults(results);
      await saveRealResults(results);
      window.dispatchEvent(new Event('real-results-updated'));
    } catch (error) {
      console.error('Error saving real results:', error);
      toast({
        title: "Error Saving Results",
        description: "Failed to save real results. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateSettings = async (newSettings: GallerySettings) => {
    try {
      setSettings(newSettings);
      await saveGallerySettings(newSettings);
      window.dispatchEvent(new Event('gallery-updated'));
      
      toast({
        title: "Settings Updated",
        description: `Titles are now ${newSettings.showTitles ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error Saving Settings",
        description: "Failed to save gallery settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGalleryFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!newItem.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title before uploading.",
        variant: "destructive"
      });
      return;
    }

    setIsUploadingGallery(true);

    try {
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `gallery_${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
      
      const publicUrl = await uploadGalleryFile(file, fileName);
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      const item: GalleryItem = {
        id: crypto.randomUUID(),
        type,
        url: publicUrl,
        title: newItem.title,
        description: newItem.description,
        createdAt: new Date().toISOString()
      };

      const updatedItems = [...galleryItems, item];
      await updateGalleryItems(updatedItems);

      setNewItem({ title: '', description: '', type: 'image' });
      toast({
        title: "Upload Successful",
        description: `${type} "${item.title}" has been added to the gallery.`,
      });

      event.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleRealResultUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingRealResult(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileName = `real_result_${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
        
        const publicUrl = await uploadRealResultFile(file, fileName);
        
        return {
          id: crypto.randomUUID(),
          image: publicUrl,
          createdAt: new Date().toISOString()
        };
      });

      const uploadedResults = await Promise.all(uploadPromises);
      const updatedResults = [...realResults, ...uploadedResults];
      await updateRealResults(updatedResults);

      toast({
        title: "Upload Successful",
        description: `${uploadedResults.length} screenshot${uploadedResults.length > 1 ? 's' : ''} uploaded successfully.`,
      });

      event.target.value = '';
    } catch (error) {
      console.error('Error uploading real results:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload screenshots. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingRealResult(false);
    }
  };

  const handleGalleryEdit = async (id: string, field: string, value: string) => {
    const updatedItems = galleryItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    await updateGalleryItems(updatedItems);
  };

  const handleResultEdit = async (id: string, field: string, value: string) => {
    const updatedResults = realResults.map(result => 
      result.id === id ? { ...result, [field]: value } : result
    );
    await updateRealResults(updatedResults);
  };

  const handleGalleryDelete = async (id: string) => {
    const itemToDelete = galleryItems.find(item => item.id === id);
    const updatedItems = galleryItems.filter(item => item.id !== id);
    await updateGalleryItems(updatedItems);
    
    toast({
      title: "Item Deleted",
      description: `"${itemToDelete?.title}" has been removed from the gallery.`,
    });
  };

  const handleResultDelete = async (id: string) => {
    const resultToDelete = realResults.find(result => result.id === id);
    const updatedResults = realResults.filter(result => result.id !== id);
    await updateRealResults(updatedResults);
    
    toast({
      title: "Result Deleted",
      description: `Real result has been removed.`,
    });
  };

  const moveGalleryItem = async (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= galleryItems.length) return;

    const updatedItems = [...galleryItems];
    const [removed] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, removed);
    await updateGalleryItems(updatedItems);
  };

  const moveRealResult = async (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= realResults.length) return;

    const updatedResults = [...realResults];
    const [removed] = updatedResults.splice(fromIndex, 1);
    updatedResults.splice(toIndex, 0, removed);
    await updateRealResults(updatedResults);
  };

  // Auth check
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Required</CardTitle>
            <CardDescription>You need to be logged in as an admin to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/login">
              <Button className="w-full">Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span>Loading gallery data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Content Management</h1>
              <p className="text-muted-foreground">Manage gallery items and real student results</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Gallery ({galleryItems.length})
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Real Results ({realResults.length})
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Gallery Settings</CardTitle>
                  <CardDescription>Configure how the gallery appears on the landing page</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Show Image Titles</Label>
                      <p className="text-sm text-muted-foreground">Display titles and descriptions on hover</p>
                    </div>
                    <Button
                      variant={settings.showTitles ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSettings({ ...settings, showTitles: !settings.showTitles })}
                    >
                      {settings.showTitles ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your content efficiently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      View Live Site
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Upload Section */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Gallery Item
                  </CardTitle>
                  <CardDescription>Upload images/videos for the main gallery showcase</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="gallery-title">Title</Label>
                    <Input
                      id="gallery-title"
                      value={newItem.title}
                      onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gallery-description">Description</Label>
                    <Textarea
                      id="gallery-description"
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Type</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={newItem.type === 'image' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewItem(prev => ({ ...prev, type: 'image' }))}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Image
                      </Button>
                      <Button
                        variant={newItem.type === 'video' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewItem(prev => ({ ...prev, type: 'video' }))}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Video
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gallery-file-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload {newItem.type}
                        </p>
                      </div>
                      <Input
                        id="gallery-file-upload"
                        type="file"
                        accept={newItem.type === 'image' ? 'image/*' : 'video/*'}
                        onChange={handleGalleryFileUpload}
                        disabled={isUploadingGallery}
                        className="hidden"
                      />
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Gallery Items List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Gallery Items ({galleryItems.length})</CardTitle>
                  <CardDescription>Items appearing in the main gallery on the landing page</CardDescription>
                </CardHeader>
                <CardContent>
                  {galleryItems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No gallery items yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {galleryItems.map((item, index) => (
                        <div key={item.id} className="border rounded-lg p-4 bg-card/50">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              {item.type === 'image' ? (
                                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-red-500/20 flex items-center justify-center">
                                  <Video className="h-6 w-6 text-red-500" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={item.type === 'video' ? 'destructive' : 'secondary'}>
                                  {item.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {editingItem === item.id ? (
                                <div className="space-y-2">
                                  <Input
                                    value={item.title}
                                    onChange={(e) => handleGalleryEdit(item.id, 'title', e.target.value)}
                                    className="text-sm"
                                  />
                                  <Textarea
                                    value={item.description || ''}
                                    onChange={(e) => handleGalleryEdit(item.id, 'description', e.target.value)}
                                    className="text-sm"
                                    rows={2}
                                  />
                                </div>
                              ) : (
                                <div>
                                  <h4 className="font-medium text-sm">{item.title}</h4>
                                  {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => moveGalleryItem(index, 'up')}
                                disabled={index === 0}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => moveGalleryItem(index, 'down')}
                                disabled={index === galleryItems.length - 1}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                              >
                                {editingItem === item.id ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleGalleryDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Real Results Tab */}
          <TabsContent value="results">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Upload Section */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Add Real Result
                  </CardTitle>
                  <CardDescription>Upload Discord screenshots showcasing student results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="result-file-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-green-200 dark:border-green-800 rounded-lg p-6 text-center hover:border-green-300 dark:hover:border-green-700 transition-colors">
                        <Upload className="h-8 w-8 text-green-600 mx-auto mb-2" />
                         <p className="text-sm text-muted-foreground">
                          Upload Discord Screenshots
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Select multiple PNG, JPG, WEBP files (up to 10MB each)
                        </p>
                      </div>
                      <Input
                        id="result-file-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleRealResultUpload}
                        disabled={uploadingRealResult}
                        className="hidden"
                      />
                    </Label>
                  </div>

                  {uploadingRealResult && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      Uploading screenshots...
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Real Results List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Real Results ({realResults.length})</CardTitle>
                  <CardDescription>Results showcased in the "Real Results" section</CardDescription>
                </CardHeader>
                <CardContent>
                  {realResults.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No real results yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {realResults.map((result, index) => (
                        <div key={result.id} className="border rounded-lg p-4 bg-card/50">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <img src={result.image} alt="Trading result" className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                  Discord Screenshot
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(result.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              <div className="text-sm">
                                <p className="text-muted-foreground">Real trading result screenshot</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => moveRealResult(index, 'up')}
                                disabled={index === 0}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => moveRealResult(index, 'down')}
                                disabled={index === realResults.length - 1}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleResultDelete(result.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GalleryAdminPage;