# 🚀 SnapSell MVP - Quick Start Guide

> **Branch:** `claude/snapsell-mvp-build-4eFq9`
> **Status:** Production Ready ✅
> **Last Updated:** December 30, 2025

---

## 📋 Prerequisites

- **Node.js:** 18.x or later
- **Supabase Account:** Free tier works
- **Anthropic API Key:** For Claude Vision AI

---

## ⚡ Quick Setup (5 minutes)

### 1. Clone & Install

```bash
git clone https://github.com/wolvio-cloud/Agentic-ecomm-MVP.git
cd Agentic-ecomm-MVP
git checkout claude/snapsell-mvp-build-4eFq9
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Anthropic (Claude Vision)
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Get your keys:**
- Supabase: https://supabase.com → Project Settings → API
- Anthropic: https://console.anthropic.com → API Keys

### 3. Database Setup

In Supabase SQL Editor, run migrations **in order**:

```sql
-- Run these one by one:
\i supabase/migrations/001_initial_schema.sql
\i supabase/migrations/002_location_and_trust.sql
\i supabase/migrations/003_contact_tracking.sql
```

**Enable PostGIS:**
```sql
CREATE EXTENSION IF NOT EXISTS "postgis";
```

**Create Storage Bucket:**
1. Go to Supabase → Storage
2. Create bucket: `products`
3. Set to **Public**

### 4. Seed Demo Data (Optional)

```sql
\i supabase/seed.sql
```

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## 🧪 Testing the New Features

### Test 1: Price-First Flow

1. Navigate to http://localhost:3000/sell
2. Choose **Camera** or **Gallery**
3. Select/capture an image
4. Wait for AI analysis (~3 seconds)
5. See AI-generated title (editable)
6. Enter price
7. Click **GO LIVE**

**Expected:** Item created in under 30 seconds

### Test 2: Gallery Selection

1. Go to /sell
2. Click **Gallery** button
3. Select any image from your device
4. Should compress and analyze automatically

**Expected:** Works on both mobile and desktop

### Test 3: Seller Catalog

1. Go to /feed
2. Click on any product
3. Scroll down and click on seller name/badge
4. See seller's catalog at `/seller/[id]`

**Expected:**
- Shows verified badge if verified
- Lists all seller's items
- NO store branding, follow buttons, or bio
- Shows: location, listing count, member duration

### Test 4: Contact Tracking

1. On any product in /feed
2. Click **WhatsApp**, **SMS**, or **Copy Phone**
3. Check database: `contact_events` table
4. Should see new row with channel and timestamp

**Expected:** All 3 channels tracked separately

### Test 5: AI Title Generation

Try uploading various items:
- **Textiles:** Should generate "Blue Cotton T-Shirt Lot"
- **Electronics:** Should generate "Black Wireless Headphones"
- **Home:** Should generate "Wooden Coffee Table"

**Expected:** NEVER see "Item for Sale" or generic titles

---

## 📊 Database Verification

Run these queries in Supabase SQL Editor:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Should show:
-- contact_events
-- products
-- users

-- Check PostGIS
SELECT PostGIS_Version();

-- Check contact tracking
SELECT * FROM contact_events LIMIT 10;

-- Check products with AI data
SELECT id, title, material, condition, category
FROM products
LIMIT 5;
```

---

## 🏗️ Build & Deploy

### Local Build Test

```bash
npm run build
```

