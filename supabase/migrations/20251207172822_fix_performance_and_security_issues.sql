/*
  # Fix Database Performance and Security Issues

  ## 1. Add Missing Foreign Key Indexes
  Creates covering indexes for all foreign keys to improve query performance:
    - chapters.subject_id
    - question_categories.category_id and question_id
    - questions.created_by and subject_id
    - student_attempts.question_id and student_id

  ## 2. Optimize RLS Policies
  Fixes all RLS policies to use `(select auth.uid())` pattern instead of `auth.uid()`
  This prevents re-evaluation for each row and significantly improves performance at scale

  ## 3. Remove Unused Indexes
  Removes indexes that are not being used by queries:
    - idx_questions_tags
    - idx_questions_difficulty
    - idx_questions_chapter

  ## 4. Consolidate Multiple Permissive Policies
  Merges multiple SELECT policies on student_attempts into a single efficient policy

  ## 5. Security Notes
  - All foreign key relationships now have proper indexes for optimal joins
  - RLS policies optimized for large-scale performance
  - Password protection should be enabled in Supabase Auth settings (UI only)
*/

-- ============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

-- Index for chapters.subject_id
CREATE INDEX IF NOT EXISTS idx_chapters_subject_id ON chapters(subject_id);

-- Indexes for question_categories foreign keys
CREATE INDEX IF NOT EXISTS idx_question_categories_category_id ON question_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_question_categories_question_id ON question_categories(question_id);

-- Indexes for questions foreign keys
CREATE INDEX IF NOT EXISTS idx_questions_created_by ON questions(created_by);
CREATE INDEX IF NOT EXISTS idx_questions_subject_id ON questions(subject_id);

-- Indexes for student_attempts foreign keys
CREATE INDEX IF NOT EXISTS idx_student_attempts_question_id ON student_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_student_attempts_student_id ON student_attempts(student_id);

-- ============================================================================
-- 2. REMOVE UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS idx_questions_tags;
DROP INDEX IF EXISTS idx_questions_difficulty;
DROP INDEX IF EXISTS idx_questions_chapter;

-- ============================================================================
-- 3. OPTIMIZE RLS POLICIES - DROP OLD POLICIES
-- ============================================================================

-- Drop all existing policies that need optimization
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

DROP POLICY IF EXISTS "Teachers can insert subjects" ON subjects;
DROP POLICY IF EXISTS "Teachers can update subjects" ON subjects;
DROP POLICY IF EXISTS "Teachers can delete subjects" ON subjects;

DROP POLICY IF EXISTS "Teachers can insert chapters" ON chapters;
DROP POLICY IF EXISTS "Teachers can update chapters" ON chapters;
DROP POLICY IF EXISTS "Teachers can delete chapters" ON chapters;

DROP POLICY IF EXISTS "Teachers can insert categories" ON categories;
DROP POLICY IF EXISTS "Teachers can update categories" ON categories;
DROP POLICY IF EXISTS "Teachers can delete categories" ON categories;

DROP POLICY IF EXISTS "Teachers can insert question categories" ON question_categories;
DROP POLICY IF EXISTS "Teachers can delete question categories" ON question_categories;

DROP POLICY IF EXISTS "Teachers can insert questions" ON questions;
DROP POLICY IF EXISTS "Teachers can update questions" ON questions;
DROP POLICY IF EXISTS "Teachers can delete questions" ON questions;

DROP POLICY IF EXISTS "Students can read own attempts" ON student_attempts;
DROP POLICY IF EXISTS "Teachers can read all attempts" ON student_attempts;
DROP POLICY IF EXISTS "Students can insert own attempts" ON student_attempts;

-- ============================================================================
-- 4. CREATE OPTIMIZED RLS POLICIES
-- ============================================================================

-- Profiles table policies
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Subjects table policies
CREATE POLICY "Teachers can insert subjects"
  ON subjects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update subjects"
  ON subjects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can delete subjects"
  ON subjects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

-- Chapters table policies
CREATE POLICY "Teachers can insert chapters"
  ON chapters FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update chapters"
  ON chapters FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can delete chapters"
  ON chapters FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

-- Categories table policies
CREATE POLICY "Teachers can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

-- Question categories table policies
CREATE POLICY "Teachers can insert question categories"
  ON question_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can delete question categories"
  ON question_categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

-- Questions table policies
CREATE POLICY "Teachers can insert questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update questions"
  ON questions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can delete questions"
  ON questions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

-- Student attempts table policies (consolidated into single SELECT policy)
CREATE POLICY "Authenticated users can read relevant attempts"
  ON student_attempts FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = student_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid())
      AND role = 'teacher'
    )
  );

CREATE POLICY "Students can insert own attempts"
  ON student_attempts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = student_id);

-- ============================================================================
-- 5. ADD COMPOSITE INDEXES FOR COMMON QUERIES
-- ============================================================================

-- Common query: Get student attempts with question details
CREATE INDEX IF NOT EXISTS idx_student_attempts_student_question 
  ON student_attempts(student_id, question_id);

-- Common query: Get questions by subject and filters
CREATE INDEX IF NOT EXISTS idx_questions_subject_created 
  ON questions(subject_id, created_at DESC);

-- Common query: Get chapters by subject ordered
CREATE INDEX IF NOT EXISTS idx_chapters_subject_order 
  ON chapters(subject_id, order_index);