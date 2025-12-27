# 📸 SnapSell MVP

> Camera-first mobile marketplace. **Photo → Price → Live → WhatsApp** in under 30 seconds.

A Next.js 14 application that lets anyone sell surplus inventory instantly. No forms, no dashboards, no learning curve.

## 🎯 Core Features

- **Instant Camera Capture**: Native camera access with automatic compression
- **AI-Powered Listings**: Claude Vision API suggests title, category, color, and size
- **30-Second Flow**: Capture → Confirm → Live
- **WhatsApp Integration**: Buyers contact sellers directly via deep links
- **Multilingual**: English, Tamil, Hindi support
- **PWA Ready**: Install as mobile app

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Anthropic Claude API (Vision)
- **Deployment**: Vercel + Supabase Cloud

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))
- Twilio account (for SMS OTP via Supabase Auth)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd Agentic-ecomm-MVP
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project
2. Run the database migration:
   ```bash
   # In Supabase SQL Editor, run:
   supabase/migrations/001_initial_schema.sql
   ```
3. (Optional) Seed demo data:
   ```bash
   # In Supabase SQL Editor, run:
   supabase/seed.sql
   ```
4. Enable Phone Auth:
   - Go to Authentication → Providers
   - Enable Phone provider
   - Configure Twilio credentials

### 3. Configure Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-xxx

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 User Flows

### Seller Flow

1. **Authenticate** (`/auth`): Phone OTP verification
2. **Capture** (`/sell`): Take photo with camera
3. **Confirm** (`/sell/confirm`): Review AI suggestions, enter price
4. **Success** (`/sell/success`): Share listing

### Buyer Flow

1. **Browse** (`/feed`): Vertical scroll feed
2. **View** Product details with location
3. **Contact** Tap WhatsApp button → Opens chat with seller

## 🗄️ Database Schema

### Tables

- **users**: Seller profiles (phone, location)
- **products**: Listings with AI-suggested metadata

### Key Features

- Row Level Security (RLS) enabled
- Automatic 48-hour expiry
- View/click tracking functions
- Storage bucket for images

## 🎨 Design System

### Colors

- **Surface**: `#FAFAF9` (Off-white)
- **Ink**: `#1C1917` (Charcoal)
- **Muted**: `#78716C` (Warm gray)
- **Accent**: `#10B981` (Green)
- **WhatsApp**: `#25D366`

### Typography

- **Sans**: Geist Sans / System UI
- **Mono**: Geist Mono (for prices)

## 🌍 Localization

Supported languages:
- English (`en`)
- Tamil (`ta`)
- Hindi (`hi`)

Auto-detects browser language. See `lib/i18n.ts` for translations.

## 📦 Project Structure

```
├── app/                    # Next.js App Router
│   ├── feed/              # Buyer feed page
│   ├── sell/              # Seller flow pages
│   │   ├── confirm/       # AI suggestions + price
│   │   └── success/       # Confirmation
│   ├── auth/              # OTP authentication
│   └── api/               # API routes
│       └── analyze-image/ # Claude Vision endpoint
├── components/
│   ├── ui/                # Reusable primitives
│   ├── feed/              # Buyer components
│   ├── sell/              # Seller components
│   └── shared/            # Common components
├── lib/                   # Utilities
│   ├── supabase/          # Database clients
│   ├── claude.ts          # AI integration
│   ├── image.ts           # Compression
│   ├── whatsapp.ts        # Deep links
│   ├── currency.ts        # Formatting
│   └── i18n.ts            # Localization
├── hooks/                 # React hooks
├── types/                 # TypeScript definitions
├── supabase/             # Database migrations & seeds
└── public/               # Static assets
```

## 🔒 Security

- **Authentication**: Supabase Phone OTP
- **RLS**: All tables protected
- **Input Validation**: Image type/size, price ranges
- **Rate Limiting**: API routes protected
- **HTTPS Only**: Enforced in production

## 🚢 Deployment

### Vercel (Frontend)

1. Connect GitHub repository
2. Add environment variables
3. Deploy:
   ```bash
   vercel --prod
   ```

### Supabase (Backend)

1. Project already deployed on Supabase Cloud
2. Configure custom domain (optional)
3. Enable Edge Functions if needed

## 📊 Analytics

Minimal event tracking:
- `listing_started` / `listing_completed`
- `feed_view` / `whatsapp_click`

See `types/index.ts` for event schema.

## 🔧 Development

### Key Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Lint codebase
```

### Adding Features

- **New Page**: Add to `app/` directory
- **New Component**: Add to `components/`
- **New Utility**: Add to `lib/`
- **Database Change**: Create new migration in `supabase/migrations/`

## 🐛 Troubleshooting

### Camera Not Working

- Ensure HTTPS (required for camera API)
- Check browser permissions
- Falls back to file picker automatically

### OTP Not Sending

- Verify Twilio configuration in Supabase
- Check phone number format (+91...)
- Ensure credits available

### Image Upload Fails

- Check Supabase Storage bucket exists (`product-images`)
- Verify RLS policies allow uploads
- Ensure image < 5MB

## 📝 TODO / Future Enhancements

- [ ] Search and filters
- [ ] Location-based sorting in feed
- [ ] Multi-image uploads
- [ ] In-app notifications
- [ ] Seller dashboard
- [ ] Payment integration

## 📄 License

MIT

## 🤝 Contributing

This is an MVP. For production use:
1. Add comprehensive error handling
2. Implement proper logging
3. Add monitoring (Sentry, etc.)
4. Optimize images (blurhash, lazy loading)
5. Add E2E tests

## 📧 Support

For issues or questions, please open a GitHub issue.

---

**Built with** ❤️ **for small sellers everywhere**
