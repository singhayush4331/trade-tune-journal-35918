
import React, { useState, useEffect } from 'react';
import { useSanitizedHtml } from '@/utils/sanitize-html';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardCheck, 
  Upload, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Target,
  Clock,
  Award,
  Lightbulb,
  BookOpen,
  Send,
  Save,
  Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AssignmentFileUpload from './AssignmentFileUpload';
import { supabase } from '@/integrations/supabase/client';
import { getSessionUser } from '@/utils/auth-cache';
import { toast } from 'sonner';

interface StudentAssignmentRendererProps {
  lesson: any;
  onComplete?: () => void;
  onNext?: () => void;
}

const StudentAssignmentRenderer: React.FC<StudentAssignmentRendererProps> = ({ 
  lesson, 
  onComplete, 
  onNext 
}) => {
  const [submission, setSubmission] = useState('');
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [submissionType, setSubmissionType] = useState<'text' | 'file' | 'both'>('both');
  const [submitting, setSubmitting] = useState(false);

  // Transform admin-created assignment data to expected format
  const transformAssignmentData = (lessonData: any) => {
    const contentData = lessonData.content_data || {};
    
    // For admin-created assignments, set defaults and transform data
    const transformed = {
      instructions: contentData.instructions || 
                   contentData.learningObjectives || 
                   lessonData.content || 
                   '<p>Complete this assignment as directed by your instructor.</p>',
      requirements: contentData.requirements || {
        minWords: contentData.minWords || 100,
        estimatedTime: contentData.estimatedTime || 30,
        format: 'Assignment submission',
        topics: contentData.topics || []
      },
      submission: contentData.submission || {
        submissionType: 'both', // Default to both text and file for admin assignments
        allowedFormats: ['PDF', 'DOC', 'DOCX', 'TXT', 'JPG', 'PNG'],
        maxFileSize: 10,
        maxFiles: 5
      }
    };

    console.log('Original lesson data:', lessonData);
    console.log('Transformed assignment data:', transformed);
    
    return transformed;
  };

  useEffect(() => {
    if (lesson && lesson.lesson_type === 'assignment') {
      const transformedData = transformAssignmentData(lesson);
      setAssignmentData(transformedData);
      
      // Determine submission type - default to 'both' for admin-created assignments
      const submissionFormat = transformedData.submission?.submissionType || 'both';
      console.log('Setting submission type to:', submissionFormat);
      setSubmissionType(submissionFormat);
    }
  }, [lesson]);

  useEffect(() => {
    const words = submission.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    const minWords = assignmentData?.requirements?.minWords || 100;
    const progressValue = Math.min((words.length / minWords) * 100, 100);
    setProgress(progressValue);
  }, [submission, assignmentData]);

  const handleSubmit = async () => {
    if (submitting) return;

    // Validation based on submission type
    if (submissionType === 'text') {
      if (!submission.trim()) {
        toast.error('Please provide a written response');
        return;
      }
      if (progress < 100) {
        toast.error(`Please write at least ${assignmentData?.requirements?.minWords || 100} words`);
        return;
      }
    } else if (submissionType === 'file') {
      if (fileUrls.length === 0) {
        toast.error('Please upload at least one file');
        return;
      }
    } else { // 'both'
      if (!submission.trim() && fileUrls.length === 0) {
        toast.error('Please provide either a written response or upload a file');
        return;
      }
    }

    setSubmitting(true);

    try {
      // Save submission to database
      const { error } = await supabase
        .from('assignment_submissions')
        .insert({
          assignment_id: lesson.id,
          user_id: (await getSessionUser())?.id,
          content: submission,
          file_urls: fileUrls.length > 0 ? fileUrls : null,
          status: 'submitted'
        });

      if (error) {
        console.error('Submission error:', error);
        toast.error('Failed to submit assignment');
        return;
      }

      setIsSubmitted(true);
      onComplete?.();
      toast.success('Assignment submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressColor = () => {
    if (progress >= 100) return 'from-green-500 to-emerald-500';
    if (progress >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-slate-500 to-green-500';
  };

  if (!assignmentData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20 border-0 shadow-2xl">
          <CardContent className="py-20 text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <ClipboardCheck className="h-10 w-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Loading Assignment
            </h3>
            <p className="text-muted-foreground text-lg">Preparing your assignment details...</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Success Card */}
        <Card className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border-0 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-3xl"></div>
          
          <CardContent className="py-16 text-center relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
            >
              <Award className="h-12 w-12 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Assignment Submitted!
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Great work! Your assignment has been successfully submitted for review.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-lg mx-auto mb-8">
                <div className="bg-white/20 dark:bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-green-600">{wordCount}</div>
                  <div className="text-sm text-muted-foreground">Words Written</div>
                </div>
                <div className="bg-white/20 dark:bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-green-600">{fileUrls.length}</div>
                  <div className="text-sm text-muted-foreground">Files Uploaded</div>
                </div>
                <div className="bg-white/20 dark:bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-sm text-muted-foreground">Submitted</div>
                </div>
              </div>
              
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 text-base">
                <CheckCircle className="h-4 w-4 mr-2" />
                Assignment Complete!
              </Badge>
            </motion.div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card className="bg-gradient-to-r from-card/80 to-card backdrop-blur-md shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold">Ready for the next lesson?</h4>
                <p className="text-sm text-muted-foreground">Continue your learning journey</p>
              </div>
              
              {onNext && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={onNext} 
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl"
                  >
                    Next Lesson
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Assignment Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border-0 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-400/10 to-transparent rounded-full blur-3xl"></div>
          
          <CardHeader className="relative z-10 pb-8">
            <div className="flex items-start gap-6">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-white/20"
              >
                <ClipboardCheck className="h-8 w-8 text-white" />
              </motion.div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                    {lesson.title}
                  </CardTitle>
                  <p className="text-lg text-muted-foreground mt-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-700 dark:text-green-300 px-4 py-2 text-sm font-medium">
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Assignment
                  </Badge>
                  
                  {assignmentData.requirements?.estimatedTime && (
                    <div className="flex items-center gap-2 text-muted-foreground bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{assignmentData.requirements.estimatedTime} minutes</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-muted-foreground bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">
                      {submissionType === 'text' ? 'Written Assignment' : 
                       submissionType === 'file' ? 'File Upload' : 
                       'Text & File Submission'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress */}
            {(submissionType === 'text' || submissionType === 'both') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 space-y-3"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <FileText className="h-4 w-4" />
                    Writing Progress
                  </span>
                  <span className="font-bold">{wordCount} / {assignmentData.requirements?.minWords || 100} words</span>
                </div>
                <Progress value={progress} className="h-3 bg-white/20" />
                {progress >= 100 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Word count requirement met!
                  </motion.div>
                )}
              </motion.div>
            )}
          </CardHeader>
        </Card>
      </motion.div>

      {/* Assignment Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-slate-950/20 dark:via-background dark:to-green-950/20 shadow-xl border-0 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-green-50 dark:from-slate-900/20 dark:to-green-900/20">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-white" />
              </div>
              Assignment Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={useSanitizedHtml(assignmentData.instructions, 'trusted')} />
            </div>
            
            {assignmentData.requirements && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Requirements
                </h4>
                <ul className="space-y-2 text-sm">
                  {assignmentData.requirements.minWords && (
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Minimum {assignmentData.requirements.minWords} words
                    </li>
                  )}
                  {assignmentData.requirements.format && (
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Format: {assignmentData.requirements.format}
                    </li>
                  )}
                  {assignmentData.requirements.topics && assignmentData.requirements.topics.length > 0 && (
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Cover topics: {assignmentData.requirements.topics.join(', ')}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Submission Area */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-slate-950/20 dark:via-background dark:to-green-950/20 shadow-xl border-0 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-green-50 dark:from-slate-900/20 dark:to-green-900/20">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              Your Submission
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Always show both options for admin-created assignments */}
            <Tabs defaultValue="text" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-slate-100 to-green-100 dark:from-slate-900 dark:to-green-900">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Written Response
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  File Upload
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <Textarea
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  placeholder="Start writing your assignment here..."
                  className="min-h-[400px] text-base leading-relaxed resize-none border-2 focus:border-green-500 transition-colors bg-white/80 dark:bg-slate-800/50"
                />
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{wordCount} words</span>
                  <span className={wordCount >= (assignmentData.requirements?.minWords || 100) ? 'text-green-600 font-medium' : ''}>
                    {wordCount >= (assignmentData.requirements?.minWords || 100) ? 'Requirements met!' : 'Keep writing...'}
                  </span>
                </div>
              </TabsContent>
              
              <TabsContent value="files">
                <AssignmentFileUpload
                  value={fileUrls}
                  onChange={setFileUrls}
                  allowedFormats={assignmentData.submission?.allowedFormats || ['PDF', 'DOC', 'DOCX', 'TXT', 'JPG', 'PNG']}
                  maxFileSize={assignmentData.submission?.maxFileSize || 10}
                  maxFiles={assignmentData.submission?.maxFiles || 5}
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{fileUrls.length} files uploaded</span>
                <span>•</span>
                <span className={
                  (submission.trim() || fileUrls.length > 0)
                    ? 'text-green-600 font-medium' : ''
                }>
                  {(submission.trim() || fileUrls.length > 0)
                    ? 'Ready to submit!' : 'Complete your submission'}
                </span>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || (!submission.trim() && fileUrls.length === 0)}
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 mr-2"
                        >
                          <Upload className="h-4 w-4" />
                        </motion.div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentAssignmentRenderer;
