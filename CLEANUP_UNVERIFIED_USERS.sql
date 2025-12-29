-- Cleanup Script for Unverified Users
-- Run this if you had unverified users who got access before the security fix

-- STEP 1: Check for profiles of unverified users
-- This query shows you which profiles belong to unverified users
SELECT
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.created_at,
    au.email_confirmed_at,
    CASE
        WHEN au.email_confirmed_at IS NULL THEN 'UNVERIFIED'
        ELSE 'VERIFIED'
    END as status
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE au.email_confirmed_at IS NULL
ORDER BY p.created_at DESC;

-- STEP 2: Delete profiles for unverified users (CAREFUL - THIS DELETES DATA!)
-- Uncomment the following line only after reviewing the results from STEP 1
-- DELETE FROM profiles
-- WHERE id IN (
--     SELECT p.id
--     FROM profiles p
--     LEFT JOIN auth.users au ON p.id = au.id
--     WHERE au.email_confirmed_at IS NULL
-- );

-- STEP 3: Verify cleanup
-- Run this to confirm all remaining profiles are for verified users only
SELECT
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN au.email_confirmed_at IS NOT NULL THEN 1 END) as verified_profiles,
    COUNT(CASE WHEN au.email_confirmed_at IS NULL THEN 1 END) as unverified_profiles
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id;
