# Admin & Google Sign-In Setup Guide

## Overview
Your NEET-UG MCQ Platform now includes:
- Admin Dashboard for managing teachers
- Google Sign-In authentication
- Restricted teacher registration (only via admin)

## 1. Setting Up Google OAuth in Supabase

To enable Google Sign-In, follow these steps:

### Step 1: Configure Google OAuth Provider

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list of providers
5. Toggle it to **Enabled**

### Step 2: Set Up Google OAuth Credentials

You'll need to create OAuth credentials in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the consent screen if prompted
6. For Application type, select **Web application**
7. Add authorized redirect URIs:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Replace `<your-project-ref>` with your actual Supabase project reference

8. Copy the **Client ID** and **Client Secret**
9. Go back to Supabase Dashboard → **Authentication** → **Providers** → **Google**
10. Paste the Client ID and Client Secret
11. Click **Save**

## 2. Creating Your First Admin User

The admin role must be assigned manually via SQL:

### Option A: Using Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the following query (replace with your actual email):

```sql
-- First, register as a student through the normal registration flow
-- Then, update your role to admin:

UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

### Option B: Using the Database Table Editor

1. Register a new account through the normal registration flow
2. Go to Supabase Dashboard → **Table Editor**
3. Select the **profiles** table
4. Find your user record
5. Edit the **role** column and change it to `admin`
6. Save the changes

## 3. Using the Admin Dashboard

Once you have admin access:

1. **Sign in** with your admin account
2. You'll automatically be redirected to the **Admin Dashboard**
3. The dashboard shows all registered teachers

### Creating Teacher Accounts

1. Click the **Add Teacher** button
2. Fill in the required information:
   - Full Name
   - Email
   - Password (minimum 6 characters)
3. Click **Create Teacher Account**
4. The system will display the credentials - make sure to save them!
5. Provide these credentials to the teacher

### Managing Teachers

- View all teachers in a table with their details
- Delete teacher accounts if needed (with confirmation)
- Teachers will automatically be redirected to the Teacher Dashboard when they log in

## 4. User Registration Changes

### For Students
- Students can register freely through the normal registration page
- The teacher option has been removed from public registration
- Students can also register/sign in using Google

### For Teachers
- Teachers can ONLY be created by admins through the Admin Dashboard
- Teachers cannot self-register through the public registration page
- This prevents spam and unauthorized teacher accounts

### For Admins
- Admins must be created manually via SQL (see Section 2)
- Admins have full access to create and manage teacher accounts
- Admins can sign in using email/password or Google

## 5. Authentication Options

All users can now authenticate using:
- **Email/Password**: Traditional authentication
- **Google Sign-In**: One-click authentication with Google account

Google Sign-In users will automatically have a profile created with:
- Role: student (by default)
- Full Name: Derived from Google account
- Email: From Google account

## 6. Security Notes

- Admin role can only be assigned via direct database access
- Teacher accounts can only be created by admins
- Students can self-register but only with the 'student' role
- All authentication methods are secured by Supabase's built-in security
- Row Level Security (RLS) policies protect all data access

## 7. Troubleshooting

### Google Sign-In Not Working
- Verify OAuth credentials are correctly configured in Supabase
- Check that redirect URIs match exactly
- Ensure the Google Provider is enabled in Supabase

### Can't Access Admin Dashboard
- Verify your role is set to 'admin' in the profiles table
- Clear browser cache and try logging in again
- Check browser console for any errors

### Teacher Creation Fails
- Ensure you're logged in as an admin
- Check that the email isn't already registered
- Verify password meets minimum requirements (6 characters)

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase configuration
3. Ensure all migrations have been applied successfully
4. Check that Row Level Security policies are active
