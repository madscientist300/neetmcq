import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { QuestionForm } from '../components/QuestionForm';
import { QuestionList } from '../components/QuestionList';
import { LogOut, BookOpen, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function TeacherDashboard() {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleQuestionCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-black">
      <nav className="bg-white/70 dark:bg-dark-card/30 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-dark-border/50 pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 md:px-10 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                  NEET-UG MCQ Platform
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Teacher Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile?.full_name || 'Teacher'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{profile?.email}</p>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={signOut}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-10 md:px-10 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="bg-white/70 dark:bg-dark-card/30 backdrop-blur-xl rounded-card shadow-card-light dark:shadow-card-dark border border-white/50 dark:border-dark-border/50 p-6">
            <QuestionForm onQuestionCreated={handleQuestionCreated} />
          </div>
          <div className="bg-white/70 dark:bg-dark-card/30 backdrop-blur-xl rounded-card shadow-card-light dark:shadow-card-dark border border-white/50 dark:border-dark-border/50 p-6">
            <QuestionList refresh={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
}
