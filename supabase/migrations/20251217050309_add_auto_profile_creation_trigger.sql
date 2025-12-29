/*
  # Auto Profile Creation Trigger
  
  1. Purpose
    - Automatically create user profiles when email is verified
    - Prevents spam registrations by ensuring only verified users get profiles
    - Uses user metadata (full_name) from signup
  
  2. Changes
    - Creates trigger function to auto-create profile on user confirmation
    - Extracts full_name from auth.users raw_user_meta_data
    - Sets default role as 'student'
    - Idempotent: only creates profile if it doesn't exist
  
  3. Security
    - Trigger runs in security definer mode (as database owner)
    - Only creates profiles for verified users
    - Uses Supabase auth.users table as source of truth
*/

-- Create function to automatically create profile when user confirms email
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only create profile if user has confirmed their email
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    -- Check if profile already exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
      INSERT INTO public.profiles (id, email, full_name, role)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        'student'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;

-- Create trigger that fires when user confirms email
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- Add comment
COMMENT ON FUNCTION public.handle_new_user_profile IS 'Automatically creates user profile when email is confirmed to prevent spam registrations';