**Expected output:**
```
✓ Compiled successfully
✓ Generating static pages (13/13)

Route (app)                              Size     First Load JS
├ ○ /sell/price                          3.14 kB         149 kB
├ ƒ /seller/[id]                         3.28 kB         149 kB
└ ... (13 routes total)
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Or use Vercel Dashboard:
1. Import repository
2. Select branch: `claude/snapsell-mvp-build-4eFq9`
3. Add environment variables
4. Deploy

---

## 🎯 What's New in This Version

### ✅ Completed Features

| Feature | Status | Description |
|---------|--------|-------------|
| **AI Title Generation** | ✅ | Always generates descriptive titles (never "Item for Sale") |
| **Price-First Flow** | ✅ | Image → Price → Live (3 taps, 30 seconds) |
| **Camera + Gallery** | ✅ | Dual input with auto-compression |
| **Seller Catalog** | ✅ | `/seller/[id]` - NOT a store (per guardrails) |
| **Contact Tracking** | ✅ | Analytics for WhatsApp/SMS/Copy channels |
| **Production Build** | ✅ | All 13 routes compile successfully |

### 📁 New Routes

- `/sell/price` - Streamlined price entry
- `/seller/[id]` - Seller catalog (guardrail-compliant)

### 🗄️ New Database Tables

- `contact_events` - Multi-channel contact analytics
- Added: `contact_count` column on products
- Added: AI fields (material, condition) on products

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection fails
- Check `.env.local` has correct URL and anon key
- Verify project is active in Supabase dashboard
- Check API settings → Disable "Pause Project" if enabled

### AI analysis fails
- Verify `ANTHROPIC_API_KEY` in `.env.local`
- Check API key is active in console.anthropic.com
- Check API credit balance

### Camera doesn't work
- Must use HTTPS (localhost is OK for testing)
- Grant browser camera permissions
- On mobile: use actual device, not emulator

### Images not uploading
- Check Supabase Storage bucket `products` exists
- Verify bucket is set to **Public**
- Check RLS policies allow uploads

---

## 📱 Mobile Testing

### Local Network Access

1. Find your local IP:
   ```bash
   ipconfig getifaddr en0  # Mac
   # or
   hostname -I  # Linux
   ```

2. Update Next.js to allow connections:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```

3. Access from phone:
   ```
   http://YOUR-LOCAL-IP:3000
   ```

### PWA Testing

On mobile:
1. Open in browser (Chrome/Safari)
2. Tap "Add to Home Screen"
3. App icon appears
4. Launch like native app

---

## 🔍 Feature Checklist

Test these flows work end-to-end:

- [ ] Seller Flow: /sell → Camera/Gallery → AI analysis → Price → GO LIVE
- [ ] Feed Flow: /feed → Nearby/National/Global tabs → Infinite scroll
- [ ] Contact Flow: Product → WhatsApp/SMS/Copy → Tracking works
- [ ] Seller Flow: Product → Seller name → Catalog page → See all items
- [ ] My Items: /my-items → Live/Sold/Expired tabs → Renew/Delete
- [ ] Auth Flow: Phone OTP → Verification → Access protected routes
- [ ] Location: Auto-detect → Show city → Filter nearby items
- [ ] AI Flow: Upload → Get descriptive title (not generic)

---

## 📚 Key Files to Know

```
app/
├── sell/
│   ├── page.tsx              # Camera/Gallery choice
│   └── price/page.tsx        # Price-first flow (NEW)
├── seller/[id]/page.tsx      # Seller catalog (NEW)
├── feed/page.tsx             # Main feed with contact tracking
└── my-items/page.tsx         # User's listings dashboard

components/
└── sell/
    └── CaptureChoice.tsx     # Camera + Gallery (NEW)

lib/
└── claude.ts                 # Enhanced AI prompt + fallback (UPDATED)

supabase/migrations/
├── 001_initial_schema.sql    # Core tables
├── 002_location_and_trust.sql # PostGIS + trust signals
└── 003_contact_tracking.sql  # Contact analytics (NEW)
```

---

## 🎉 Success Criteria

Your setup is complete when:

1. ✅ `npm run build` succeeds (no errors)
2. ✅ All 13 routes compile
3. ✅ /sell flow works (Camera → Price → GO LIVE)
4. ✅ AI generates real titles (not placeholders)
5. ✅ /seller/[id] shows catalog (not a store)
6. ✅ Contact events tracked in database
7. ✅ Feed shows products with location filtering
8. ✅ Mobile camera works
9. ✅ Gallery selection works

---

## 🚀 Quick Test Script

Run this to verify everything:

```bash
# 1. Build
npm run build

# 2. Check migrations ran
# In Supabase SQL Editor:
SELECT COUNT(*) FROM contact_events;  -- Should work (table exists)

# 3. Test routes
curl http://localhost:3000/api/analyze-image  # Should return 400 (not 404)

# 4. Start app
npm run dev

# 5. Test flow manually
# Open http://localhost:3000/sell
# Try Camera → Image → Price → GO LIVE
```

---

## 📞 Need Help?

- **Build errors:** Check Node.js version (need 18+)
- **Database errors:** Verify all 3 migrations ran in order
- **API errors:** Check .env.local has valid keys
- **Camera errors:** Must use HTTPS or localhost

---

**Version:** Production Build v1.0
**Branch:** `claude/snapsell-mvp-build-4eFq9`
**Build Status:** ✅ Passing (13 routes)
**Ready for:** Local testing → Staging → Production

---

Happy testing! 🎊
