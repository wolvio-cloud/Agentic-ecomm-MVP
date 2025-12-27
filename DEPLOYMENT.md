# SnapSell MVP - Deployment Checklist

> **Status:** Ready for Production Deployment
> **Build:** ✅ Passing
> **Branch:** `claude/snapsell-mvp-build-4eFq9`

---

## 📋 Pre-Deployment Checklist

### 1. Database Setup (Supabase)

- [ ] **Create Supabase Project**
  - Go to [supabase.com](https://supabase.com)
  - Create new project
  - Note down Project URL and Anon Key

- [ ] **Run Migrations**
  ```sql
  -- In Supabase SQL Editor, run in order:
  \i supabase/migrations/001_initial_schema.sql
  \i supabase/migrations/002_location_and_trust.sql
  ```

- [ ] **Enable PostGIS Extension**
  ```sql
  -- In Supabase SQL Editor:
  CREATE EXTENSION IF NOT EXISTS "postgis";
  ```

- [ ] **Configure Storage**
  - Create storage bucket named `products`
  - Set public access for read operations
  - Enable RLS policies from migration

- [ ] **Seed Demo Data (Optional)**
  ```sql
  -- In Supabase SQL Editor:
  \i supabase/seed.sql
  ```

### 2. Environment Variables

Create `.env.local` file in project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Anthropic API (Claude Vision)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Optional: Reverse Geocoding
# (BigDataCloud is used by default - no key needed)
```

**Where to find:**
- Supabase URL/Key: Project Settings → API
- Anthropic Key: console.anthropic.com → API Keys

### 3. Local Testing

- [ ] **Install Dependencies**
  ```bash
  npm install
  ```

- [ ] **Run Development Server**
  ```bash
  npm run dev
  ```
  - Visit http://localhost:3000
  - Verify homepage loads

- [ ] **Run Test Suite**
  - Navigate to http://localhost:3000/test
  - Click "Run All Tests"
  - Verify all tests pass (16/16)
  - Download test report

- [ ] **Test Core Flows**
  - [ ] Sell flow: Camera → AI Analysis → Confirm → Success
  - [ ] Feed: Browse items, location modes (Nearby/National/Global)
  - [ ] Contact: WhatsApp, SMS, Copy Phone
  - [ ] My Items: View live/sold/expired, renew, delete
  - [ ] Auth: Phone OTP login

### 4. Build Verification

- [ ] **Production Build**
  ```bash
  npm run build
  ```
  - Should complete without errors
  - Warnings about metadata viewport are non-critical

- [ ] **Start Production Server**
  ```bash
  npm start
  ```
  - Visit http://localhost:3000
  - Verify production build works

---

## 🚀 Deploy to Vercel

### Option A: Git Integration (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import from GitHub/GitLab
   - Select `Agentic-ecomm-MVP` repository
   - Select branch: `claude/snapsell-mvp-build-4eFq9`

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Node Version: 18.x
   ```

3. **Add Environment Variables**
   - In Vercel project settings
   - Add all variables from `.env.local`
   - Make sure to mark as "Production" environment

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Copy deployment URL

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow prompts to:
# - Link to project (or create new)
# - Set environment variables
# - Deploy
```

---

## ✅ Post-Deployment Verification

### 1. Smoke Tests

Visit your deployment URL and test:

- [ ] **Homepage** (`/`)
  - Loads correctly
  - "Start Selling" and "Browse Items" buttons work

- [ ] **Feed** (`/feed`)
  - Products display
  - Location bar shows city
  - Feed mode tabs (Nearby/National/Global) switch correctly
  - Infinite scroll loads more products

- [ ] **Sell Flow** (`/sell`)
  - Camera opens (or file picker on desktop)
  - Can capture/upload photo
  - AI analysis returns suggestions
  - Can set price and publish

- [ ] **Authentication** (`/auth`)
  - Phone number input validates
  - OTP sent (check Supabase auth logs)
  - Login succeeds

- [ ] **My Items** (`/my-items`)
  - Shows user's products
  - Can mark as sold
  - Can renew expired listings
  - Can delete items

- [ ] **Test Page** (`/test`)
  - All tests pass
  - Download report works

### 2. Database Verification

In Supabase Dashboard:

- [ ] Check `users` table has entries
- [ ] Check `products` table has entries
- [ ] Check `products_with_seller` view works
- [ ] Check storage bucket has uploaded images
- [ ] Monitor RLS policies are working (no unauthorized access)

### 3. Analytics Setup (Optional)

- [ ] Verify view tracking works (product views increment)
- [ ] Verify contact tracking works (WhatsApp clicks increment)
- [ ] Check seller stats update correctly

---

## 🔧 Configuration Options

### Location Settings

Default location radius: **50km**

To change, update in `supabase/migrations/002_location_and_trust.sql`:
```sql
radius_km INTEGER DEFAULT 50  -- Change to desired radius
```

### Listing Expiry

Default expiry: **7 days**

To change, update in `supabase/migrations/002_location_and_trust.sql`:
```sql
expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
```

### Supported Languages

Currently: English, Tamil, Hindi

To add more, update `lib/i18n.ts`:
```typescript
export const translations = {
  en: { /* English */ },
  ta: { /* Tamil */ },
  hi: { /* Hindi */ },
  // Add your language here
}
```

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `Module not found`
- **Fix:** Run `npm install` to ensure all dependencies are installed

**Error:** `Type errors in Supabase queries`
- **Fix:** Type assertions are already in place with `as any`

### Runtime Errors

**Error:** `Supabase connection failed`
- **Fix:** Verify environment variables are set correctly
- Check Supabase project is active
- Verify API keys are valid

**Error:** `Camera not working`
- **Fix:** Ensure HTTPS is enabled (required for camera API)
- Vercel deployments use HTTPS by default

**Error:** `AI analysis fails`
- **Fix:** Verify `ANTHROPIC_API_KEY` is set
- Check API key has sufficient credits
- Review API logs in Anthropic console

**Error:** `Location not detected`
- **Fix:** Grant browser location permissions
- BigDataCloud reverse geocoding is free and doesn't require API key

### Performance Issues

**Slow product loading:**
- Verify PostGIS spatial index exists
- Check database query performance in Supabase
- Consider enabling Supabase connection pooling

**Large image uploads:**
- Image compression is automatic (max 1MB)
- If still slow, check user's network connection

---

## 📊 Monitoring & Maintenance

### Key Metrics to Monitor

1. **Database**
   - Active users count
   - Live products count
   - Products created per day
   - Average views per product

2. **API Usage**
   - Anthropic API calls
   - Remaining API credits
   - Response times

3. **Storage**
   - Total images stored
   - Storage usage (Supabase free tier: 1GB)

4. **Errors**
   - 4xx/5xx error rates
   - Failed API calls
   - Database query errors

### Regular Maintenance

**Daily:**
- Monitor error logs in Vercel dashboard
- Check Supabase database health

**Weekly:**
- Review test report from `/test` page
- Clean up expired products (optional automation)

**Monthly:**
- Review API usage and costs
- Archive sold products (optional)
- Update dependencies: `npm update`

---

## 🔐 Security Notes

### Current Security Measures

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Phone authentication with OTP
- ✅ Secure file uploads with Supabase Storage
- ✅ HTTPS enforced on Vercel
- ✅ API keys in environment variables (not in code)

### Production Hardening (Recommended)

- [ ] Enable Supabase email notifications for auth events
- [ ] Set up rate limiting for API routes
- [ ] Enable CORS restrictions in Supabase
- [ ] Add Content Security Policy headers
- [ ] Set up automated backups in Supabase

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)
- [PostGIS Documentation](https://postgis.net/docs/)

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ All 16 automated tests pass
2. ✅ Production build completes without errors
3. ✅ All user flows work end-to-end
4. ✅ Database queries execute quickly (<500ms)
5. ✅ Images upload and display correctly
6. ✅ Location detection works
7. ✅ WhatsApp/SMS contact works
8. ✅ Authentication works
9. ✅ Mobile experience is smooth
10. ✅ No console errors in browser

---

**Deployed by:** Claude
**Version:** SnapSell MVP v1.0
**Build Date:** 2025-12-27
**Status:** Production Ready ✅
