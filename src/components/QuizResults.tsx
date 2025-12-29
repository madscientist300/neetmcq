import {
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Target,
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface QuizResultsProps {
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  timeSpent: number;
  onViewSolutions: () => void;
  onStartNew: () => void;
}

export function QuizResults({
  totalQuestions,
  attemptedCount,
  correctCount,
  timeSpent,
  onViewSolutions,
  onStartNew,
}: QuizResultsProps) {
  const incorrectCount = attemptedCount - correctCount;
  const unattemptedCount = totalQuestions - attemptedCount;

  // NEET-UG Marking Scheme: +4 for correct, -1 for incorrect
  const totalMarks = (correctCount * 4) - (incorrectCount * 1);
  const maximumMarks = totalQuestions * 4;
  const percentage = maximumMarks > 0 ? (totalMarks / maximumMarks) * 100 : 0;

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  const avgTimePerQuestion = attemptedCount > 0 ? timeSpent / attemptedCount : 0;
  const avgMinutes = Math.floor(avgTimePerQuestion / 60);
  const avgSeconds = Math.floor(avgTimePerQuestion % 60);

  const getPerformanceLevel = () => {
    if (percentage >= 90) return 'Outstanding';
    if (percentage >= 75) return 'Excellent';
    if (percentage >= 60) return 'Very Good';
    if (percentage >= 45) return 'Good';
    if (percentage >= 30) return 'Fair';
    return 'Needs Improvement';
  };

  const getPerformanceSuggestions = () => {
    const suggestions = [];

    if (percentage >= 90) {
      suggestions.push({
        type: 'success',
        title: 'Outstanding Performance!',
        message: 'You\'re performing at an elite level. Maintain this consistency and focus on speed optimization.'
      });
    } else if (percentage >= 75) {
      suggestions.push({
        type: 'success',
        title: 'Excellent Work!',
        message: 'You have a strong grasp of the concepts. Keep practicing to improve accuracy and reduce silly mistakes.'
      });
    } else if (percentage >= 60) {
      suggestions.push({
        type: 'info',
        title: 'Very Good Attempt',
        message: 'You\'re on the right track! Focus on strengthening weak topics and practice more questions daily.'
      });
    } else if (percentage >= 45) {
      suggestions.push({
        type: 'info',
        title: 'Good Effort',
        message: 'Review incorrect answers thoroughly. Focus on building strong fundamentals in each chapter.'
      });
    } else if (percentage >= 30) {
      suggestions.push({
        type: 'warning',
        title: 'Room for Improvement',
        message: 'Spend more time understanding core concepts. Consider revising NCERT thoroughly and practice more questions.'
      });
    } else {
      suggestions.push({
        type: 'warning',
        title: 'Build Your Foundation',
        message: 'Focus on basics first. Study NCERT line-by-line, make notes, and practice easy questions before attempting harder ones.'
      });
    }

    // Time management suggestions
    if (avgTimePerQuestion > 90) {
      suggestions.push({
        type: 'info',
        title: 'Speed Up',
        message: 'You\'re taking more than 90 seconds per question. In NEET, aim for 45-60 seconds average. Practice timed quizzes regularly.'
      });
    }

    // Attempt rate suggestions
    const attemptRate = (attemptedCount / totalQuestions) * 100;
    if (attemptRate < 80) {
      suggestions.push({
        type: 'info',
        title: 'Attempt More Questions',
        message: `You attempted only ${attemptRate.toFixed(0)}% of questions. In the actual exam, try to attempt at least 90% with accuracy.`
      });
    }

    // Accuracy suggestions
    const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
    if (accuracy < 70 && attemptedCount > 0) {
      suggestions.push({
        type: 'warning',
        title: 'Improve Accuracy',
        message: `Your accuracy is ${accuracy.toFixed(0)}%. Focus on understanding concepts rather than guessing. Quality over quantity!`
      });
    }

    return suggestions;
  };

  const performance = getPerformanceLevel();
  const suggestions = getPerformanceSuggestions();
  const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-0 sm:p-4">
      <div className="max-w-5xl mx-auto py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 dark:bg-primary/30 mb-5 border-4 border-primary">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-3">
            Test Completed
          </h1>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
            Performance Analysis
          </p>
        </div>

        <div className="bg-light-card dark:bg-dark-card border-2 border-primary rounded-card p-8 mb-8 text-center shadow-card-light dark:shadow-card-dark">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-light-text dark:text-dark-text">{performance}</h2>
          </div>
          <div className="mb-4">
            <p className="text-5xl font-bold text-primary mb-2">{totalMarks} / {maximumMarks}</p>
            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">Total Marks</p>
          </div>
          <div className="flex justify-center gap-8 pt-4 border-t border-light-border dark:border-dark-border">
            <div>
              <p className="text-2xl font-semibold text-primary">{percentage.toFixed(1)}%</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Percentage</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-primary">{accuracy.toFixed(1)}%</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Accuracy</p>
            </div>
          </div>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-4">
            Marking: +4 for correct | -1 for incorrect | 0 for unattempted
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-light-card dark:bg-dark-card rounded-card shadow-card-light dark:shadow-card-dark p-6 text-center border border-light-border dark:border-dark-border hover:shadow-card-hover-light dark:hover:shadow-card-hover-dark transition-all">
            <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Correct</p>
            <p className="text-3xl font-bold text-primary">
              {correctCount}
            </p>
          </div>

          <div className="bg-light-card dark:bg-dark-card rounded-card shadow-card-light dark:shadow-card-dark p-6 text-center border border-light-border dark:border-dark-border hover:shadow-card-hover-light dark:hover:shadow-card-hover-dark transition-all">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Incorrect</p>
            <p className="text-3xl font-bold text-red-500">
              {incorrectCount}
            </p>
          </div>

          <div className="bg-light-card dark:bg-dark-card rounded-card shadow-card-light dark:shadow-card-dark p-6 text-center border border-light-border dark:border-dark-border hover:shadow-card-hover-light dark:hover:shadow-card-hover-dark transition-all">
            <BookOpen className="w-10 h-10 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-3" />
            <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Unattempted</p>
            <p className="text-3xl font-bold text-light-text-secondary dark:text-dark-text-secondary">
              {unattemptedCount}
            </p>
          </div>

          <div className="bg-light-card dark:bg-dark-card rounded-card shadow-card-light dark:shadow-card-dark p-6 text-center border border-light-border dark:border-dark-border hover:shadow-card-hover-light dark:hover:shadow-card-hover-dark transition-all">
            <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Accuracy</p>
            <p className="text-3xl font-bold text-primary">
              {accuracy.toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-light-card dark:bg-dark-card rounded-card shadow-card-light dark:shadow-card-dark p-6 border border-light-border dark:border-dark-border">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text">Time Analysis</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-light-section dark:bg-dark-section rounded-xl border border-light-border dark:border-dark-border">
                <span className="text-light-text dark:text-dark-text font-medium">Total Time</span>
                <span className="text-xl font-bold text-light-text dark:text-dark-text">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-light-section dark:bg-dark-section rounded-xl border border-light-border dark:border-dark-border">
                <span className="text-light-text dark:text-dark-text font-medium">Avg Time/Question</span>
                <span className="text-xl font-bold text-light-text dark:text-dark-text">
                  {avgMinutes > 0 ? `${avgMinutes}m ` : ''}{avgSeconds}s
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-light-section dark:bg-dark-section rounded-xl border border-light-border dark:border-dark-border">
                <span className="text-light-text dark:text-dark-text font-medium">Questions/Minute</span>
                <span className="text-xl font-bold text-light-text dark:text-dark-text">
                  {minutes > 0 ? (attemptedCount / minutes).toFixed(1) : attemptedCount}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-light-card dark:bg-dark-card rounded-card shadow-card-light dark:shadow-card-dark p-6 border border-light-border dark:border-dark-border">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text">Score Breakdown</h3>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-light-text dark:text-dark-text">Correct</span>
                  <span className="text-sm font-bold text-primary">
                    {((correctCount / totalQuestions) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-light-section dark:bg-dark-section rounded-full h-3 border border-light-border dark:border-dark-border overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-1000"
                    style={{ width: `${(correctCount / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-light-text dark:text-dark-text">Incorrect</span>
                  <span className="text-sm font-bold text-red-500">
                    {((incorrectCount / totalQuestions) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-light-section dark:bg-dark-section rounded-full h-3 border border-light-border dark:border-dark-border overflow-hidden">
                  <div
                    className="bg-red-500 h-full transition-all duration-1000"
                    style={{ width: `${(incorrectCount / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-light-text dark:text-dark-text">Unattempted</span>
                  <span className="text-sm font-bold text-light-text-secondary dark:text-dark-text-secondary">
                    {((unattemptedCount / totalQuestions) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-light-section dark:bg-dark-section rounded-full h-3 border border-light-border dark:border-dark-border overflow-hidden">
                  <div
                    className="bg-light-text-secondary dark:bg-dark-text-secondary h-full transition-all duration-1000"
                    style={{ width: `${(unattemptedCount / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-light-card dark:bg-dark-card rounded-card shadow-card-light dark:shadow-card-dark p-8 mb-8 border border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text">Performance Suggestions</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-xl border ${suggestion.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500/30'
                  : suggestion.type === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500/30'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500/30'
                  }`}
              >
                {suggestion.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : suggestion.type === 'warning' ? (
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-light-text dark:text-dark-text">{suggestion.title}</p>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{suggestion.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={onViewSolutions}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-dark-bg font-bold rounded-card transition-all shadow-md hover:shadow-lg"
          >
            View Detailed Solutions
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onStartNew}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-light-section dark:bg-dark-section hover:bg-light-hover dark:hover:bg-dark-hover text-light-text dark:text-dark-text font-bold rounded-card transition-all border border-light-border dark:border-dark-border"
          >
            <BookOpen className="w-5 h-5" />
            Practice More
          </button>
        </div>

        <div className="bg-light-section dark:bg-dark-section border-l-4 border-primary p-6 rounded-card">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-light-text dark:text-dark-text mb-2">Pro Tip</h4>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                Regular practice with detailed solution review is key to NEET success.
                Focus on understanding concepts rather than memorizing answers.
                Keep track of your weak areas and revisit them frequently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
