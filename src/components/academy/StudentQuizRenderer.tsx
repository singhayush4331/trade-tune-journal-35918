
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  HelpCircle, 
  CheckCircle, 
  X, 
  ArrowRight, 
  Trophy,
  Target,
  Zap,
  Brain,
  Star,
  Clock,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface StudentQuizRendererProps {
  lesson: any;
  onComplete?: () => void;
  onNext?: () => void;
}

const StudentQuizRenderer: React.FC<StudentQuizRendererProps> = ({ 
  lesson, 
  onComplete, 
  onNext 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    // Parse quiz data from lesson content
    console.log('Quiz lesson data:', lesson);
    
    if (lesson && lesson.content_data) {
      console.log('Quiz content_data:', lesson.content_data);
      
      // Handle different possible data structures
      let questions: Question[] = [];
      
      if (lesson.content_data.questions) {
        // Map database structure to expected structure
        questions = lesson.content_data.questions.map((q: any, index: number) => {
          console.log('Processing question:', q);
          
          // Handle different property names from database
          const questionText = q.question_text || q.question || `Question ${index + 1}`;
          const options = q.options || [];
          
          // Convert correct_answer from text to index
          let correctAnswerIndex = 0;
          if (typeof q.correct_answer === 'string') {
            // Find the index of the correct answer in the options array
            correctAnswerIndex = options.findIndex((option: string) => 
              option.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()
            );
            // If not found, try to parse as number
            if (correctAnswerIndex === -1) {
              const parsed = parseInt(q.correct_answer);
              correctAnswerIndex = isNaN(parsed) ? 0 : parsed;
            }
          } else if (typeof q.correct_answer === 'number') {
            correctAnswerIndex = q.correct_answer;
          } else if (q.correctAnswer !== undefined) {
            correctAnswerIndex = q.correctAnswer;
          }
          
          console.log('Mapped question:', {
            questionText,
            options,
            correctAnswerIndex,
            originalCorrectAnswer: q.correct_answer
          });
          
          return {
            id: q.id || `q${index}`,
            question: questionText,
            options: options,
            correctAnswer: correctAnswerIndex,
            explanation: q.explanation
          };
        });
      } else if (Array.isArray(lesson.content_data)) {
        questions = lesson.content_data.map((q: any, index: number) => ({
          id: q.id || `q${index}`,
          question: q.question_text || q.question || `Question ${index + 1}`,
          options: q.options || [],
          correctAnswer: typeof q.correct_answer === 'string' 
            ? q.options?.findIndex((opt: string) => opt.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()) || 0
            : q.correct_answer || q.correctAnswer || 0,
          explanation: q.explanation
        }));
      } else {
        // Create a sample question if no questions exist
        questions = [
          {
            id: '1',
            question: 'What is the main concept covered in this lesson?',
            options: [
              'Basic trading concepts',
              'Advanced market analysis',
              'Risk management',
              'All of the above'
            ],
            correctAnswer: 3,
            explanation: 'This lesson covers comprehensive trading concepts including basic principles, analysis, and risk management.'
          }
        ];
      }
      
      console.log('Final parsed quiz questions:', questions);
      setQuizData(questions);
    }
  }, [lesson]);

  useEffect(() => {
    if (quizData.length > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizData.length, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    console.log('Answer selected:', answerIndex, 'for question:', currentQuestion);
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    console.log('Updated answers array:', newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    console.log('Calculating score...');
    console.log('Selected answers:', selectedAnswers);
    console.log('Quiz data:', quizData);
    
    selectedAnswers.forEach((answer, index) => {
      const question = quizData[index];
      if (question) {
        console.log(`Question ${index + 1}:`);
        console.log('  Question text:', question.question);
        console.log('  Options:', question.options);
        console.log('  User answer index:', answer);
        console.log('  User answer text:', question.options[answer]);
        console.log('  Correct answer index:', question.correctAnswer);
        console.log('  Correct answer text:', question.options[question.correctAnswer]);
        console.log('  Match:', answer === question.correctAnswer);
        
        if (answer === question.correctAnswer) {
          correct++;
        }
      }
    });
    
    console.log('Final score:', correct, 'out of', quizData.length);
    setScore(correct);
    setShowResults(true);
    
    const percentage = (correct / quizData.length) * 100;
    console.log('Percentage:', percentage);
    if (percentage >= 70) {
      console.log('Quiz passed! Calling onComplete');
      onComplete?.();
    }
  };

  const getScoreColor = () => {
    const percentage = (score / quizData.length) * 100;
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreMessage = () => {
    const percentage = (score / quizData.length) * 100;
    if (percentage >= 90) return "Outstanding! You're a quiz master! 🏆";
    if (percentage >= 80) return "Excellent work! You really know your stuff! ⭐";
    if (percentage >= 70) return "Great job! You passed with flying colors! 🎉";
    if (percentage >= 60) return "Good effort! Keep learning and improving! 📚";
    return "Don't worry, practice makes perfect! Try again! 💪";
  };

  if (!quizData || quizData.length === 0) {
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
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <HelpCircle className="h-10 w-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Preparing Your Quiz
            </h3>
            <p className="text-muted-foreground text-lg">Getting ready to test your knowledge...</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (showResults) {
    const percentage = (score / quizData.length) * 100;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Results Header */}
        <Card className={`bg-gradient-to-br ${getScoreColor()}/10 border-0 shadow-2xl backdrop-blur-sm relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl"></div>
          
          <CardContent className="py-12 text-center relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className={`w-24 h-24 bg-gradient-to-br ${getScoreColor()} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}
            >
              {percentage >= 70 ? (
                <Trophy className="h-12 w-12 text-white" />
              ) : (
                <Target className="h-12 w-12 text-white" />
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Quiz Complete!
              </h2>
              <p className="text-xl text-muted-foreground mb-6">{getScoreMessage()}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-white/30 via-white/20 to-white/10 dark:from-slate-800/30 dark:via-slate-800/20 dark:to-slate-800/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 dark:border-slate-700/20">
                  <div className="text-2xl font-bold">{score}/{quizData.length}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <div className="bg-gradient-to-br from-white/30 via-white/20 to-white/10 dark:from-slate-800/30 dark:via-slate-800/20 dark:to-slate-800/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 dark:border-slate-700/20">
                  <div className="text-2xl font-bold">{percentage.toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div className="bg-gradient-to-br from-white/30 via-white/20 to-white/10 dark:from-slate-800/30 dark:via-slate-800/20 dark:to-slate-800/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 dark:border-slate-700/20">
                  <div className="text-2xl font-bold">{formatTime(timeElapsed)}</div>
                  <div className="text-sm text-muted-foreground">Time</div>
                </div>
                <div className="bg-gradient-to-br from-white/30 via-white/20 to-white/10 dark:from-slate-800/30 dark:via-slate-800/20 dark:to-slate-800/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 dark:border-slate-700/20">
                  <div className="text-2xl font-bold">{percentage >= 70 ? 'PASS' : 'RETRY'}</div>
                  <div className="text-sm text-muted-foreground">Result</div>
                </div>
              </div>
              
              {percentage >= 70 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8"
                >
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 text-base">
                    <Award className="h-4 w-4 mr-2" />
                    Lesson Completed!
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>

        {/* Answer Review */}
        <Card className="bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-slate-900/50 dark:via-background dark:to-green-950/20 backdrop-blur-md shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl">Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizData.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <Card key={question.id} className={`border-l-4 ${
                  isCorrect ? 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20' : 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">Q{index + 1}: {question.question}</p>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Your answer:</span> {question.options[userAnswer] || 'No answer selected'}</p>
                          <p><span className="font-medium">Correct answer:</span> {question.options[question.correctAnswer]}</p>
                          {question.explanation && (
                            <p className="text-muted-foreground mt-2 italic">{question.explanation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card className="bg-gradient-to-r from-slate-50 via-white to-green-50 dark:from-slate-900/50 dark:via-background dark:to-green-950/20 backdrop-blur-md shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold">Ready to continue?</h4>
                <p className="text-sm text-muted-foreground">Move on to your next lesson</p>
              </div>
              
              {onNext && percentage >= 70 && (
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
              
              {percentage < 70 && (
                <Button 
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswers([]);
                    setShowResults(false);
                    setTimeElapsed(0);
                  }}
                  variant="outline"
                  size="lg"
                >
                  Try Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentQ = quizData[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border-0 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-3xl"></div>
          
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 10 }}
                className="w-14 h-14 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl"
              >
                <Brain className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {lesson.title}
                </CardTitle>
                <p className="text-muted-foreground">{lesson.description}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
                  <Zap className="h-3 w-3 mr-1" />
                  Question {currentQuestion + 1} of {quizData.length}
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
              </div>
              <span className="font-medium">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3 mt-2" />
          </CardHeader>
        </Card>
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-white via-slate-50 to-green-50 dark:from-slate-900/50 dark:via-background dark:to-green-950/20 shadow-xl border-0 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-8 leading-relaxed">
                {currentQ?.question}
              </h3>
              
              <div className="space-y-4">
                {currentQ?.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-green-500 bg-gradient-to-r from-green-500/10 to-emerald-500/10 shadow-lg'
                        : 'border-slate-200 dark:border-slate-700 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950/20 hover:shadow-md bg-white dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-green-500 bg-green-500'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <div className="flex justify-end mt-8">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleNext}
                    disabled={selectedAnswers[currentQuestion] === undefined}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-32"
                  >
                    {currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StudentQuizRenderer;
