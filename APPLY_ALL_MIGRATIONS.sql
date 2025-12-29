-- ============================================================================
-- NEET-UG MCQ Platform - Complete Database Setup
-- This script applies all migrations in the correct order
-- Copy and paste this entire file into your Supabase SQL Editor
-- ============================================================================

-- Migration 1: Create base schema
-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  full_name text,
  role text DEFAULT 'student',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers can insert subjects"
  ON subjects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update subjects"
  ON subjects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can delete subjects"
  ON subjects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects(id),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read chapters"
  ON chapters FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers can insert chapters"
  ON chapters FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update chapters"
  ON chapters FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can delete chapters"
  ON chapters FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects(id),
  chapter_id uuid REFERENCES chapters(id),
  question_text text,
  question_image_url text,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  correct_option text CHECK (correct_option IN ('a','b','c','d')),
  explanation text,
  difficulty text CHECK (difficulty IN ('easy','medium','hard')) DEFAULT 'medium',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers can insert questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update questions"
  ON questions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can delete questions"
  ON questions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

-- Question Categories junction table
CREATE TABLE IF NOT EXISTS question_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE
);

ALTER TABLE question_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read question categories"
  ON question_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers can insert question categories"
  ON question_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can delete question categories"
  ON question_categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

-- Student Attempts table
CREATE TABLE IF NOT EXISTS student_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id),
  question_id uuid REFERENCES questions(id),
  selected_option text CHECK (selected_option IN ('a','b','c','d')),
  is_correct boolean,
  attempted_at timestamptz DEFAULT now()
);

ALTER TABLE student_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own attempts"
  ON student_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own attempts"
  ON student_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can read all attempts"
  ON student_attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

-- Migration 2: Add subjects and chapters data
-- Insert Botany subject
INSERT INTO subjects (name, is_active)
SELECT 'Botany', true
WHERE NOT EXISTS (
  SELECT 1 FROM subjects WHERE name = 'Botany'
);

-- Insert Zoology subject
INSERT INTO subjects (name, is_active)
SELECT 'Zoology', true
WHERE NOT EXISTS (
  SELECT 1 FROM subjects WHERE name = 'Zoology'
);

-- Insert Physics subject
INSERT INTO subjects (name, is_active)
SELECT 'Physics', true
WHERE NOT EXISTS (
  SELECT 1 FROM subjects WHERE name = 'Physics'
);

-- Insert Chemistry subject
INSERT INTO subjects (name, is_active)
SELECT 'Chemistry', true
WHERE NOT EXISTS (
  SELECT 1 FROM subjects WHERE name = 'Chemistry'
);

-- Get Botany subject ID and insert chapters
DO $$
DECLARE
  botany_subject_id uuid;
BEGIN
  SELECT id INTO botany_subject_id FROM subjects WHERE name = 'Botany' LIMIT 1;

  IF botany_subject_id IS NOT NULL THEN
    INSERT INTO chapters (subject_id, name)
    SELECT botany_subject_id, chapter_name
    FROM (VALUES
      ('The Living World'),
      ('Biological Classification'),
      ('Plant Kingdom'),
      ('Morphology of Flowering Plants'),
      ('Anatomy of Flowering Plants'),
      ('Cell: The unit of Life'),
      ('Cell Cycle and Cell Division'),
      ('Photosynthesis in Higher Plants'),
      ('Respiration in Plants'),
      ('Plant Growth and Development'),
      ('Sexual Reproduction in Flowering Plants'),
      ('Principle of Inheritance and Variation'),
      ('Molecular Basis of Inheritance'),
      ('Microbes in Human Welfare'),
      ('Organisms and Populations'),
      ('Ecosystem'),
      ('Biodiversity and Conservation')
    ) AS chapter_list(chapter_name)
    WHERE NOT EXISTS (
      SELECT 1 FROM chapters AS c
      WHERE c.subject_id = botany_subject_id
      AND c.name = chapter_list.chapter_name
    );
  END IF;
