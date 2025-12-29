# Email Verification Setup Guide

Email verification has been implemented to prevent spam registrations using fake emails. Users must verify their email address before they can access the platform.

## How It Works

1. **User Registration**: When a user registers with email/password, they receive a verification email
2. **Email Confirmation**: User clicks the verification link in their email
3. **Profile Creation**: Upon email confirmation, a profile is automatically created via database trigger
4. **Access Granted**: User can now login and access the platform

## Required Supabase Configuration

### Enable Email Confirmation

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers** → **Email**
3. Enable the following settings:
   - ✅ **Enable Email provider**
   - ✅ **Confirm email** (this is critical - it requires users to verify their email)

### Email Templates (Optional Customization)

You can customize the verification email template:

1. Go to **Authentication** → **Email Templates**
2. Select **Confirm signup**
3. Customize the template to match your brand

**Default template includes:**
- Verification link: `{{ .ConfirmationURL }}`
- User email: `{{ .Email }}`
- Site URL: `{{ .SiteURL }}`

### Site URL Configuration

1. Go to **Authentication** → **URL Configuration**
2. Set your **Site URL** to your production domain (e.g., `https://yourdomain.com`)
3. Add **Redirect URLs** if needed

## Testing Email Verification

### During Development

**Option 1: Use Real Email Service**
- Supabase provides email sending by default
- Test with your actual email address
- Check spam folder if email doesn't arrive

**Option 2: View Confirmation Link in Logs**
- Go to Supabase Dashboard → **Logs** → **Auth**
- Find the signup event to see the confirmation link
- Copy and visit the link manually

### In Production

- Ensure your Site URL is set correctly
- Configure custom SMTP (optional) in **Project Settings** → **Auth** → **SMTP Settings**
- Monitor email delivery in the Auth logs

## User Flow

### New Registration

```
1. User fills registration form
   ↓
2. Receives "Verify Your Email" screen
   ↓
3. Checks email inbox/spam
   ↓
4. Clicks verification link
   ↓
5. Profile auto-created via trigger
   ↓
6. Redirected to login page
   ↓
7. Can now login successfully
```

### Resend Verification

Users can resend the verification email if:
- Email didn't arrive
- Link expired (default: 24 hours)
- Email was accidentally deleted

## Security Features

✅ **Prevents spam registrations** - Only verified emails can access the platform
✅ **Automatic sign-out** - Unverified users are immediately signed out
✅ **Profile protection** - Profiles only created for verified users
✅ **No manual profile creation** - Profiles created automatically after verification
✅ **Detects duplicate emails** - Shows error if email already registered
✅ **Automatic cleanup** - Unverified users are automatically removed after 7 days (Supabase default)

### Multi-Layer Protection

The platform uses three layers of security to ensure only verified users get access:

1. **Auth Layer**: `email_confirmed_at` check in AuthContext
2. **Database Trigger**: Auto-creates profiles only after email confirmation
3. **Session Guard**: Automatically signs out users without verified emails or profiles

## Database Trigger

A database trigger automatically creates user profiles when email is confirmed:

```sql
-- Location: supabase/migrations/*_add_auto_profile_creation_trigger.sql
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();
```

This ensures:
- Profile is created only after email verification
- Full name from signup form is preserved
- Default role is set to 'student'
- No duplicate profiles are created

## Troubleshooting

### Verification Email Not Received

1. Check spam/promotions folder
2. Verify email provider settings in Supabase
3. Check Auth logs for delivery errors
4. Use "Resend Verification Email" button

### Link Expired

- Verification links expire after 24 hours by default
- User must request a new verification email
- Previous links become invalid

### Profile Not Created

1. Verify the database trigger exists and is enabled
2. Check Supabase logs for errors
3. Ensure RLS policies allow profile creation
4. Confirm user's email is verified in Auth Users table

### Unverified Users Got Access Before Fix

If users registered before the security fix was applied:

1. Run the cleanup script: `CLEANUP_UNVERIFIED_USERS.sql`
2. Review the list of unverified profiles
3. Delete unverified profiles if needed
4. All new registrations will be secure going forward

## Configuration Checklist

Before deploying to production:

- [ ] Email confirmation enabled in Auth settings
- [ ] Site URL configured correctly
- [ ] Email templates reviewed and customized
- [ ] Redirect URLs added if using custom domains
- [ ] SMTP configured (optional, for custom email sending)
- [ ] Database trigger deployed and tested
- [ ] RLS policies verified

## Additional Notes

- **Google OAuth**: Users signing up with Google don't need email verification (Google already verifies emails)
- **Email Changes**: If users change their email, they must verify the new one
- **Rate Limiting**: Supabase has built-in rate limiting for signup attempts
- **Security**: Never disable email confirmation in production
