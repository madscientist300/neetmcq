/*
  # Add Zoology, Physics, and Chemistry Chapters

  This migration adds all chapters for Zoology, creates Physics and Chemistry subjects,
  and adds their respective chapters in the correct sequence.

  ## New Data

  ### Zoology Chapters (14 chapters)
  1. Structural Organization in Animals
  2. Biomolecules
  3. Breathing and Exchange of Gases
  4. Body Fluids and Circulation
  5. Excretory Products & their Elimination
  6. Locomotion & Movement
  7. Neural Control & Coordination
  8. Chemical Coordination & Integration
  9. Animal Kingdom
  10. Human Reproduction
  11. Reproductive Health
  12. Evolution
  13. Human Health and Diseases
  14. Biotechnology: Principles & Processes

  ### Physics Subject and Chapters (20 chapters)
  Complete physics curriculum for NEET-UG

  ### Chemistry Subject and Chapters (20 chapters)
  Organized into:
  - Physical Chemistry (8 chapters)
  - Inorganic Chemistry (4 chapters)
  - Organic Chemistry (8 chapters)

  ## Notes
  - Uses conditional insert to avoid duplicates
  - Chapters are numbered with order_index for proper sequencing
  - Chemistry chapters will have tags for their sub-categories
*/

-- Insert Zoology subject if it doesn't exist (should already exist)
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

-- Add Chemistry chapters (Physical Chemistry)
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
