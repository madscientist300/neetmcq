import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { QuestionNavRing } from './QuestionNavRing';
import { QuizResults } from './QuizResults';
import { ChevronLeft, ChevronRight, Send, X, LayoutList, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

interface Question {
  id: string;
  question_text: string;
  question_image_url: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string | null;
}

interface QuestionStatus {
  attempted: boolean;
  correct: boolean | null;
  selectedOption: string | null;
}

interface QuizViewProps {
  questions: Question[];
  categoryName: string;
  subjectName: string;
  timeLimit: number;
  onExit: () => void;
}

export function QuizView({ questions, categoryName, timeLimit, onExit }: QuizViewProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionStatuses, setQuestionStatuses] = useState<QuestionStatus[]>(
    questions.map(() => ({
      attempted: false,
      correct: null,
      selectedOption: null,
    }))
  );
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [viewingSolutions, setViewingSolutions] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentStatus = questionStatuses[currentIndex];

  // Countdown timer effect
  useEffect(() => {
    if (!showResults && !viewingSolutions && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up! Auto-submit the quiz
            clearInterval(timer);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showResults, viewingSolutions, timeRemaining]);

  useEffect(() => {
    if (currentStatus.attempted) {
      setSelectedOption(currentStatus.selectedOption);
    } else {
      setSelectedOption(null);
    }
  }, [currentIndex, currentStatus]);

  const handleSubmit = async () => {
    if (!selectedOption || currentStatus.attempted) return;

    const isCorrect = selectedOption === currentQuestion.correct_option;

    const { error } = await supabase
      .from('student_attempts')
      .insert({
        student_id: user?.id,
        question_id: currentQuestion.id,
        selected_option: selectedOption,
        is_correct: isCorrect,
      } as any);

    if (!error) {
      const newStatuses = [...questionStatuses];
      newStatuses[currentIndex] = {
        attempted: true,
        correct: isCorrect,
        selectedOption: selectedOption,
      };
      setQuestionStatuses(newStatuses);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleNavigate = (index: number) => {
    setCurrentIndex(index);
  };

  const handleFinish = () => {
    setShowConfirmFinish(true);
  };

  const confirmFinish = () => {
    setShowConfirmFinish(false);
    setShowResults(true);
  };

  const resumeTest = () => {
    setShowConfirmFinish(false);
  };

  const viewSolutions = () => {
    setViewingSolutions(true);
    setShowResults(false);
    setCurrentIndex(0);
    setViewMode('single');
  };

  const backToResults = () => {
    setViewingSolutions(false);
    setShowResults(true);
  };

  const attemptedCount = questionStatuses.filter(s => s.attempted).length;
  const correctCount = questionStatuses.filter(s => s.correct === true).length;

  const isLastQuestion = currentIndex === questions.length - 1;
  const showSubmitButton = selectedOption && !currentStatus.attempted;
  const showNextButton = !selectedOption || currentStatus.attempted;

  const getOptionClass = (option: string, questionIndex?: number) => {
    const baseClass = 'p-4 rounded-xl border-2 transition-all duration-200';
    const status = questionIndex !== undefined ? questionStatuses[questionIndex] : currentStatus;
    const isAttempted = status.attempted || viewingSolutions;
    const question = questionIndex !== undefined ? questions[questionIndex] : currentQuestion;

    if (!isAttempted) {
      const isSelected = questionIndex !== undefined
        ? (questionIndex === currentIndex && selectedOption === option)
        : selectedOption === option;
      if (isSelected) {
        return `${baseClass} border-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-pointer shadow-sm`;
      }
      return `${baseClass} border-light-border dark:border-dark-border hover:border-blue-300 dark:hover:border-blue-600 bg-light-card dark:bg-dark-card cursor-pointer hover:shadow-sm`;
    }

    if (option === question.correct_option) {
      return `${baseClass} border-green-500 bg-green-50 dark:bg-green-900/20`;
    }

    const selectedOpt = questionIndex !== undefined ? status.selectedOption : selectedOption;
    if (selectedOpt === option && option !== question.correct_option) {
      return `${baseClass} border-red-500 bg-red-50 dark:bg-red-900/20`;
    }

    return `${baseClass} border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-section`;
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeSpent = timeLimit - timeRemaining; // Elapsed time for results

  // Determine if time is running low (less than 5 minutes)
  const isTimeLow = timeRemaining < 300; // 5 minutes
  const isTimeCritical = timeRemaining < 120; // 2 minutes

  if (showResults) {
    return (
      <QuizResults
        totalQuestions={questions.length}
        attemptedCount={attemptedCount}
        correctCount={correctCount}
        timeSpent={timeSpent}
        onViewSolutions={viewSolutions}
        onStartNew={onExit}
      />
    );
  }

  const renderQuestion = (question: Question, index: number) => {
    const status = questionStatuses[index];

    return (
      <div key={question.id} className="bg-white/70 dark:bg-dark-card/30 backdrop-blur-xl rounded-card shadow-card-light dark:shadow-card-dark p-8 mb-6 border border-white/50 dark:border-dark-border/50">
        <div className="mb-6">
          <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
            Question {index + 1} of {questions.length}
          </span>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-8 text-light-text dark:text-dark-text text-lg leading-relaxed markdown-preview">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
          >
            {question.question_text || ''}
          </ReactMarkdown>
        </div>

        {question.question_image_url && (
          <div className="mb-8">
            <img
              src={question.question_image_url}
              alt="Question illustration"
              className="max-w-full h-auto rounded-xl shadow-md border border-light-border dark:border-dark-border"
            />
          </div>
        )}

        <div className="space-y-3 mb-8">
          {['a', 'b', 'c', 'd'].map((option) => (
            <div
              key={option}
              onClick={() => viewMode === 'single' && !viewingSolutions && !status.attempted && index === currentIndex && setSelectedOption(option)}
              className={getOptionClass(option, index)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-light-section dark:bg-dark-section text-light-text dark:text-dark-text font-semibold text-sm border border-light-border dark:border-dark-border">
                    {option.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 text-light-text dark:text-dark-text markdown-preview">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                  >
                    {question[`option_${option}` as keyof Question] as string || ''}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(status.attempted || viewingSolutions) && question.explanation && (
          <div className="mb-6 p-5 bg-light-section dark:bg-dark-section border-l-4 border-primary rounded-lg">
            <h4 className="font-semibold text-light-text dark:text-dark-text mb-2 text-base">
              Explanation
            </h4>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        {(status.attempted || viewingSolutions) && (
          <div className={`mb-6 p-5 rounded-lg border-2 ${status.correct
            ? 'bg-primary/10 dark:bg-primary/20 border-primary'
            : 'bg-red-50 dark:bg-red-900/20 border-red-500'
            }`}>
            <p className={`font-semibold ${status.correct
              ? 'text-primary-hover dark:text-primary'
              : 'text-red-600 dark:text-red-400'
              }`}>
              {status.correct ? 'Correct!' : 'Incorrect'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-black p-0 sm:p-4">
      {showConfirmFinish && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white/80 dark:bg-dark-card/40 backdrop-blur-xl rounded-card shadow-card-hover-light dark:shadow-card-hover-dark p-8 max-w-md w-full border border-white/50 dark:border-dark-border/50 animate-slide-up">
              <h3 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
                Finish Test?
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8 leading-relaxed">
                Are you sure you want to finish the test? You have attempted {attemptedCount} out of {questions.length} questions.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={resumeTest}
                  className="flex-1 px-5 py-3 bg-light-section dark:bg-dark-section text-light-text dark:text-dark-text rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover font-medium transition-all border border-light-border dark:border-dark-border"
                >
                  Resume
                </button>
                <button
                  onClick={confirmFinish}
                  className="flex-1 px-5 py-3 bg-primary hover:bg-primary-hover text-dark-bg font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 dark:bg-dark-card/30 backdrop-blur-xl rounded-card shadow-card-light dark:shadow-card-dark p-6 mb-6 border border-white/50 dark:border-dark-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
                {categoryName}
              </h2>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Progress: {attemptedCount}/{questions.length} | Correct: {correctCount}
              </p>
              <p className={`text-sm font-semibold ${isTimeCritical
                ? 'text-red-500 animate-pulse'
                : isTimeLow
                  ? 'text-yellow-500'
                  : 'text-primary'
                }`}>
                Time Remaining: {minutes}:{seconds.toString().padStart(2, '0')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!viewingSolutions && (
                <div className="flex bg-light-section dark:bg-dark-section rounded-xl p-1 border border-light-border dark:border-dark-border">
                  <button
                    onClick={() => setViewMode('single')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'single'
                      ? 'bg-light-card dark:bg-dark-card text-primary shadow-sm'
                      : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
                      }`}
                    title="Single question view"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('all')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'all'
                      ? 'bg-light-card dark:bg-dark-card text-primary shadow-sm'
                      : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
                      }`}
                    title="All questions view"
                  >
                    <LayoutList className="w-5 h-5" />
                  </button>
                </div>
              )}
              <button
                onClick={onExit}
                className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-all"
                aria-label="Exit quiz"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {!viewingSolutions && <QuestionNavRing
          totalQuestions={questions.length}
          currentIndex={currentIndex}
          questionStatuses={questionStatuses}
          onNavigate={handleNavigate}
        />}

        {viewMode === 'single' ? (
          <>
            {renderQuestion(currentQuestion, currentIndex)}

            {viewingSolutions && (
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-5 py-3 bg-light-section dark:bg-dark-section text-light-text dark:text-dark-text rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium border border-light-border dark:border-dark-border"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <button
                  onClick={backToResults}
                  className="flex-1 px-5 py-3 bg-primary hover:bg-primary-hover text-dark-bg font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  Back to Results
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                  className="flex items-center gap-2 px-5 py-3 bg-light-section dark:bg-dark-section text-light-text dark:text-dark-text rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium border border-light-border dark:border-dark-border"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {!viewingSolutions && (
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-5 py-3 bg-light-section dark:bg-dark-section text-light-text dark:text-dark-text rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium border border-light-border dark:border-dark-border"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {showSubmitButton && (
                  <button
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-dark-bg font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </button>
                )}

                {showNextButton && !isLastQuestion && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-3 bg-light-section dark:bg-dark-section text-light-text dark:text-dark-text rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition-all font-medium border border-light-border dark:border-dark-border"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {isLastQuestion && currentStatus.attempted && (
                  <button
                    onClick={handleFinish}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-dark-bg font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
                  >
                    Finish
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div>
            {questions.map((question, index) => renderQuestion(question, index))}
            {!viewingSolutions && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleFinish}
                  className="px-8 py-3 bg-primary hover:bg-primary-hover text-dark-bg font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Finish Test
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
