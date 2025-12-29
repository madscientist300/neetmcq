import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { QuizView } from '../components/QuizView';
import { QuestionFilters } from '../components/QuestionFilters';
import { LogOut, BookOpen, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Subject {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  name: string;
  subject_id: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

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

interface FilterState {
  subjectId: string | null;
  chapterIds: string[];
  categoryIds: string[];
  tags: string[];
  difficulty: string | null;
}

export function StudentDashboard() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    subjectId: null,
    chapterIds: [],
    categoryIds: [],
    tags: [],
    difficulty: null,
  });
  const [questionCount, setQuestionCount] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizSubjectName, setQuizSubjectName] = useState<string>('');
  const [quizTimeLimit, setQuizTimeLimit] = useState<number>(0);

  useEffect(() => {
    fetchSubjects();
    fetchChapters();
    fetchCategories();
    fetchAvailableTags();
  }, []);

  useEffect(() => {
    fetchQuestionCount();
  }, [filters]);

  const fetchSubjects = async () => {
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (data) {
      setSubjects(data);
    }
    setLoading(false);
  };

  const fetchChapters = async () => {
    const { data: questionsData } = await supabase
      .from('questions')
      .select('chapter_id') as any;

    if (questionsData) {
      const chapterIdsWithQuestions = [...new Set(questionsData.map((q: any) => q.chapter_id).filter(Boolean))];

      const { data } = await supabase
        .from('chapters')
        .select('*')
        .in('id', chapterIdsWithQuestions)
        .order('order_index');

      if (data) {
        setChapters(data);
      }
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('order_index');
    if (data) {
      setCategories(data);
    }
  };

  const fetchAvailableTags = async () => {
    const { data } = await supabase
      .from('questions')
      .select('tags') as any;

    if (data) {
      const allTags = new Set<string>();
      data.forEach((q: any) => {
        if (q.tags && Array.isArray(q.tags)) {
          q.tags.forEach((tag: string) => allTags.add(tag));
        }
      });
      setAvailableTags(Array.from(allTags).sort());
    }
  };

  const fetchQuestionCount = async () => {
    let query = supabase
      .from('questions')
      .select('id', { count: 'exact', head: true });

    if (filters.subjectId) {
      query = query.eq('subject_id', filters.subjectId);
    }

    if (filters.chapterIds.length > 0) {
      query = query.in('chapter_id', filters.chapterIds);
    }

    if (filters.difficulty) {
      query = query.eq('difficulty_level', filters.difficulty);
    }

    if (filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters.categoryIds.length > 0) {
      const { data: questionCats } = await supabase
        .from('question_categories')
        .select('question_id')
        .in('category_id', filters.categoryIds) as any;

      if (questionCats && questionCats.length > 0) {
        const questionIds = questionCats.map((qc: any) => qc.question_id);
        query = query.in('id', questionIds);
      } else {
        setQuestionCount(0);
        return;
      }
    }

    const { count } = await query;
    setQuestionCount(count || 0);
  };

  const startQuiz = async () => {
    const MAX_QUESTIONS = 45;

    // Build base query for questions
    let query = supabase
      .from('questions')
      .select('id, question_text, question_image_url, option_a, option_b, option_c, option_d, correct_option, explanation, subject_id');

    if (filters.subjectId) {
      query = query.eq('subject_id', filters.subjectId);
    }

    if (filters.chapterIds.length > 0) {
      query = query.in('chapter_id', filters.chapterIds);
    }

    if (filters.difficulty) {
      query = query.eq('difficulty_level', filters.difficulty);
    }

    if (filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters.categoryIds.length > 0) {
      const { data: questionCats } = await supabase
        .from('question_categories')
        .select('question_id')
        .in('category_id', filters.categoryIds);

      if (!questionCats || questionCats.length === 0) {
        alert('No questions available for the selected filters');
        return;
      }

      const questionIds = questionCats.map((qc: any) => qc.question_id);
      query = query.in('id', questionIds);
    }

    const { data: allQuestions } = await query;

    if (!allQuestions || allQuestions.length === 0) {
      alert('No questions available for the selected filters');
      return;
    }

    // Fetch user's previous attempts
    const { data: attempts } = await supabase
      .from('student_attempts')
      .select('question_id')
      .eq('student_id', user?.id || '') as any;

    const attemptedQuestionIds = new Set(attempts?.map((a: any) => a.question_id) || []);

    // Separate unattempted and attempted questions
    const unattemptedQuestions = allQuestions.filter((q: any) => !attemptedQuestionIds.has(q.id));
    const attemptedQuestions = allQuestions.filter((q: any) => attemptedQuestionIds.has(q.id));

    let selectedQuestions: any[] = [];

    if (unattemptedQuestions.length >= MAX_QUESTIONS) {
      // Randomly select 45 from unattempted
      selectedQuestions = shuffleArray(unattemptedQuestions).slice(0, MAX_QUESTIONS);
    } else if (unattemptedQuestions.length > 0) {
      // Take all unattempted + random from attempted to reach 45 (if possible)
      selectedQuestions = [...unattemptedQuestions];
      const remaining = MAX_QUESTIONS - unattemptedQuestions.length;
      if (attemptedQuestions.length > 0 && remaining > 0) {
        selectedQuestions.push(...shuffleArray(attemptedQuestions).slice(0, remaining));
      }
    } else if (allQuestions.length > MAX_QUESTIONS) {
      // All attempted, randomly select 45
      selectedQuestions = shuffleArray(allQuestions).slice(0, MAX_QUESTIONS);
    } else {
      // Less than 45 total questions, use all
      selectedQuestions = shuffleArray(allQuestions);
    }

    // Determine subject name and time limit
    let subjectName = 'Practice Quiz';
    let timeLimit = 3000; // Default 50 minutes in seconds

    if (filters.subjectId) {
      const subject = subjects.find(s => s.id === filters.subjectId);
      if (subject) {
        subjectName = subject.name;
        // Botany and Zoology: 40 minutes (2400 seconds)
        // Physics and Chemistry: 50 minutes (3000 seconds)
        if (subject.name === 'Botany' || subject.name === 'Zoology') {
          timeLimit = 2400; // 40 minutes
        } else {
          timeLimit = 3000; // 50 minutes
        }
      }
    }

    setQuizSubjectName(subjectName);
    setQuizTimeLimit(timeLimit);
    setQuizQuestions(selectedQuestions);
    setQuizStarted(true);
  };

  // Helper function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const exitQuiz = () => {
    setQuizStarted(false);
    setQuizQuestions([]);
  };

  if (quizStarted && quizQuestions.length > 0) {
    return (
      <QuizView
        questions={quizQuestions}
        categoryName={quizSubjectName}
        subjectName={quizSubjectName}
        timeLimit={quizTimeLimit}
        onExit={exitQuiz}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <nav className="bg-white/70 dark:bg-dark-card/30 backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-border/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 md:px-10 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                  NEET-UG MCQ Platform
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Student Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile?.full_name || 'Student'}
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
        <div className="bg-white/70 dark:bg-dark-card/30 backdrop-blur-xl rounded-card shadow-card-light dark:shadow-card-dark border border-white/50 dark:border-dark-border/50 p-6">
          <QuestionFilters
            subjects={subjects}
            chapters={chapters}
            categories={categories}
            availableTags={availableTags}
            filters={filters}
            onFilterChange={setFilters}
            questionCount={questionCount}
            onStartQuiz={startQuiz}
          />
        </div>
      </main>
    </div>
  );
}
