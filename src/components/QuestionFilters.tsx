import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Filter, X, Tag, BookOpen, Layers, TrendingUp } from 'lucide-react';

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

interface FilterState {
  subjectId: string | null;
  chapterIds: string[];
  categoryIds: string[];
  tags: string[];
  difficulty: string | null;
}

interface QuestionFiltersProps {
  subjects: Subject[];
  chapters: Chapter[];
  categories: Category[];
  availableTags: string[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  questionCount: number;
  onStartQuiz: () => void;
}

export function QuestionFilters({
  subjects,
  chapters,
  categories,
  availableTags,
  filters,
  onFilterChange,
  questionCount,
  onStartQuiz,
}: QuestionFiltersProps) {
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  const filteredChapters = filters.subjectId
    ? chapters.filter(ch => ch.subject_id === filters.subjectId)
    : [];

  useEffect(() => {
    if (filters.chapterIds.length > 0) {
      fetchTagsForChapters();
    } else {
      setFilteredTags(availableTags);
    }
  }, [filters.chapterIds, availableTags]);

  const fetchTagsForChapters = async () => {
    const { data } = await supabase
      .from('questions')
      .select('tags')
      .in('chapter_id', filters.chapterIds);

    if (data) {
      const allTags = new Set<string>();
      data.forEach(q => {
        if (q.tags && Array.isArray(q.tags)) {
          q.tags.forEach(tag => allTags.add(tag));
        }
      });
      setFilteredTags(Array.from(allTags).sort());
    }
  };

  const toggleChapter = (chapterId: string) => {
    const newChapterIds = filters.chapterIds.includes(chapterId)
      ? filters.chapterIds.filter(id => id !== chapterId)
      : [...filters.chapterIds, chapterId];
    onFilterChange({ ...filters, chapterIds: newChapterIds });
  };

  const toggleCategory = (categoryId: string) => {
    const newCategoryIds = filters.categoryIds.includes(categoryId)
      ? filters.categoryIds.filter(id => id !== categoryId)
      : [...filters.categoryIds, categoryId];
    onFilterChange({ ...filters, categoryIds: newCategoryIds });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFilterChange({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    onFilterChange({
      subjectId: null,
      chapterIds: [],
      categoryIds: [],
      tags: [],
      difficulty: null,
    });
  };

  const hasActiveFilters =
    filters.subjectId ||
    filters.chapterIds.length > 0 ||
    filters.categoryIds.length > 0 ||
    filters.tags.length > 0 ||
    filters.difficulty;

  const tagsToDisplay = filters.chapterIds.length > 0 ? filteredTags : availableTags;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filter Questions</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Subject</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterChange({ ...filters, subjectId: null, chapterIds: [] })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.subjectId === null
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All Subjects
            </button>
            {subjects.map(subject => (
              <button
                key={subject.id}
                onClick={() => onFilterChange({ ...filters, subjectId: subject.id, chapterIds: [] })}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filters.subjectId === subject.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {filters.subjectId && filteredChapters.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Chapters {filters.chapterIds.length > 0 && `(${filters.chapterIds.length} selected)`}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {filteredChapters.map(chapter => (
                <button
                  key={chapter.id}
                  onClick={() => toggleChapter(chapter.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filters.chapterIds.includes(chapter.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {chapter.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Question Type {filters.categoryIds.length > 0 && `(${filters.categoryIds.length} selected)`}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filters.categoryIds.includes(category.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={category.description || ''}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Difficulty Level</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['easy', 'medium', 'hard'].map(level => (
              <button
                key={level}
                onClick={() => onFilterChange({
                  ...filters,
                  difficulty: filters.difficulty === level ? null : level
                })}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filters.difficulty === level
                    ? level === 'easy'
                      ? 'bg-green-600 text-white'
                      : level === 'medium'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {tagsToDisplay.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Key Concepts {filters.tags.length > 0 && `(${filters.tags.length} selected)`}
                {filters.chapterIds.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    (Filtered by selected chapters)
                  </span>
                )}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {tagsToDisplay.slice(0, 20).map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filters.tags.includes(tag)
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">Questions Available</p>
            <p className="text-3xl font-bold">{questionCount}</p>
          </div>
          <button
            onClick={onStartQuiz}
            disabled={questionCount === 0}
            className="px-6 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            Start Practice
          </button>
        </div>
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm opacity-90">Active filters applied</p>
          </div>
        )}
      </div>
    </div>
  );
}
