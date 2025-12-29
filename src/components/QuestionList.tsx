import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChapterSearch } from './ChapterSearch';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

interface Question {
  id: string;
  subject_id: string;
  chapter_id: string;
  question_text: string;
  question_image_url: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string | null;
  difficulty: string;
  created_at: string;
}

interface Subject {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  name: string;
  subject_id: string;
  subject_name?: string;
}

interface Category {
  id: string;
  name: string;
}

interface QuestionListProps {
  refresh: number;
}

export function QuestionList({ refresh }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    fetchSubjects();
    fetchChapters();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchQuestions();
    setCurrentPage(1); // Reset to first page when filters change
  }, [refresh, selectedChapter, filterCategory]);

  const fetchSubjects = async () => {
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .order('name');
    if (data) setSubjects(data);
  };

  const fetchChapters = async () => {
    const { data } = await supabase
      .from('chapters')
      .select('*, subjects(name)')
      .order('order_index') as any;

    if (data) {
      const chaptersWithSubject = data.map((chapter: any) => ({
        id: chapter.id,
        name: chapter.name,
        subject_id: chapter.subject_id,
        subject_name: chapter.subjects?.name || 'Unknown'
      }));
      setChapters(chaptersWithSubject);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('order_index');
    if (data) setCategories(data);
  };

  const fetchQuestions = async () => {
    setLoading(true);

    let query = supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedChapter) {
      query = query.eq('chapter_id', selectedChapter.id);
    }

    const { data: questionsData } = await query;

    if (questionsData && filterCategory) {
      const { data: questionCats } = await supabase
        .from('question_categories')
        .select('question_id')
        .eq('category_id', filterCategory) as any;

      const questionIds = questionCats?.map((qc: any) => qc.question_id) || [];
      const filtered = questionsData.filter((q: any) => questionIds.includes(q.id));
      setQuestions(filtered);
    } else {
      setQuestions(questionsData || []);
    }

    setLoading(false);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId);

    if (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete question: ${error.message}`);
    } else {
      fetchQuestions();
    }
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown';
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Questions Library ({questions.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <ChapterSearch
            selectedChapter={selectedChapter}
            onChapterSelect={setSelectedChapter}
            chapters={chapters}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Category
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      {questions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          {selectedChapter ? `No questions found for ${selectedChapter.name}.` : 'No questions found. Create your first question above.'}
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {currentQuestions.map((question) => (
              <div
                key={question.id}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {getSubjectName(question.subject_id)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${question.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                          'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100 markdown-preview">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                      >
                        {question.question_text || ''}
                      </ReactMarkdown>
                    </div>
                    {question.question_image_url && (
                      <img
                        src={question.question_image_url}
                        alt="Question"
                        className="mt-2 max-w-md rounded"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                    aria-label="Delete question"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                  <div className={`p-2 rounded ${question.correct_option === 'a' ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' : 'bg-gray-50 dark:bg-gray-700'}`}>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">A:</span> <span className="text-gray-900 dark:text-gray-100">{question.option_a}</span>
                  </div>
                  <div className={`p-2 rounded ${question.correct_option === 'b' ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' : 'bg-gray-50 dark:bg-gray-700'}`}>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">B:</span> <span className="text-gray-900 dark:text-gray-100">{question.option_b}</span>
                  </div>
                  <div className={`p-2 rounded ${question.correct_option === 'c' ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' : 'bg-gray-50 dark:bg-gray-700'}`}>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">C:</span> <span className="text-gray-900 dark:text-gray-100">{question.option_c}</span>
                  </div>
                  <div className={`p-2 rounded ${question.correct_option === 'd' ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' : 'bg-gray-50 dark:bg-gray-700'}`}>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">D:</span> <span className="text-gray-900 dark:text-gray-100">{question.option_d}</span>
                  </div>
                </div>

                {question.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Explanation:</span> {question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-300 dark:border-gray-600 pt-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {indexOfFirstQuestion + 1} to {Math.min(indexOfLastQuestion, questions.length)} of {questions.length} questions
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
