/*
  # Add Chapter Ordering System

  1. Changes
    - Add `order_index` column to chapters table
    - Update Botany chapters with correct sequential order (1-17)
    - Allows chapters to be displayed in the intended sequence

  2. Notes
    - order_index defaults to 0 for new chapters
    - Botany chapters are ordered from 1 to 17 as specified
*/

-- Add order_index column to chapters table if it doesn't exist
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
    -- Update each chapter with its correct order
    UPDATE chapters SET order_index = 1 
    WHERE subject_id = botany_subject_id AND name = 'The Living World';
    
    UPDATE chapters SET order_index = 2 
    WHERE subject_id = botany_subject_id AND name = 'Biological Classification';
    
    UPDATE chapters SET order_index = 3 
    WHERE subject_id = botany_subject_id AND name = 'Plant Kingdom';
    
    UPDATE chapters SET order_index = 4 
    WHERE subject_id = botany_subject_id AND name = 'Morphology of Flowering Plants';
    
    UPDATE chapters SET order_index = 5 
    WHERE subject_id = botany_subject_id AND name = 'Anatomy of Flowering Plants';
    
    UPDATE chapters SET order_index = 6 
    WHERE subject_id = botany_subject_id AND name = 'Cell: The unit of Life';
    
    UPDATE chapters SET order_index = 7 
    WHERE subject_id = botany_subject_id AND name = 'Cell Cycle and Cell Division';
    
    UPDATE chapters SET order_index = 8 
    WHERE subject_id = botany_subject_id AND name = 'Photosynthesis in Higher Plants';
    
    UPDATE chapters SET order_index = 9 
    WHERE subject_id = botany_subject_id AND name = 'Respiration in Plants';
    
    UPDATE chapters SET order_index = 10 
    WHERE subject_id = botany_subject_id AND name = 'Plant Growth and Development';
    
    UPDATE chapters SET order_index = 11 
    WHERE subject_id = botany_subject_id AND name = 'Sexual Reproduction in Flowering Plants';
    
    UPDATE chapters SET order_index = 12 
    WHERE subject_id = botany_subject_id AND name = 'Principle of Inheritance and Variation';
    
    UPDATE chapters SET order_index = 13 
    WHERE subject_id = botany_subject_id AND name = 'Molecular Basis of Inheritance';
    
    UPDATE chapters SET order_index = 14 
    WHERE subject_id = botany_subject_id AND name = 'Microbes in Human Welfare';
    
    UPDATE chapters SET order_index = 15 
    WHERE subject_id = botany_subject_id AND name = 'Organisms and Populations';
    
    UPDATE chapters SET order_index = 16 
    WHERE subject_id = botany_subject_id AND name = 'Ecosystem';
    
    UPDATE chapters SET order_index = 17 
    WHERE subject_id = botany_subject_id AND name = 'Biodiversity and Conservation';
  END IF;
END $$;