# Deploying NEET MCQ to Hostinger

This guide shows you how to deploy your React app to Hostinger with automatic deployment from GitHub.

## Prerequisites

- ✅ Hostinger hosting account (any plan)
- ✅ Domain connected to Hostinger (or use temporary Hostinger domain)
- ✅ GitHub repository (already done: https://github.com/madscientist300/neetmcq)

---

## Deployment Options

### Option 1: Automatic Deployment via GitHub Actions (Recommended)

**Benefits**: 
- ✅ Automatic deployment on every push to `main`
- ✅ Secure environment variables (no hardcoding)
- ✅ Always in sync with GitHub

**Setup Time**: ~10 minutes

### Option 2: Manual Upload via File Manager

**Benefits**:
- ✅ Simple and straightforward
- ✅ No additional setup

**Drawback**: Need to upload manually every time you make changes

---

## Option 1: Automatic Deployment (Recommended)

### Step 1: Get Hostinger FTP Credentials

1. **Login to Hostinger hPanel**: https://hpanel.hostinger.com/
2. **Navigate to**: Files → **FTP Accounts**
3. **Note down these credentials**:
   - **FTP Server**: (looks like `ftp.yourdomain.com` or IP address)
   - **Username**: (your FTP username)
   - **Password**: (create new or use existing)
   - **Port**: Usually `21`

### Step 2: Add GitHub Secrets

1. **Go to your GitHub repository**: https://github.com/madscientist300/neetmcq
2. **Navigate to**: Settings → Secrets and variables → Actions
3. **Click**: "New repository secret"
4. **Add these 5 secrets** (one by one):

   | Secret Name | Value | Example |
   |-------------|-------|---------|
   | `FTP_SERVER` | Your FTP hostname | `ftp.yourdomain.com` or `123.45.67.89` |
   | `FTP_USERNAME` | Your FTP username | `u123456789` |
   | `FTP_PASSWORD` | Your FTP password | `YourFTPPassword123` |
   | `VITE_SUPABASE_URL` | Your Supabase URL | `https://dagmrmqiqdceduyeetbt.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Step 3: Add .htaccess to Your Dist Folder

The `.htaccess` file handles React Router routing. I've created it in `.github/workflows/.htaccess`.

**Move it to the public folder**:
- We'll modify the build to copy this file automatically

### Step 4: Update vite.config.ts

We need to copy `.htaccess` during build:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-htaccess',
      closeBundle() {
        try {
          copyFileSync('.github/workflows/.htaccess', 'dist/.htaccess');
          console.log('✅ .htaccess copied to dist');
        } catch (err) {
          console.warn('⚠️ Could not copy .htaccess:', err);
        }
      }
    }
  ],
  server: {
    port: 5173,
  },
});
```

### Step 5: Commit and Push

Once you push the workflow file to GitHub:

```bash
git add .
git commit -m "Add Hostinger deployment workflow"
git push origin main
```

GitHub Actions will automatically:
1. Build your app with environment variables
2. Upload to Hostinger via FTP
3. Deploy to `public_html` folder

### Step 6: Configure Your Domain

1. **In Hostinger hPanel**:
   - Go to: Domains
   - Point your domain to your hosting account
   
2. **Wait for propagation**: Usually 5-30 minutes

3. **Access your site**: `https://yourdomain.com`

---

## Option 2: Manual Deployment

### Step 1: Build Your App Locally

**Important**: You need to set environment variables before building.

**On Windows PowerShell**:
```powershell
$env:VITE_SUPABASE_URL="https://dagmrmqiqdceduyeetbt.supabase.co"
$env:VITE_SUPABASE_ANON_KEY="your-anon-key-here"
npm run build
```

**On Windows CMD**:
```cmd
set VITE_SUPABASE_URL=https://dagmrmqiqdceduyeetbt.supabase.co
set VITE_SUPABASE_ANON_KEY=your-anon-key-here
npm run build
```

### Step 2: Upload to Hostinger

**Via File Manager**:
1. Login to hPanel: https://hpanel.hostinger.com/
2. Go to: Files → File Manager
3. Navigate to `public_html`
4. Delete all existing files (if any)
5. Upload **all contents** from your local `dist` folder
6. Upload the `.htaccess` file from `.github/workflows/.htaccess` to `public_html`

**Via FTP (Faster)**:
1. Download FileZilla: https://filezilla-project.org/
2. Connect using FTP credentials from Hostinger
3. Upload `dist/*` contents to `public_html/`
4. Upload `.htaccess` to `public_html/`

### Step 3: Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. Test login functionality
3. Test Google OAuth

---

## Post-Deployment Configuration

### Update Supabase Settings

1. **Go to Supabase Dashboard** → Authentication → URL Configuration
2. **Update Site URL**: `https://yourdomain.com`
3. **Add Redirect URLs**:
   ```
   https://yourdomain.com/**
   https://neetmcq.vercel.app/**
   ```

### Update Google OAuth

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Navigate to**: APIs & Services → Credentials
3. **Edit OAuth 2.0 Client**:
   - **Authorized JavaScript origins**:
     ```
     https://yourdomain.com
     ```
   - Keep the existing Supabase redirect URI

4. **Update OAuth Consent Screen**:
   - **Application home page**: `https://yourdomain.com`
   - **Authorized domains**: Add `yourdomain.com`

---

## Troubleshooting

### Issue: Routes Don't Work (404 errors)

**Solution**: Make sure `.htaccess` is in `public_html` with correct content.

### Issue: Blank page or errors

**Solution**: Check browser console. Likely environment variables not set correctly.

### Issue: FTP deployment fails

**Solution**: 
- Verify FTP credentials are correct
- Make sure `server-dir` is `/public_html/` (with trailing slash)
- Check firewall settings

### Issue: OAuth redirect not working

**Solution**: 
- Update Supabase redirect URLs
- Update Google OAuth authorized origins
- Clear browser cache

---

## Monitoring Deployments

View deployment status:
1. Go to GitHub repository
2. Click **Actions** tab
3. See deployment logs and status

---

## Cost Breakdown

- **Hostinger Web Hosting**: ₹99-249/month
- **Domain**: ₹99-599/year (for .online, .site, .xyz)
- **Total**: ~₹150-300/month

**Free on Vercel vs Paid on Hostinger?**
- Vercel: Free tier is excellent for small apps
- Hostinger: Better if you want full control + cheap domain bundle

---

## Need Help?

Common commands:
```bash
# Build locally
npm run build

# Test production build locally
npm run preview

# Check workflow status
# Go to: https://github.com/madscientist300/neetmcq/actions
```
