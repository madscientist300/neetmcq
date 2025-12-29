/*
  # Fix Cascade Delete Constraints

  This migration fixes foreign key constraints to allow proper deletion of questions.

  ## Changes
  
  1. **Question Categories Table**
     - Update foreign key to cascade delete when question is deleted
     
  2. **Student Attempts Table**
     - Update foreign key to cascade delete when question is deleted
  
  ## Why This is Needed
  
  Currently, when a teacher tries to delete a question that has:
  - Student attempts associated with it
  - Category assignments
  
  The delete fails with a foreign key constraint violation. This migration fixes
  that by adding CASCADE behavior, so when a question is deleted, all related
  records are automatically cleaned up.
  
  ## Security
  
  This maintains data integrity while allowing teachers to manage their question library.
  RLS policies still control who can delete questions (teachers only).
*/

-- Fix student_attempts foreign key constraint
ALTER TABLE student_attempts
DROP CONSTRAINT IF EXISTS student_attempts_question_id_fkey;

ALTER TABLE student_attempts
ADD CONSTRAINT student_attempts_question_id_fkey
FOREIGN KEY (question_id)
REFERENCES questions(id)
ON DELETE CASCADE;

-- Fix question_categories foreign key constraint
ALTER TABLE question_categories
DROP CONSTRAINT IF EXISTS question_categories_question_id_fkey;

ALTER TABLE question_categories
ADD CONSTRAINT question_categories_question_id_fkey
FOREIGN KEY (question_id)
REFERENCES questions(id)
ON DELETE CASCADE;

-- Also fix the category_id foreign key for completeness
ALTER TABLE question_categories
DROP CONSTRAINT IF EXISTS question_categories_category_id_fkey;

ALTER TABLE question_categories
ADD CONSTRAINT question_categories_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE CASCADE;
