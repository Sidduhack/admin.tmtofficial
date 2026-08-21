# TMT OFFICIAL — Premium Digital Headquarters

> A cinematic, immersive, premium digital experience for the TMT OFFICIAL YouTube channel.
> Built with Next.js 14, React Three Fiber, GSAP, Supabase, and Cloudflare Workers.

## 🎯 Vision

Not a website. A **digital headquarters**.

- **Cinematic 3D Intro** — Original "System Boot Sequence" with volumetric lighting, particle systems, and spatial audio
- **Immersive Hero** — Living 3D environment with mouse parallax, scroll-driven camera, and energy rings
- **Premium Video System** — Featured/Challenge/Popular + New Videos sections with cinematic cards
- **Digital Gallery** — Masonry layout, lightbox, lazy loading, responsive images
- **Community Hub** — Announcements, social ecosystem, highlights
- **Creator Profile** — Visual storytelling with milestones, pillars, values
- **Contact & Join** — Validated forms, spam protection, email subscriptions
- **Feedback System** — Star ratings, categories, admin dashboard
- **Admin Panel** — Dashboard, content management, analytics, security

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router, TypeScript) |
| **Styling** | Tailwind CSS (custom design system) |
| **3D/WebGL** | Three.js, React Three Fiber, Drei, Postprocessing |
| **Animation** | GSAP, Framer Motion |
| **Database** | Supabase (PostgreSQL, RLS, Auth) |
| **Email** | Cloudflare Workers (SendGrid/Resend/Mailgun) |
| **State** | TanStack Query, React Hook Form, Zod |
| **Analytics** | Custom privacy-first events → Supabase |
| **Deployment** | Vercel (frontend), Supabase (DB), Cloudflare (email) |

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/           # Public pages
│   │   ├── videos/
│   │   ├── gallery/
│   │   ├── community/
│   │   ├── about/
│   │   ├── contact/
│   │   └── join/
│   ├── admin/              # Admin dashboard (protected)
│   │   ├── dashboard/
│   │   ├── content/
│   │   ├── feedback/
│   │   ├── users/
│   │   ├── notifications/
│   │   ├── analytics/
│   │   └── security/
│   ├── api/                # API routes
│   │   ├── contact/
│   │   ├── subscribe/
│   │   ├── youtube-sync/
│   │   └── feedback/
│   ├── globals.css         # Design system + base styles
│   ├── layout.tsx          # Root layout + providers
│   ├── providers.tsx       # Auth, Query, Analytics, Toast
│   └── page.tsx            # Home with 3D intro + hero
├── components/
│   ├── ui/                 # Base UI components
│   ├── three/              # 3D experiences
│   │   ├── IntroExperience.tsx
│   │   └── Hero3D.tsx
│   ├── layout/             # Navigation, Footer
│   ├── sections/           # Page sections
│   │   ├── VideoCard.tsx
│   │   ├── FeedbackWidget.tsx
│   │   └── ...
│   ├── forms/              # Form components
│   └── admin/              # Admin-specific components
├── lib/
│   ├── utils.ts            # Utilities (cn, formatting, etc.)
│   ├── supabase.ts         # Supabase clients (browser/server/admin)
│   ├── sound.ts            # Web Audio API sound system
│   ├── youtube.ts          # YouTube Data API integration
│   └── analytics.ts        # Privacy-first analytics
├── hooks/                  # Custom React hooks
├── context/                # React contexts
└── types/
    └── database.ts         # Supabase generated types
