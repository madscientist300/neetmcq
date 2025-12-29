/*
  # Add Tags and Key Concepts to Questions

  This migration enhances the questions table to support dynamic tagging and filtering.

  ## Changes
  
  1. **Questions Table Updates**
     - Add `tags` field (text array) for key concepts and important points
     - Add `difficulty_level` field (easy, medium, hard) for difficulty-based filtering
     - Add index on tags for faster filtering
  
  ## Why This is Needed
  
  Students need flexible ways to practice:
  - Filter by chapters (already exists via chapter_id)
  - Filter by key concepts/tags (NEW)
  - Filter by difficulty level (NEW)
  - Combine multiple filters for targeted practice
  
  ## Examples of Tags
  
  Tags will be generated from question content and can include:
  - "mitosis", "meiosis", "cell division" for cell biology questions
  - "photosynthesis", "respiration", "metabolism" for plant physiology
  - "genetics", "inheritance", "DNA" for molecular biology
  - Year-based tags like "NEET 2023", "NEET 2022" for PYQs
  
  ## Security
  
  No RLS changes needed - inherits existing security from questions table
*/

-- Add tags column to questions table (array of text)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'tags'
  ) THEN
    ALTER TABLE questions ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
END $$;

-- Add difficulty_level column to questions table
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

-- Create index on tags for faster filtering using GIN (Generalized Inverted Index)
CREATE INDEX IF NOT EXISTS idx_questions_tags ON questions USING GIN (tags);

-- Create index on difficulty_level for faster filtering
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions (difficulty_level);

-- Create index on chapter_id for faster chapter-based filtering
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON questions (chapter_id);