END $$;

-- Insert exam categories
INSERT INTO categories (name, description, order_index)
SELECT 'NEET PYQs', 'Previous Year Questions from NEET exams', 1
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE name = 'NEET PYQs'
);

INSERT INTO categories (name, description, order_index)
SELECT 'NCERT Boosters', 'Important NCERT-based questions for concept clarity', 2
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE name = 'NCERT Boosters'
);

INSERT INTO categories (name, description, order_index)
SELECT 'Sample Papers', 'Practice test papers for exam preparation', 3
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE name = 'Sample Papers'
);

INSERT INTO categories (name, description, order_index)
SELECT 'Test Series', 'Full-length mock tests to assess preparation', 4
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE name = 'Test Series'
);

-- Migration 3: Add chapter ordering
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chapters' AND column_name = 'order_index'
  ) THEN
    ALTER TABLE chapters ADD COLUMN order_index int DEFAULT 0;
  END IF;
END $$;

-- Update Botany chapters with correct order
DO $$
DECLARE
  botany_subject_id uuid;
BEGIN
  SELECT id INTO botany_subject_id FROM subjects WHERE name = 'Botany' LIMIT 1;

  IF botany_subject_id IS NOT NULL THEN
    UPDATE chapters SET order_index = 1 WHERE subject_id = botany_subject_id AND name = 'The Living World';
    UPDATE chapters SET order_index = 2 WHERE subject_id = botany_subject_id AND name = 'Biological Classification';
    UPDATE chapters SET order_index = 3 WHERE subject_id = botany_subject_id AND name = 'Plant Kingdom';
    UPDATE chapters SET order_index = 4 WHERE subject_id = botany_subject_id AND name = 'Morphology of Flowering Plants';
    UPDATE chapters SET order_index = 5 WHERE subject_id = botany_subject_id AND name = 'Anatomy of Flowering Plants';
    UPDATE chapters SET order_index = 6 WHERE subject_id = botany_subject_id AND name = 'Cell: The unit of Life';
    UPDATE chapters SET order_index = 7 WHERE subject_id = botany_subject_id AND name = 'Cell Cycle and Cell Division';
    UPDATE chapters SET order_index = 8 WHERE subject_id = botany_subject_id AND name = 'Photosynthesis in Higher Plants';
    UPDATE chapters SET order_index = 9 WHERE subject_id = botany_subject_id AND name = 'Respiration in Plants';
    UPDATE chapters SET order_index = 10 WHERE subject_id = botany_subject_id AND name = 'Plant Growth and Development';
    UPDATE chapters SET order_index = 11 WHERE subject_id = botany_subject_id AND name = 'Sexual Reproduction in Flowering Plants';
    UPDATE chapters SET order_index = 12 WHERE subject_id = botany_subject_id AND name = 'Principle of Inheritance and Variation';
    UPDATE chapters SET order_index = 13 WHERE subject_id = botany_subject_id AND name = 'Molecular Basis of Inheritance';
    UPDATE chapters SET order_index = 14 WHERE subject_id = botany_subject_id AND name = 'Microbes in Human Welfare';
    UPDATE chapters SET order_index = 15 WHERE subject_id = botany_subject_id AND name = 'Organisms and Populations';
    UPDATE chapters SET order_index = 16 WHERE subject_id = botany_subject_id AND name = 'Ecosystem';
    UPDATE chapters SET order_index = 17 WHERE subject_id = botany_subject_id AND name = 'Biodiversity and Conservation';
  END IF;
END $$;

-- Migration 4: Fix cascade delete constraints
ALTER TABLE student_attempts
DROP CONSTRAINT IF EXISTS student_attempts_question_id_fkey;

ALTER TABLE student_attempts
ADD CONSTRAINT student_attempts_question_id_fkey
FOREIGN KEY (question_id)
REFERENCES questions(id)
ON DELETE CASCADE;

