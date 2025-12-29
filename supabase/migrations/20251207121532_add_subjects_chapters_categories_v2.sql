/*
  # Add Subjects, Chapters, and Categories

  1. New Data
    - Subjects:
      - Botany
      - Zoology
    
    - Chapters for Botany (17 chapters):
      - The Living World
      - Biological Classification
      - Plant Kingdom
      - Morphology of Flowering Plants
      - Anatomy of Flowering Plants
      - Cell: The unit of Life
      - Cell Cycle and Cell Division
      - Photosynthesis in Higher Plants
      - Respiration in Plants
      - Plant Growth and Development
      - Sexual Reproduction in Flowering Plants
      - Principle of Inheritance and Variation
      - Molecular Basis of Inheritance
      - Microbes in Human Welfare
      - Organisms and Populations
      - Ecosystem
      - Biodiversity and Conservation
    
    - Categories (4 exam categories):
      - NEET PYQs (Previous Year Questions)
      - NCERT Boosters (Important NCERT-based questions)
      - Sample Papers (Practice test papers)
      - Test Series (Full-length mock tests)

  2. Notes
    - Uses conditional insert to avoid duplicates
    - Categories have order_index for proper display ordering
*/

-- Insert Botany subject if it doesn't exist
INSERT INTO subjects (name, is_active)
SELECT 'Botany', true
WHERE NOT EXISTS (
  SELECT 1 FROM subjects WHERE name = 'Botany'
);

-- Insert Zoology subject if it doesn't exist
INSERT INTO subjects (name, is_active)
SELECT 'Zoology', true
WHERE NOT EXISTS (
  SELECT 1 FROM subjects WHERE name = 'Zoology'
);

-- Get Botany subject ID and insert chapters
DO $$
DECLARE
  botany_subject_id uuid;
BEGIN
  SELECT id INTO botany_subject_id FROM subjects WHERE name = 'Botany' LIMIT 1;
  
  IF botany_subject_id IS NOT NULL THEN
    -- Insert chapters for Botany
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