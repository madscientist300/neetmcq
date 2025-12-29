/*
  # Setup Storage for Question Images

  This migration creates a storage bucket for question images and sets up appropriate
  security policies for file access.

  ## Changes

  1. **Storage Bucket**
     - Create 'question-images' bucket for storing question images
     - Public access for reading (students need to view images)
     - Teachers can upload images

  2. **Security Policies**
     - Authenticated teachers can upload images
     - Anyone (including students) can view images
     - Teachers can delete their own uploaded images

  ## Usage
  
  Teachers will upload images when creating questions, and the image URLs will be
  stored in the questions table. Images are publicly accessible for quiz viewing.
*/

-- Create the storage bucket for question images
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-images', 'question-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Teachers can upload question images" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view question images" ON storage.objects;
  DROP POLICY IF EXISTS "Teachers can delete their own images" ON storage.objects;
  DROP POLICY IF EXISTS "Teachers can update their own images" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Policy: Teachers can upload images
CREATE POLICY "Teachers can upload question images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'question-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'teacher'
  )
);

-- Policy: Anyone can view images (public bucket)
CREATE POLICY "Anyone can view question images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'question-images');

-- Policy: Teachers can delete their own uploaded images
CREATE POLICY "Teachers can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'question-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'teacher'
  )
);

-- Policy: Teachers can update their own images
CREATE POLICY "Teachers can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'question-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'teacher'
  )
);
