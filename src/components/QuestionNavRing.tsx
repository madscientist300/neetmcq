import { useState } from 'react';
import { Grid3x3, X } from 'lucide-react';

interface QuestionStatus {
  attempted: boolean;
  correct: boolean | null;
}

interface QuestionNavRingProps {
  totalQuestions: number;
  currentIndex: number;
  questionStatuses: QuestionStatus[];
  onNavigate: (index: number) => void;
}

export function QuestionNavRing({
  totalQuestions,
  currentIndex,
  questionStatuses,
  onNavigate,
}: QuestionNavRingProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCircleColor = (index: number) => {
    const status = questionStatuses[index];

    if (!status || !status.attempted) {
      return 'bg-light-text-secondary/30 dark:bg-dark-text-secondary/30 text-light-text dark:text-dark-text';
    }

    if (status.correct === true) {
      return 'bg-primary text-dark-bg';
    }

    if (status.correct === false) {
      return 'bg-red-500 text-white';
    }

    return 'bg-light-text-secondary/30 dark:bg-dark-text-secondary/30 text-light-text dark:text-dark-text';
  };

  const getCurrentBorder = (index: number) => {
    if (index === currentIndex) {
      return 'ring-4 ring-primary ring-offset-2 ring-offset-light-bg dark:ring-offset-dark-bg';
    }
    return '';
  };

  const handleQuestionClick = (index: number) => {
    onNavigate(index);
    setIsExpanded(false);
  };

  const attemptedCount = questionStatuses.filter(s => s.attempted).length;
  const correctCount = questionStatuses.filter(s => s.correct === true).length;

  return (
    <>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-primary hover:bg-primary-hover text-dark-bg rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50"
        aria-label="Toggle question navigation"
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="text-center">
            <Grid3x3 className="w-6 h-6 mx-auto" />
            <span className="text-xs font-bold">{currentIndex + 1}/{totalQuestions}</span>
          </div>
        )}
      </button>

      {isExpanded && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsExpanded(false)}
          />

          <div className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 z-50 bg-light-card dark:bg-dark-card rounded-card shadow-card-hover-light dark:shadow-card-hover-dark p-6 max-w-md w-auto sm:w-full max-h-[70vh] overflow-y-auto animate-slide-up mx-auto sm:mx-0 border border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                  Question Navigation
                </h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
                  {attemptedCount}/{totalQuestions} attempted • {correctCount} correct
                </p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-6">
              {Array.from({ length: totalQuestions }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(index)}
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    font-semibold text-sm transition-all
                    hover:scale-105 focus:outline-none border-2
                    ${getCircleColor(index)}
                    ${getCurrentBorder(index)}
                    ${index === currentIndex ? 'border-transparent' : 'border-light-border dark:border-dark-border'}
                  `}
                  aria-label={`Go to question ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="border-t border-light-border dark:border-dark-border pt-4">
              <p className="text-xs font-semibold text-light-text dark:text-dark-text mb-3">Legend:</p>
              <div className="grid grid-cols-2 gap-3 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-light-text-secondary/30 dark:bg-dark-text-secondary/30 border border-light-border dark:border-dark-border"></div>
                  <span>Unattempted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-primary"></div>
                  <span>Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-red-500"></div>
                  <span>Incorrect</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg ring-4 ring-primary bg-light-text-secondary/30 dark:bg-dark-text-secondary/30"></div>
                  <span>Current</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
