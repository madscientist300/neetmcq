# Custom Domain Setup Guide for Vercel

This guide walks you through connecting a custom domain to your NEET MCQ app deployed on Vercel, and updating all OAuth settings for a professional look.

---

## Overview

Your app is currently live at: **https://neetmcq.vercel.app/**

After following this guide, it will be accessible at your custom domain (e.g., **https://neetmcq.com**)

**Benefits:**
- ✅ Professional branding
- ✅ Better SEO
- ✅ Cleaner OAuth consent screen
- ✅ Easier to remember URL

---

## Step 1: Buy a Domain

### Recommended Registrars

| Registrar | Cost (₹/year) | Why Choose |
|-----------|---------------|------------|
| **Namecheap** | 500-800 (.com) | Easiest for beginners, great UI |
| **Hostinger** | 100-500 (.online, .site, .xyz) | Cheapest, bundled offers |
| **Porkbun** | 600-900 (.com) | Good prices, clean interface |
| **GoDaddy** | 200 first year (.com) | Popular, watch renewal prices |

### Domain Suggestions

**Best Options:**
- `neetmcq.com` - Perfect if available ⭐
- `neetquiz.com` - Alternative
- `neetpractice.com` - Descriptive
- `mcqneet.com` - Variation

**Budget Options (₹100-200/year):**
- `neetmcq.online`
- `neetmcq.site`
- `neetmcq.xyz`
- `neetmcq.tech`

### How to Check Availability

1. Go to your chosen registrar (e.g., namecheap.com, hostinger.com)
2. Use the domain search tool
3. Search for your desired name
4. Check which extensions (.com, .online, .site, etc.) are available
5. Choose and purchase

**Tips:**
- ✅ Choose `.com` if budget allows (₹500-800/year) - most credible
- ✅ `.online`, `.site`, `.xyz` are great budget alternatives (₹100-200/year)
- ❌ Avoid weird/uncommon extensions like `.xyz123` or `.club`

---

## Step 2: Connect Domain to Vercel

Once you've purchased your domain, follow these steps:

### 2.1: Add Domain in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: Click on `neetmcq`
3. **Navigate to Settings**: Settings → Domains
4. **Add Domain**: Click "Add" button
5. **Enter your domain**: Type your domain (e.g., `neetmcq.com`)
6. **Click Add**: Vercel will check if you own it

### 2.2: Update DNS Records

Vercel will show you which DNS records to add. There are **two methods**:

#### Method 1: Using A and CNAME Records (Recommended)

**In your domain registrar's DNS management** (Namecheap/Hostinger/etc.):

| Type | Name/Host | Value | TTL |
|------|-----------|-------|-----|
| **A** | `@` | `76.76.21.21` | Automatic |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic |

**Example for Namecheap:**
1. Login to Namecheap
2. Domain List → Manage → Advanced DNS
3. Add New Record → Select type "A Record"
   - Host: `@`
   - Value: `76.76.21.21`
   - TTL: Automatic
4. Add New Record → Select type "CNAME Record"
   - Host: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: Automatic
5. Save All Changes

**Example for Hostinger:**
1. Login to Hostinger hPanel
2. Domains → Manage → DNS / Name Servers → DNS Records
3. Add Record → Type: A
   - Name: `@`
   - Points to: `76.76.21.21`
   - TTL: 14400
4. Add Record → Type: CNAME
   - Name: `www`
   - Points to: `cname.vercel-dns.com`
   - TTL: 14400
5. Save

#### Method 2: Using Vercel Nameservers (Alternative)

If you want Vercel to fully manage your DNS:

1. In Vercel, when adding domain, choose "Use Vercel Nameservers"
2. Vercel will provide nameservers like:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. In your registrar, update nameservers to these values
4. Wait for propagation

### 2.3: Wait for DNS Propagation

- **Time**: Usually 15 minutes to 48 hours (typically ~30 minutes)
- **Check Status**: Vercel dashboard will show "Valid Configuration" when ready
- **SSL Certificate**: Vercel automatically provisions SSL (HTTPS) - no action needed!

### 2.4: Verify Domain is Live

1. Visit your custom domain: `https://yourdomain.com`
2. It should load your NEET MCQ app!
3. Check that HTTPS (🔒) is working

---

## Step 3: Update Supabase Configuration

Now that your domain is live, update Supabase so OAuth redirects work correctly.

### 3.1: Update Site URL

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project**: Click on your NEET MCQ project
3. **Navigate to Authentication**: Authentication → URL Configuration
4. **Update Site URL**:
   ```
   https://yourdomain.com
   ```
   Replace `yourdomain.com` with your actual domain (e.g., `https://neetmcq.com`)

### 3.2: Add Redirect URLs

In the **Redirect URLs** section, add both:
```
https://yourdomain.com/**
https://neetmcq.vercel.app/**
```

**Why keep Vercel URL?**
- Vercel provides preview deployments for testing
- Good to keep as backup

### 3.3: Save Changes

Click **Save** at the bottom of the page.

---

## Step 4: Update Google OAuth Settings

This is the **key step** to fix the unprofessional OAuth consent screen!

### 4.1: Access Google Cloud Console

1. **Go to**: https://console.cloud.google.com/
2. **Select your project** (or create one if you haven't)
3. **Enable Google+ API** (if not already enabled):
   - APIs & Services → Library
   - Search for "Google+ API"
   - Enable it

### 4.2: Update OAuth Consent Screen

1. **Navigate to**: APIs & Services → **OAuth consent screen**
2. **Update the following fields**:

   | Field | Value | Example |
   |-------|-------|---------|
   | **App name** | NEET MCQ Platform | (Users see this prominently) |
   | **User support email** | Your email | your.email@gmail.com |
   | **App logo** | Upload logo (optional) | 120x120px PNG |
   | **Application home page** | Your custom domain | https://neetmcq.com |
   | **Application privacy policy** | Your policy URL | https://neetmcq.com/privacy (optional) |
   | **Application terms of service** | Your terms URL | https://neetmcq.com/terms (optional) |
   | **Authorized domains** | Your domain | neetmcq.com |
   | **Developer contact** | Your email | your.email@gmail.com |

3. **Click Save and Continue**

### 4.3: Update OAuth 2.0 Client

1. **Navigate to**: APIs & Services → **Credentials**
2. **Find your OAuth 2.0 Client ID** (usually named "Web client")
3. **Click Edit** (pencil icon)
4. **Update Authorized JavaScript origins**:
   ```
   https://yourdomain.com
   https://neetmcq.vercel.app
   ```
   
5. **Keep Authorized redirect URIs** as:
   ```
   https://dagmrmqiqdceduyeetbt.supabase.co/auth/v1/callback
   ```
   
6. **Click Save**

### 4.4: Verify Changes

Wait 5-10 minutes for Google to propagate changes.

---

## Step 5: Test Everything

### 5.1: Test Your Custom Domain

1. Visit: `https://yourdomain.com`
2. Should load your app ✅
3. Should have HTTPS lock icon 🔒 ✅

### 5.2: Test Google OAuth

1. Go to your app's login page: `https://yourdomain.com/login`
2. Click "Continue with Google"
3. **Check the consent screen**:
   - Should show: **"NEET MCQ Platform"** in large text ✅
   - Should show: **"yourdomain.com"** instead of long Supabase URL ✅
4. Complete login - should work perfectly ✅

### 5.3: Test Student/Teacher Features

- ✅ Login as student
- ✅ Take a quiz
- ✅ Login as teacher
- ✅ Create a question
- ✅ Login as admin
- ✅ Manage teachers

Everything should work exactly as before!

---

## Common Issues & Solutions

### Issue 1: Domain Not Working After 48 Hours

**Solution:**
- Check DNS records in registrar - make sure you added them correctly
- Use DNS checker: https://dnschecker.org (enter your domain)
- Verify A record shows `76.76.21.21`
- Verify CNAME shows `cname.vercel-dns.com`

### Issue 2: OAuth Still Shows Supabase URL

**Solution:**
- Clear browser cache and cookies
- Wait 10-15 minutes for Google to update
- Double-check you saved changes in Google Cloud Console
- Verify **Authorized domains** includes your domain (without https://)

### Issue 3: SSL Certificate Error

**Solution:**
- Wait longer - Vercel can take up to 24 hours to provision SSL
- Check Vercel dashboard - should show "Certificate Issued"
- If still not working after 24h, remove and re-add domain in Vercel

### Issue 4: Redirect to Wrong URL After Login

**Solution:**
- Check Supabase Site URL is set to your custom domain (with `https://`)
- Check Supabase Redirect URLs include your domain with `/**` at the end
- Clear browser cookies and try again

### Issue 5: "www" Doesn't Work

**Solution:**
- Verify CNAME record for `www` is added in DNS
- In Vercel, you may need to add `www.yourdomain.com` separately
- Vercel usually redirects www → non-www automatically

---

## After Setup Checklist

- [ ] Domain is live at `https://yourdomain.com`
- [ ] HTTPS (SSL) is working (🔒 icon in browser)
- [ ] Supabase Site URL updated to custom domain
- [ ] Supabase Redirect URLs include custom domain
- [ ] Google OAuth Consent Screen shows app name prominently
- [ ] Google OAuth Authorized Origins include custom domain
- [ ] Login with Google works from custom domain
- [ ] All app features work (student, teacher, admin)
- [ ] Old Vercel URL still works as backup

---

## Cost Breakdown

| Item | Cost (Annual) |
|------|---------------|
| **Domain (.com)** | ₹500-800 |
| **Domain (.online/.site)** | ₹100-200 |
| **Vercel Hosting** | ₹0 (Free tier) |
| **Supabase Database** | ₹0 (Free tier) |
| **SSL Certificate** | ₹0 (Auto by Vercel) |
| **Total** | **₹100-800/year** |

**Monthly equivalent**: ₹8-67/month 🎉

---

## Next Steps (Optional)

### Add Email Forwarding
Many registrars offer free email forwarding:
- `admin@yourdomain.com` → forwards to your Gmail
- Makes you look more professional!

### Set Up Analytics
- Add Google Analytics to track visitors
- Or use Vercel Analytics (paid, but has free tier)

### Custom Subdomain for Staging
- Use `staging.yourdomain.com` for testing
- Add as another domain in Vercel
- Point to a different Git branch

---

## Support

If you run into issues:
1. Check [Vercel's documentation](https://vercel.com/docs/concepts/projects/domains)
2. Check your domain registrar's DNS help docs
3. Use [DNS Checker](https://dnschecker.org) to debug DNS issues
4. Contact Vercel support (they're very helpful!)

---

## Summary

**What You Did:**
1. ✅ Bought a custom domain (₹100-800/year)
2. ✅ Connected it to Vercel (free, automatic)
3. ✅ Updated Supabase to use your domain
4. ✅ Updated Google OAuth to show your brand
5. ✅ Professional OAuth screen - no more long Supabase URL!

**Your app is now live at** ✨ `https://yourdomain.com` ✨

Congratulations! 🎉