ALTER TABLE question_categories
DROP CONSTRAINT IF EXISTS question_categories_question_id_fkey;

ALTER TABLE question_categories
ADD CONSTRAINT question_categories_question_id_fkey
FOREIGN KEY (question_id)
REFERENCES questions(id)
ON DELETE CASCADE;

ALTER TABLE question_categories
DROP CONSTRAINT IF EXISTS question_categories_category_id_fkey;

ALTER TABLE question_categories
ADD CONSTRAINT question_categories_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE CASCADE;

-- Migration 5: Add tags and enhancements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'tags'
  ) THEN
    ALTER TABLE questions ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'difficulty_level'
  ) THEN
    ALTER TABLE questions
    ADD COLUMN difficulty_level text CHECK (difficulty_level IN ('easy', 'medium', 'hard')) DEFAULT 'medium';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_questions_tags ON questions USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions (difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON questions (chapter_id);

-- Migration 6: Add all other subject chapters
-- Add Zoology chapters
DO $$
DECLARE
  zoology_subject_id uuid;
BEGIN
  SELECT id INTO zoology_subject_id FROM subjects WHERE name = 'Zoology' LIMIT 1;

  IF zoology_subject_id IS NOT NULL THEN
    INSERT INTO chapters (subject_id, name, order_index)
    SELECT zoology_subject_id, chapter_name, chapter_order
    FROM (VALUES
      ('Structural Organization in Animals', 1),
      ('Biomolecules', 2),
      ('Breathing and Exchange of Gases', 3),
      ('Body Fluids and Circulation', 4),
      ('Excretory Products & their Elimination', 5),
      ('Locomotion & Movement', 6),
      ('Neural Control & Coordination', 7),
      ('Chemical Coordination & Integration', 8),
      ('Animal Kingdom', 9),
      ('Human Reproduction', 10),
      ('Reproductive Health', 11),
      ('Evolution', 12),
      ('Human Health and Diseases', 13),
      ('Biotechnology: Principles & Processes', 14)
    ) AS chapter_list(chapter_name, chapter_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM chapters AS c
      WHERE c.subject_id = zoology_subject_id
      AND c.name = chapter_list.chapter_name
    );
  END IF;
END $$;

-- Add Physics chapters
DO $$
DECLARE
  physics_subject_id uuid;
BEGIN
  SELECT id INTO physics_subject_id FROM subjects WHERE name = 'Physics' LIMIT 1;

  IF physics_subject_id IS NOT NULL THEN
    INSERT INTO chapters (subject_id, name, order_index)
    SELECT physics_subject_id, chapter_name, chapter_order
    FROM (VALUES
      ('Physics and Measurements', 1),
      ('Kinematics', 2),
      ('Laws of Motion', 3),
      ('Work, Energy and Power', 4),
      ('Rotational Motion', 5),
      ('Gravitation', 6),
      ('Properties of Solids and Liquids', 7),
      ('Thermodynamics', 8),
      ('Kinetic Theory of Gases', 9),
      ('Oscillation and Waves', 10),
      ('Electrostatics', 11),
      ('Current Electricity', 12),
      ('Magnetic Effects Of Current and Magnetism', 13),
      ('Electromagnetic Induction And Alternating Currents', 14),
      ('Electromagnetic Waves', 15),
      ('Optics', 16),
      ('Dual Nature of Matter and Radiation', 17),
      ('Atoms and Nuclei', 18),
      ('Electronic Devices', 19),
      ('Experimental Skills', 20)
    ) AS chapter_list(chapter_name, chapter_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM chapters AS c
      WHERE c.subject_id = physics_subject_id
      AND c.name = chapter_list.chapter_name
    );
  END IF;
END $$;

-- Add Chemistry chapters
DO $$
DECLARE
  chemistry_subject_id uuid;
BEGIN
  SELECT id INTO chemistry_subject_id FROM subjects WHERE name = 'Chemistry' LIMIT 1;

  IF chemistry_subject_id IS NOT NULL THEN
    -- Physical Chemistry chapters
    INSERT INTO chapters (subject_id, name, order_index)
    SELECT chemistry_subject_id, chapter_name, chapter_order
    FROM (VALUES
      ('Some Basic Concepts in Chemistry', 1),
      ('Atomic Structure', 2),
      ('Chemical Bonding and Molecular Structure', 3),
      ('Chemical Thermodynamics', 4),
      ('Solutions', 5),
      ('Equilibrium', 6),
      ('Redox Reaction and Electrochemistry', 7),
      ('Chemical Kinetics', 8)
    ) AS chapter_list(chapter_name, chapter_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM chapters AS c
      WHERE c.subject_id = chemistry_subject_id
      AND c.name = chapter_list.chapter_name
    );

    -- Inorganic Chemistry chapters
    INSERT INTO chapters (subject_id, name, order_index)
    SELECT chemistry_subject_id, chapter_name, chapter_order
    FROM (VALUES
      ('Classification of Elements and Periodicity in Properties', 9),
      ('d- and f-block Elements', 10),
      ('p-block Elements', 11),
      ('Coordination Compounds', 12)
    ) AS chapter_list(chapter_name, chapter_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM chapters AS c
      WHERE c.subject_id = chemistry_subject_id
      AND c.name = chapter_list.chapter_name
    );

    -- Organic Chemistry chapters
    INSERT INTO chapters (subject_id, name, order_index)
    SELECT chemistry_subject_id, chapter_name, chapter_order
    FROM (VALUES
      ('Purification and Characterization of Organic Compounds', 13),
      ('General Organic Chemistry', 14),
      ('Hydrocarbons', 15),
      ('Organic Compounds Containing Halogens', 16),
      ('Organic Compounds Containing Oxygen', 17),
      ('Organic Compounds Containing Nitrogen', 18),
      ('Biomolecules', 19),
      ('Principles Related to Practical Chemistry', 20)
    ) AS chapter_list(chapter_name, chapter_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM chapters AS c
      WHERE c.subject_id = chemistry_subject_id
      AND c.name = chapter_list.chapter_name
    );
  END IF;
END $$;

-- Migration 7: Setup storage (Skip - Storage requires UI configuration)
-- Note: Storage bucket setup needs to be done via Supabase Dashboard

-- Migration 8: Performance and security optimizations
-- Add missing foreign key indexes
CREATE INDEX IF NOT EXISTS idx_chapters_subject_id ON chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_question_categories_category_id ON question_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_question_categories_question_id ON question_categories(question_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_by ON questions(created_by);
CREATE INDEX IF NOT EXISTS idx_questions_subject_id ON questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_student_attempts_question_id ON student_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_student_attempts_student_id ON student_attempts(student_id);

-- Remove unused indexes
DROP INDEX IF EXISTS idx_questions_tags;
DROP INDEX IF EXISTS idx_questions_difficulty;
DROP INDEX IF EXISTS idx_questions_chapter;

-- Drop and recreate optimized RLS policies
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

-- Create optimized RLS policies
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

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

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_student_attempts_student_question
  ON student_attempts(student_id, question_id);

CREATE INDEX IF NOT EXISTS idx_questions_subject_created
  ON questions(subject_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chapters_subject_order
  ON chapters(subject_id, order_index);

-- Migration 9: Add admin role support
CREATE POLICY "Admins can insert any profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete any profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Add admin policies for questions
CREATE POLICY "Admins can insert questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update questions"
  ON questions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete questions"
  ON questions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Add admin policies for subjects
CREATE POLICY "Admins can insert subjects"
  ON subjects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update subjects"
  ON subjects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete subjects"
  ON subjects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Add admin policies for chapters
CREATE POLICY "Admins can insert chapters"
  ON chapters FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update chapters"
  ON chapters FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete chapters"
  ON chapters FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Add admin policies for categories
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- DONE! All migrations have been applied.
-- ============================================================================