```

## 🎨 Design System

### Colors (CSS Variables)
```css
--color-abyss-black: #030307
--color-abyss-charcoal: #0A0A12
--color-neon-cyan: #00FFFF
--color-neon-violet: #BC13FE
--color-neon-gold: #FFD700
--color-ghost-white: #F0F0F5
--color-glass-white: rgba(255,255,255,0.08)
--color-glass-border: rgba(0,255,255,0.15)
```

### Typography
- **Display**: Space Grotesk (variable 300-700)
- **Body**: IBM Plex Sans (variable 300-700)
- **Mono**: JetBrains Mono (variable 300-700)

### Spacing Scale
`space-4xs` (2px) → `space-5xl` (8rem)

### Shadows & Glows
- `glow-cyan`, `glow-violet`, `glow-gold`
- `depth-1` through `depth-3`
- `inner-glow`

## 🎬 3D Intro: "SYSTEM BOOT SEQUENCE"

| Phase | Duration | Key Visual |
|-------|----------|------------|
| Pre-boot | 0.5s | Scanline sweep, capacitor hum |
| Anticipation | 1.5s | Hex grid floor, 3 dormant monoliths |
| Discovery | 2s | Energy veins activate monoliths sequentially |
| Impact | 1.5s | Monoliths fracture → reform as logo, shockwave |
| Reveal | 2s | Logo hovers, "TMT OFFICIAL" types out |
| Transition | 1s | Camera flies through logo into Hero |

**Intelligence**: First visit = full sequence. Returning = 2s compressed. Refresh = 1s orbital. Skip button at 1.5s.

## 🔊 Sound System

Procedural Web Audio API — zero external audio files for UI.

| Category | Sounds |
|----------|--------|
| Cinematic | Intro drone, impact hit, transition whoosh |
| Ambience | 30-60Hz hum, data-stream texture |
| UI Navigation | Orbital thrum, magnetic snap |
| UI Buttons | Cyan charge/release, violet tap |
| Feedback | Ascending chime (success), descending buzz (error) |
| Notifications | Double pulse, warm bell |

**Controls**: Global mute, per-category volume, `prefers-reduced-motion` → 0.2× volume.

## 🗄 Database Schema (Supabase)

Key tables: `profiles`, `videos`, `featured_videos`, `gallery_items`, `announcements`, `feedback`, `contact_messages`, `notification_subscriptions`, `admin_users`, `audit_logs`, `analytics_events`, `social_links`, `notification_events`.

**Security**: RLS on ALL tables. Admin-only policies via `admin_users` role check. Service role never in frontend.

## 📧 Email Architecture

Cloudflare Worker receives POST from Next.js API → sends via SendGrid/Resend/Mailgun.

Templates: New video alert, community update, confirmation, contact reply.

## 🔔 YouTube Sync (Automated)

Vercel Cron (every 15 min) → Edge Function → YouTube Data API v3 → Diff → Insert new videos → Queue notification emails → Log events.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Supabase project
- YouTube Data API v3 key
- Cloudflare account (for email worker)
- Vercel account (for deployment)

### Installation

```bash
# Clone and install
git clone <repo>
cd tmt-official
npm install

# Copy environment template
cp .env.example .env.local
# Fill in all values

# Run Supabase locally (optional)
npx supabase start

# Run migrations
npx supabase db push

# Start dev server
npm run dev
```

### Environment Variables

See `.env.example` for all required variables.

Key ones:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only!)
- `YOUTUBE_API_KEY` / `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID`
- `CLOUDFLARE_EMAIL_WORKER_URL` / `CLOUDFLARE_EMAIL_API_TOKEN`
- `CRON_SECRET` / `ADMIN_API_SECRET`

### Deploy

```bash
# Deploy email worker
cd cloudflare-worker
npm install
npm run deploy

# Deploy to Vercel
vercel --prod
# Add env vars in Vercel dashboard
# Enable Cron job for /api/youtube-sync
```

## 📱 Responsive Breakpoints

| Breakpoint | Target | 3D Quality |
|------------|--------|------------|
| Mobile (<640px) | Phones | Low (reduced particles, no post-processing) |
| Tablet (640-1024px) | Tablets | Medium |
| Desktop (1024-1440px) | Laptops/Monitors | High |
| Ultrawide (>1440px) | Wide monitors | Ultra (wider FOV, more particles) |

**Adaptive**: `navigator.deviceMemory`, `hardwareConcurrency`, runtime FPS → auto quality tier.

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Semantic HTML5
- Focus management
- `prefers-reduced-motion` respected
- Keyboard navigation
- Screen reader labels
- Sufficient contrast ratios
- Audio controls (mute, volume)

## 🔒 Security

- CSP, HSTS, COOP, CORP headers
- Supabase RLS + service role isolation
- HttpOnly auth cookies + CSRF tokens
- Rate limiting (Upstash Redis)
- hCaptcha on forms
- Audit logging for admin actions
- Input validation (Zod) on client + server
- No secrets in frontend bundle

## ⚡ Performance

- Code splitting (route groups, dynamic imports)
- Three.js lazy-loaded after interaction
- Image optimization (AVIF/WebP, responsive, blur placeholders)
- Font subsetting + `font-display: swap`
- ISR (60s) for public pages
- Service Worker (Workbox) for offline shell
- Bundle analysis (`@next/bundle-analyzer`)

## 🧪 Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run db:push      # Push Supabase migrations
npm run db:reset     # Reset local Supabase
```

## 📄 License

Private — TMT OFFICIAL. All rights reserved.

---

**Built with obsession for craft.** The abyss awaits.# tmt-official.try
# tmt-official.try
# tmt-official.try
