import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Plus
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string;
  explanation?: string;
  points: number;
}

interface QuizData {
  title: string;
  description: string;
  passing_score: number;
  time_limit?: number;
  questions: QuizQuestion[];
}

interface QuizRendererProps {
  quizData: QuizData;
  onComplete?: (score: number, passed: boolean) => void;
}

const QuizRenderer: React.FC<QuizRendererProps> = ({ quizData, onComplete }) => {
  // Validate quiz data before rendering
  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Quiz Not Ready</CardTitle>
          <p className="text-muted-foreground mt-2">
            This quiz doesn't have any questions yet. Please add questions in the builder to make it available.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="p-6 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/30">
              <Plus className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No questions found. Go back to the builder and add some questions to get started.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quizData.time_limit ? quizData.time_limit * 60 : null
  );
  const [quizStarted, setQuizStarted] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    if (!quizStarted || !timeRemaining || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    const score = calculateScore();
    const passed = score >= quizData.passing_score;
    onComplete?.(score, passed);
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    quizData.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      if (userAnswer && userAnswer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim()) {
        earnedPoints += question.points;
      }
    });

    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setTimeRemaining(quizData.time_limit ? quizData.time_limit * 60 : null);
    setQuizStarted(false);
  };

  // Quiz intro screen
  if (!quizStarted) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">{quizData.title}</CardTitle>
          <p className="text-muted-foreground mt-2">{quizData.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{quizData.passing_score}%</div>
                <div className="text-sm text-muted-foreground">Passing Score</div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {quizData.time_limit ? `${quizData.time_limit}m` : '∞'}
                </div>
                <div className="text-sm text-muted-foreground">Time Limit</div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center">
            <Button onClick={() => setQuizStarted(true)} size="lg" className="min-w-32">
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Results screen
  if (showResults) {
    const score = calculateScore();
    const passed = score >= quizData.passing_score;

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            passed ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gradient-to-br from-red-500 to-pink-500'
          }`}>
            {passed ? (
              <Award className="h-8 w-8 text-white" />
            ) : (
              <XCircle className="h-8 w-8 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {passed ? 'Congratulations!' : 'Quiz Complete'}
          </CardTitle>
          <p className="text-muted-foreground">
            {passed ? 'You passed the quiz!' : 'Better luck next time!'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <Badge variant={passed ? "default" : "secondary"} className="text-sm">
              {passed ? 'Passed' : 'Failed'} • Required: {quizData.passing_score}%
            </Badge>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Review Your Answers:</h3>
            {quizData.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer?.toLowerCase().trim() === question.correct_answer.toLowerCase().trim();
              
              return (
                <Card key={question.id} className={`border-l-4 ${
                  isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">Q{index + 1}: {question.question_text}</p>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Your answer:</span> {userAnswer || 'No answer'}</p>
                          <p><span className="font-medium">Correct answer:</span> {question.correct_answer}</p>
                          {question.explanation && (
                            <p className="text-muted-foreground mt-2">{question.explanation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button onClick={restartQuiz} variant="outline" className="min-w-32">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Quiz question screen
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Badge>
          {timeRemaining !== null && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className={timeRemaining < 60 ? 'text-red-500 font-bold' : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
        <Progress value={progress} className="mb-4" />
        <CardTitle className="text-xl">{currentQuestion.question_text}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentQuestion.question_type === 'multiple_choice' && (
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          >
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {currentQuestion.question_type === 'true_false' && (
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="cursor-pointer">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="cursor-pointer">False</Label>
            </div>
          </RadioGroup>
        )}

        {currentQuestion.question_type === 'short_answer' && (
          <Textarea
            placeholder="Type your answer here..."
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            rows={4}
          />
        )}

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button onClick={handleSubmitQuiz}>
              Submit Quiz
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizRenderer;
