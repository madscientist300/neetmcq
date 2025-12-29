import { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen } from 'lucide-react';

interface Chapter {
  id: string;
  name: string;
  subject_id: string;
  subject_name?: string;
}

interface ChapterSearchProps {
  selectedChapter: Chapter | null;
  onChapterSelect: (chapter: Chapter | null) => void;
  chapters: Chapter[];
}

export function ChapterSearch({ selectedChapter, onChapterSelect, chapters }: ChapterSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = chapters.filter(chapter =>
        chapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapter.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChapters(filtered);
      setIsOpen(true);
    } else {
      setFilteredChapters([]);
      setIsOpen(false);
    }
  }, [searchTerm, chapters]);

  const handleChapterClick = (chapter: Chapter) => {
    onChapterSelect(chapter);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onChapterSelect(null);
    setSearchTerm('');
  };

  return (
    <div className="space-y-3">
      {selectedChapter && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Currently adding questions to:
                </p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-200 mt-1">
                  {selectedChapter.name}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                  {selectedChapter.subject_name}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearSelection}
              className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
              title="Change chapter"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {!selectedChapter && (
        <div ref={wrapperRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search and Select Chapter *
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim() && setIsOpen(true)}
              placeholder="Type chapter name to search (e.g., Diversity in Living, Thermodynamics)..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {isOpen && filteredChapters.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {filteredChapters.map((chapter) => (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => handleChapterClick(chapter)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {chapter.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {chapter.subject_name}
                  </div>
                </button>
              ))}
            </div>
          )}

          {isOpen && searchTerm.trim() && filteredChapters.length === 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4">
              <p className="text-gray-600 dark:text-gray-400 text-center">
                No chapters found matching "{searchTerm}"
              </p>
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Start typing to search through all chapters across all subjects
          </p>
        </div>
      )}
    </div>
  );
}
