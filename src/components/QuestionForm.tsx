import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle } from 'lucide-react';
import { MarkdownEditor } from './MarkdownEditor';
import { ImageUpload } from './ImageUpload';
import { ChapterSearch } from './ChapterSearch';


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

interface QuestionFormProps {
  onQuestionCreated: () => void;
}

export function QuestionForm({ onQuestionCreated }: QuestionFormProps) {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const [formData, setFormData] = useState({
    questionText: '',
    questionImageUrl: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'a' as 'a' | 'b' | 'c' | 'd',
    explanation: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    tags: '',
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchChapters();
    fetchCategories();
  }, []);

  const fetchChapters = async () => {
    const { data } = await supabase
      .from('chapters')
      .select(`
        *,
        subjects!inner(name)
      `)
      .order('order_index')
      .order('name') as any;

    if (data) {
      const chaptersWithSubject = data.map((chapter: any) => ({
        ...chapter,
        subject_name: chapter.subjects?.name || 'Unknown Subject'
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

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedChapter) {
      setError('Please select a chapter');
      return;
    }

    if (!formData.questionText.trim()) {
      setError('Question text is required');
      return;
    }

    if (!formData.optionA || !formData.optionB || !formData.optionC || !formData.optionD) {
      setError('All options are required');
      return;
    }

    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert({
          subject_id: selectedChapter.subject_id,
          chapter_id: selectedChapter.id,
          question_text: formData.questionText,
          question_image_url: formData.questionImageUrl || null,
          option_a: formData.optionA,
          option_b: formData.optionB,
          option_c: formData.optionC,
          option_d: formData.optionD,
          correct_option: formData.correctOption,
          explanation: formData.explanation || null,
          difficulty_level: formData.difficulty,
          tags: tagsArray,
          created_by: user?.id,
        } as any)
        .select()
        .single() as any;

      if (questionError) throw questionError;

      if (selectedCategories.length > 0 && question) {
        const categoryInserts = selectedCategories.map(catId => ({
          question_id: question.id,
          category_id: catId,
        }));

        const { error: categoryError } = await supabase
          .from('question_categories')
          .insert(categoryInserts as any);

        if (categoryError) throw categoryError;
      }

      setSuccess('Question created successfully! Add another question to the same chapter.');
      setFormData({
        questionText: '',
        questionImageUrl: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'a',
        explanation: '',
        difficulty: 'medium',
        tags: '',
      });
      setSelectedCategories([]);
      onQuestionCreated();

      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <PlusCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Question
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <ChapterSearch
          selectedChapter={selectedChapter}
          onChapterSelect={setSelectedChapter}
          chapters={chapters}
        />

        <MarkdownEditor
          value={formData.questionText}
          onChange={(value) => setFormData({ ...formData, questionText: value })}
          label="Question Text"
          placeholder="Enter question text with markdown formatting (tables, bold, italic, etc.)"
          rows={6}
          required
          showHelp
        />

        <ImageUpload
          currentImageUrl={formData.questionImageUrl}
          onImageUploaded={(url) => setFormData({ ...formData, questionImageUrl: url })}
          onImageRemoved={() => setFormData({ ...formData, questionImageUrl: '' })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Option A *
            </label>
            <input
              type="text"
              value={formData.optionA}
              onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Option B *
            </label>
            <input
              type="text"
              value={formData.optionB}
              onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Option C *
            </label>
            <input
              type="text"
              value={formData.optionC}
              onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Option D *
            </label>
            <input
              type="text"
              value={formData.optionD}
              onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correct Option *
            </label>
            <select
              value={formData.correctOption}
              onChange={(e) => setFormData({ ...formData, correctOption: e.target.value as any })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="c">C</option>
              <option value="d">D</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty *
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <MarkdownEditor
          value={formData.explanation}
          onChange={(value) => setFormData({ ...formData, explanation: value })}
          label="Explanation"
          placeholder="Explain the correct answer with detailed reasoning. Supports full markdown & LaTeX math!
Example: The answer is **correct** because $F = ma$ where $F$ is force..."
          rows={4}
          required={false}
          showHelp={true}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags / Key Concepts (Optional)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="e.g., photosynthesis, chlorophyll, light reaction (comma-separated)"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Add key concepts, topics, or tags for better filtering. Separate multiple tags with commas.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categories (Select multiple)
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryToggle(category.id)}
                className={`px-4 py-2 rounded-lg border transition-colors ${selectedCategories.includes(category.id)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? 'Creating...' : 'Create Question'}
        </button>
      </form>
    </div>
  );
}
