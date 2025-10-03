
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Trash2, 
  GripVertical,
  HelpCircle,
  CheckCircle,
  XCircle,
  Edit
} from 'lucide-react';

export interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string;
  points: number;
  explanation?: string;
}

export interface QuizData {
  title: string;
  description: string;
  passing_score: number;
  time_limit?: number;
  questions: QuizQuestion[];
}

interface QuizBuilderProps {
  quizData: QuizData;
  onQuizDataChange: (data: QuizData) => void;
}

const QuizBuilder: React.FC<QuizBuilderProps> = ({ quizData, onQuizDataChange }) => {
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  const updateQuizData = (updates: Partial<QuizData>) => {
    onQuizDataChange({ ...quizData, ...updates });
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}`,
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 1,
      explanation: ''
    };
    
    updateQuizData({
      questions: [...quizData.questions, newQuestion]
    });
    setEditingQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    const updatedQuestions = quizData.questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    );
    updateQuizData({ questions: updatedQuestions });
  };

  const removeQuestion = (questionId: string) => {
    updateQuizData({
      questions: quizData.questions.filter(q => q.id !== questionId)
    });
    if (editingQuestion === questionId) {
      setEditingQuestion(null);
    }
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    const question = quizData.questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice': return <HelpCircle className="h-4 w-4" />;
      case 'true_false': return <CheckCircle className="h-4 w-4" />;
      case 'short_answer': return <Edit className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'true_false': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'short_answer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quiz Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Quiz Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Passing Score (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={quizData.passing_score}
                onChange={(e) => updateQuizData({ passing_score: parseInt(e.target.value) || 70 })}
                placeholder="70"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Limit (minutes)</label>
              <Input
                type="number"
                min="1"
                value={quizData.time_limit || ''}
                onChange={(e) => updateQuizData({ time_limit: parseInt(e.target.value) || undefined })}
                placeholder="No limit"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quiz Questions ({quizData.questions.length})</CardTitle>
            <Button onClick={addQuestion} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {quizData.questions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No questions added yet</p>
              <p className="text-sm">Create your first quiz question to get started</p>
              <Button onClick={addQuestion} className="mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add First Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {quizData.questions.map((question, index) => (
                <Card key={question.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <Badge className={getQuestionTypeColor(question.question_type)}>
                          {getQuestionTypeIcon(question.question_type)}
                          <span className="ml-1 capitalize">
                            {question.question_type.replace('_', ' ')}
                          </span>
                        </Badge>
                        <span className="font-medium">Question {index + 1}</span>
                        <span className="text-sm text-muted-foreground">
                          {question.points} {question.points === 1 ? 'point' : 'points'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setEditingQuestion(editingQuestion === question.id ? null : question.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {editingQuestion === question.id ? (
                    <CardContent className="space-y-4">
                      {/* Question Text */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Question</label>
                        <Textarea
                          value={question.question_text}
                          onChange={(e) => updateQuestion(question.id, { question_text: e.target.value })}
                          placeholder="Enter your question..."
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Question Type */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Question Type</label>
                          <Select
                            value={question.question_type}
                            onValueChange={(value: 'multiple_choice' | 'true_false' | 'short_answer') => {
                              const updates: Partial<QuizQuestion> = { question_type: value };
                              if (value === 'true_false') {
                                updates.options = ['True', 'False'];
                              } else if (value === 'multiple_choice' && (!question.options || question.options.length !== 4)) {
                                updates.options = ['', '', '', ''];
                              } else if (value === 'short_answer') {
                                updates.options = undefined;
                              }
                              updateQuestion(question.id, updates);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                              <SelectItem value="true_false">True/False</SelectItem>
                              <SelectItem value="short_answer">Short Answer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Points */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Points</label>
                          <Input
                            type="number"
                            min="1"
                            value={question.points}
                            onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                          />
                        </div>
                      </div>

                      {/* Options for Multiple Choice and True/False */}
                      {(question.question_type === 'multiple_choice' || question.question_type === 'true_false') && question.options && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Answer Options</label>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    name={`correct_${question.id}`}
                                    checked={question.correct_answer === option}
                                    onChange={() => updateQuestion(question.id, { correct_answer: option })}
                                    className="mr-2"
                                  />
                                  <span className="text-sm font-medium">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                </div>
                                <Input
                                  value={option}
                                  onChange={(e) => updateQuestionOption(question.id, optionIndex, e.target.value)}
                                  placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                  disabled={question.question_type === 'true_false'}
                                  className="flex-1"
                                />
                                {question.correct_answer === option && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Correct Answer for Short Answer */}
                      {question.question_type === 'short_answer' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Correct Answer</label>
                          <Input
                            value={question.correct_answer}
                            onChange={(e) => updateQuestion(question.id, { correct_answer: e.target.value })}
                            placeholder="Enter the correct answer..."
                          />
                        </div>
                      )}

                      {/* Explanation */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Explanation (Optional)</label>
                        <Textarea
                          value={question.explanation || ''}
                          onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                          placeholder="Explain why this is the correct answer..."
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-medium">{question.question_text || 'Question text not set'}</p>
                        {question.options && question.options.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            <p>Options: {question.options.filter(opt => opt.trim()).length} answers</p>
                            <p>Correct: {question.correct_answer || 'Not set'}</p>
                          </div>
                        )}
                        {question.question_type === 'short_answer' && (
                          <p className="text-sm text-muted-foreground">
                            Expected answer: {question.correct_answer || 'Not set'}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizBuilder;
