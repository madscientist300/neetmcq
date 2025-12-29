import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Shield, UserPlus, Users, Mail, Lock, Eye, EyeOff, Trash2, BookOpen, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Teacher {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

interface TeacherStats {
  teacherId: string;
  questionCount: number;
  subjects: { name: string; count: number }[];
  chapters: { name: string; count: number }[];
}

export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherStats, setTeacherStats] = useState<Map<string, TeacherStats>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      loadTeachers();
    }
  }, [user]);

  const loadTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeachers(data || []);

      if (data) {
        await loadTeacherStats(data);
      }
    } catch (err) {
      console.error('Error loading teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTeacherStats = async (teacherList: Teacher[]) => {
    const statsMap = new Map<string, TeacherStats>();

    for (const teacher of teacherList) {
      const { data: questions } = await supabase
        .from('questions')
        .select('id, subject_id, chapter_id, subjects(name), chapters(name)')
        .eq('created_by', teacher.id);

      if (questions) {
        const subjectCounts = new Map<string, number>();
        const chapterCounts = new Map<string, number>();

        questions.forEach((q: any) => {
          if (q.subjects?.name) {
            subjectCounts.set(
              q.subjects.name,
              (subjectCounts.get(q.subjects.name) || 0) + 1
            );
          }
          if (q.chapters?.name) {
            chapterCounts.set(
              q.chapters.name,
              (chapterCounts.get(q.chapters.name) || 0) + 1
            );
          }
        });

        statsMap.set(teacher.id, {
          teacherId: teacher.id,
          questionCount: questions.length,
          subjects: Array.from(subjectCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),
          chapters: Array.from(chapterCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),
        });
      }
    }

    setTeacherStats(statsMap);
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password || !formData.full_name) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name
          }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.full_name,
            role: 'teacher'
          } as any);

        if (profileError) throw profileError;

        setSuccess(`Teacher account created successfully! Email: ${formData.email}, Password: ${formData.password}`);
        setFormData({ email: '', password: '', full_name: '' });
        setShowForm(false);
        loadTeachers();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create teacher account');
    }
  };

  const handleDeleteTeacher = async (teacherId: string, teacherEmail: string) => {
    if (!confirm(`Are you sure you want to delete teacher ${teacherEmail}?`)) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(teacherId);

      if (error) throw error;

      setSuccess('Teacher account deleted successfully');
      loadTeachers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete teacher account');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-100 dark:from-gray-900 dark:via-purple-900 dark:to-black">
      <nav className="bg-white/70 dark:bg-dark-card/30 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-dark-border/50 pt-8">
        <div className="max-w-7xl mx-auto px-0 sm:px-10 md:px-10 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  NEET-UG MCQ Platform
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
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
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-0 sm:px-10 md:px-10 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Teacher Management
              </h2>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Teacher</span>
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-6 bg-white/70 dark:bg-gray-800/30 backdrop-blur-xl rounded-lg shadow-lg border border-white/50 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create New Teacher Account
              </h3>
              <form onSubmit={handleCreateTeacher} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter teacher's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="teacher@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Minimum 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Create Teacher Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ email: '', password: '', full_name: '' });
                      setError('');
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white/70 dark:bg-gray-800/30 backdrop-blur-xl rounded-lg shadow-lg border border-white/50 dark:border-gray-700/50 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Loading teachers...
              </div>
            ) : teachers.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No teachers found. Create your first teacher account above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Questions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {teachers.map((teacher) => {
                      const stats = teacherStats.get(teacher.id);
                      const isExpanded = expandedTeacher === teacher.id;

                      return (
                        <>
                          <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {teacher.full_name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {teacher.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => setExpandedTeacher(isExpanded ? null : teacher.id)}
                                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                <BookOpen className="w-4 h-4" />
                                {stats?.questionCount || 0} questions
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(teacher.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button
                                onClick={() => handleDeleteTeacher(teacher.id, teacher.email)}
                                className="inline-flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </td>
                          </tr>
                          {isExpanded && stats && (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                      Questions by Subject
                                    </h4>
                                    {stats.subjects.length > 0 ? (
                                      <ul className="space-y-1">
                                        {stats.subjects.map((subject, idx) => (
                                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                            {subject.name}: <span className="font-medium">{subject.count}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-gray-500 dark:text-gray-400">No questions created yet</p>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                      Questions by Chapter (Top 5)
                                    </h4>
                                    {stats.chapters.length > 0 ? (
                                      <ul className="space-y-1">
                                        {stats.chapters.slice(0, 5).map((chapter, idx) => (
                                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                            {chapter.name}: <span className="font-medium">{chapter.count}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-gray-500 dark:text-gray-400">No questions created yet</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
