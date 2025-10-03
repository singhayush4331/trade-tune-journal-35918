
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  FileText, 
  Upload, 
  Calendar, 
  Clock,
  Target,
  CheckSquare,
  Star,
  Users,
  Settings
} from 'lucide-react';

export interface AssignmentData {
  title: string;
  instructions: string;
  learningObjectives: string[];
  rubric: {
    criteria: Array<{
      id: string;
      name: string;
      description: string;
      points: number;
      levels: Array<{
        name: string;
        description: string;
        points: number;
      }>;
    }>;
    totalPoints: number;
  };
  submission: {
    allowedFormats: string[];
    maxFileSize: number;
    maxFiles: number;
    submissionType: 'individual' | 'group';
    allowLateSubmission: boolean;
    latePenalty: number;
  };
  resources: Array<{
    type: 'file' | 'link' | 'template';
    title: string;
    url: string;
    description?: string;
  }>;
  settings: {
    dueDate?: Date;
    estimatedTime: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    autoGrading: boolean;
    peerReview: boolean;
    showRubricToStudents: boolean;
  };
}

interface AssignmentBuilderProps {
  data: AssignmentData;
  onChange: (data: AssignmentData) => void;
}

const AssignmentBuilder: React.FC<AssignmentBuilderProps> = ({
  data,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const updateData = (field: string, value: any) => {
    const newData = { ...data };
    const keys = field.split('.');
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onChange(newData);
  };

  const addLearningObjective = () => {
    updateData('learningObjectives', [...data.learningObjectives, '']);
  };

  const removeLearningObjective = (index: number) => {
    const newObjectives = data.learningObjectives.filter((_, i) => i !== index);
    updateData('learningObjectives', newObjectives);
  };

  const updateLearningObjective = (index: number, value: string) => {
    const newObjectives = [...data.learningObjectives];
    newObjectives[index] = value;
    updateData('learningObjectives', newObjectives);
  };

  const addRubricCriterion = () => {
    const newCriterion = {
      id: Date.now().toString(),
      name: '',
      description: '',
      points: 10,
      levels: [
        { name: 'Excellent', description: '', points: 10 },
        { name: 'Good', description: '', points: 8 },
        { name: 'Satisfactory', description: '', points: 6 },
        { name: 'Needs Improvement', description: '', points: 4 }
      ]
    };
    
    const newCriteria = [...data.rubric.criteria, newCriterion];
    updateData('rubric.criteria', newCriteria);
    updateData('rubric.totalPoints', newCriteria.reduce((sum, c) => sum + c.points, 0));
  };

  const removeCriterion = (id: string) => {
    const newCriteria = data.rubric.criteria.filter(c => c.id !== id);
    updateData('rubric.criteria', newCriteria);
    updateData('rubric.totalPoints', newCriteria.reduce((sum, c) => sum + c.points, 0));
  };

  const updateCriterion = (id: string, field: string, value: any) => {
    const newCriteria = data.rubric.criteria.map(criterion => {
      if (criterion.id === id) {
        const updated = { ...criterion, [field]: value };
        return updated;
      }
      return criterion;
    });
    
    updateData('rubric.criteria', newCriteria);
    updateData('rubric.totalPoints', newCriteria.reduce((sum, c) => sum + c.points, 0));
  };

  const addResource = () => {
    const newResource = {
      type: 'link' as const,
      title: '',
      url: '',
      description: ''
    };
    
    updateData('resources', [...data.resources, newResource]);
  };

  const removeResource = (index: number) => {
    const newResources = data.resources.filter((_, i) => i !== index);
    updateData('resources', newResources);
  };

  const updateResource = (index: number, field: string, value: string) => {
    const newResources = [...data.resources];
    newResources[index] = { ...newResources[index], [field]: value };
    updateData('resources', newResources);
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-accent/5 to-orange/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Assignment Builder</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {data.learningObjectives.length} objectives
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {data.rubric.totalPoints} points
              </span>
              <Badge variant="outline" className="text-xs">
                {data.settings.difficulty}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 bg-muted/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="rubric" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Rubric
            </TabsTrigger>
            <TabsTrigger value="submission" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Submission
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Assignment Title</label>
                <Input
                  value={data.title}
                  onChange={(e) => updateData('title', e.target.value)}
                  placeholder="Enter assignment title..."
                  className="h-12 text-lg border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Instructions</label>
                <Textarea
                  value={data.instructions}
                  onChange={(e) => updateData('instructions', e.target.value)}
                  placeholder="Provide clear, detailed instructions for the assignment..."
                  rows={8}
                  className="border-2 focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Learning Objectives</label>
                  <Button onClick={addLearningObjective} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Objective
                  </Button>
                </div>

                <div className="space-y-3">
                  {data.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={objective}
                        onChange={(e) => updateLearningObjective(index, e.target.value)}
                        placeholder={`Learning objective ${index + 1}...`}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLearningObjective(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {data.learningObjectives.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Add learning objectives to help students understand what they'll achieve</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rubric" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Grading Rubric</h3>
                <p className="text-sm text-muted-foreground">Total Points: {data.rubric.totalPoints}</p>
              </div>
              <Button onClick={addRubricCriterion} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Criterion
              </Button>
            </div>

            <div className="space-y-4">
              {data.rubric.criteria.map((criterion) => (
                <Card key={criterion.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        value={criterion.name}
                        onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                        placeholder="Criterion name..."
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={criterion.points}
                        onChange={(e) => updateCriterion(criterion.id, 'points', parseInt(e.target.value) || 0)}
                        placeholder="Points"
                        className="w-24"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCriterion(criterion.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Textarea
                      value={criterion.description}
                      onChange={(e) => updateCriterion(criterion.id, 'description', e.target.value)}
                      placeholder="Describe what this criterion evaluates..."
                      rows={2}
                    />

                    <div className="grid grid-cols-4 gap-2">
                      {criterion.levels.map((level, levelIndex) => (
                        <div key={levelIndex} className="space-y-2">
                          <Input
                            value={level.name}
                            onChange={(e) => {
                              const newLevels = [...criterion.levels];
                              newLevels[levelIndex] = { ...level, name: e.target.value };
                              updateCriterion(criterion.id, 'levels', newLevels);
                            }}
                            placeholder="Level name"
                            className="text-sm"
                          />
                          <Input
                            type="number"
                            value={level.points}
                            onChange={(e) => {
                              const newLevels = [...criterion.levels];
                              newLevels[levelIndex] = { ...level, points: parseInt(e.target.value) || 0 };
                              updateCriterion(criterion.id, 'levels', newLevels);
                            }}
                            placeholder="Points"
                            className="text-sm"
                          />
                          <Textarea
                            value={level.description}
                            onChange={(e) => {
                              const newLevels = [...criterion.levels];
                              newLevels[levelIndex] = { ...level, description: e.target.value };
                              updateCriterion(criterion.id, 'levels', newLevels);
                            }}
                            placeholder="Description..."
                            rows={2}
                            className="text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}

              {data.rubric.criteria.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No grading criteria yet</p>
                  <p className="text-sm">Add criteria to create a comprehensive rubric</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="submission" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Submission Format</h4>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Submission Type</label>
                  <Select
                    value={data.submission.submissionType}
                    onValueChange={(value: 'individual' | 'group') => 
                      updateData('submission.submissionType', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">👤 Individual</SelectItem>
                      <SelectItem value="group">👥 Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Allowed File Formats</label>
                  <div className="flex flex-wrap gap-2">
                    {['PDF', 'DOC', 'DOCX', 'TXT', 'JPG', 'PNG', 'ZIP'].map((format) => (
                      <Button
                        key={format}
                        variant={data.submission.allowedFormats.includes(format) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const formats = data.submission.allowedFormats.includes(format)
                            ? data.submission.allowedFormats.filter(f => f !== format)
                            : [...data.submission.allowedFormats, format];
                          updateData('submission.allowedFormats', formats);
                        }}
                        className="text-xs"
                      >
                        {format}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">File Limits</h4>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max File Size (MB)</label>
                  <Input
                    type="number"
                    value={data.submission.maxFileSize}
                    onChange={(e) => updateData('submission.maxFileSize', parseInt(e.target.value) || 10)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Files</label>
                  <Input
                    type="number"
                    value={data.submission.maxFiles}
                    onChange={(e) => updateData('submission.maxFiles', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Late Submission Policy</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Allow Late Submissions</span>
                    <p className="text-xs text-muted-foreground">Students can submit after deadline</p>
                  </div>
                  <Switch
                    checked={data.submission.allowLateSubmission}
                    onCheckedChange={(checked) => updateData('submission.allowLateSubmission', checked)}
                  />
                </div>
                
                {data.submission.allowLateSubmission && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Late Penalty (% per day)</label>
                    <Input
                      type="number"
                      value={data.submission.latePenalty}
                      onChange={(e) => updateData('submission.latePenalty', parseInt(e.target.value) || 0)}
                      placeholder="10"
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Assignment Resources</h3>
              <Button onClick={addResource} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>

            <div className="space-y-4">
              {data.resources.map((resource, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2">
                      <Select
                        value={resource.type}
                        onValueChange={(value: 'file' | 'link' | 'template') => 
                          updateResource(index, 'type', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="file">📄 File</SelectItem>
                          <SelectItem value="link">🔗 Link</SelectItem>
                          <SelectItem value="template">📋 Template</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input
                        value={resource.title}
                        onChange={(e) => updateResource(index, 'title', e.target.value)}
                        placeholder="Resource title..."
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        value={resource.url}
                        onChange={(e) => updateResource(index, 'url', e.target.value)}
                        placeholder="URL or file path..."
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        value={resource.description || ''}
                        onChange={(e) => updateResource(index, 'description', e.target.value)}
                        placeholder="Description (optional)..."
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResource(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {data.resources.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No resources added yet</p>
                  <p className="text-sm">Add helpful resources like templates, examples, or reference materials</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Assignment Settings</h4>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <Select
                    value={data.settings.difficulty}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      updateData('settings.difficulty', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">🟢 Beginner</SelectItem>
                      <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                      <SelectItem value="advanced">🔴 Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated Time (hours)</label>
                  <Input
                    type="number"
                    value={data.settings.estimatedTime}
                    onChange={(e) => updateData('settings.estimatedTime', parseInt(e.target.value) || 0)}
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Advanced Options</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Show Rubric to Students</span>
                      <p className="text-xs text-muted-foreground">Students can see grading criteria</p>
                    </div>
                    <Switch
                      checked={data.settings.showRubricToStudents}
                      onCheckedChange={(checked) => updateData('settings.showRubricToStudents', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Enable Peer Review</span>
                      <p className="text-xs text-muted-foreground">Students review each other's work</p>
                    </div>
                    <Switch
                      checked={data.settings.peerReview}
                      onCheckedChange={(checked) => updateData('settings.peerReview', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Auto Grading</span>
                      <p className="text-xs text-muted-foreground">Automatically grade submissions</p>
                    </div>
                    <Switch
                      checked={data.settings.autoGrading}
                      onCheckedChange={(checked) => updateData('settings.autoGrading', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssignmentBuilder;
