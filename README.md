# VANGUARD

A political movement website built like an Awwwards-grade creative studio site — cinematic motion, brutalist editorial typography, and a single acid-green accent against a near-black palette.

> The future is not given. It is taken.

---

## Stack

- **Framework** — [Next.js 14](https://nextjs.org/) (App Router) + TypeScript (strict)
- **Styling** — [Tailwind CSS](https://tailwindcss.com/) + `tailwind-merge` + `class-variance-authority`
- **Motion** — [GSAP 3](https://gsap.com/) (+ ScrollTrigger, `@gsap/react`) and [Framer Motion 11](https://www.framer.com/motion/)
- **Smooth scroll** — [Lenis](https://lenis.darkroom.engineering/) (synced with GSAP `ticker`)
- **Icons** — [Lucide React](https://lucide.dev/)
- **Form controls** — [React Select](https://react-select.com/)
- **Fonts** — Bebas Neue · DM Serif Display · Space Mono · Barlow Condensed · Space Grotesk (via `next/font/google`)

---

## Quick start

```bash
# 1. install deps
yarn install

# 2. start dev server
yarn dev          # → http://localhost:3000

# 3. type-check + lint + production build
yarn build

# 4. serve the production build locally
yarn start
```

Optionally copy `.env.example` to `.env.local` and override values:

```bash
cp .env.example .env.local
```

---

## Folder structure

```
vanguard/
├── public/                       # Static assets (favicon, OG, robots.txt)
│   ├── og-image.svg
│   └── robots.txt
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout · fonts · global providers
│   │   ├── page.tsx              # Home — composes all sections
│   │   ├── icon.svg              # Auto-served favicon
│   │   ├── not-found.tsx         # 404 page
│   │   ├── error.tsx             # Route error boundary
│   │   ├── loading.tsx           # Route loading state
│   │   ├── robots.ts             # robots.txt (dynamic)
│   │   └── sitemap.ts            # sitemap.xml (dynamic)
│   ├── components/
│   │   ├── layout/               # Navbar · Footer · CustomCursor · SmoothScroll
│   │   ├── sections/             # 8 home-page sections (Hero, Manifesto, …)
│   │   └── ui/                   # Reusable primitives (BleedButton, ChapterReveal, …)
│   ├── hooks/                    # useScrollAnimation, useMagneticEffect, …
│   ├── lib/                      # site-config, gsap-config, utils (cn)
│   └── styles/
│       └── globals.css           # Tailwind base · noise filter · marquee keyframes
├── .editorconfig
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Home page sections

The home page (`src/app/page.tsx`) composes 8 sections in order:

| # | Section | Highlights |
|---|---------|------------|
| 1 | **Hero** | Full-bleed canvas particle field · centered Chapter-Reveal headline · `BleedButton` CTA |
| 2 | **MarqueeTicker** | Two GSAP marquees (opposite directions) · hover slows + dims via `timeScale` |
| 3 | **ManifestoGrid** | 12-col bento with cursor color-bleed cards · pillar codes (ECN/DGT/CLM/GLB/SAF) instead of generic numbers |
| 4 | **HorizontalCarousel** | Pinned horizontal scroll · per-card stat count-up tied to `containerAnimation` |
| 5 | **StatsCounter** | Acid-green panel · 4 GSAP-driven number counters · per-cell hover scramble |
| 6 | **Leadership** | Magazine grid · React Select dept filter · grayscale → colour photos |
| 7 | **ParallaxQuote** | Multi-line quote with per-line scroll parallax · floating particles · animated gradient mesh |
| 8 | **JoinCTA** | Newsletter form with `BleedButton` submit · 3 trust badges |

---

## Reusable primitives

Located in `src/components/ui/`:

- **`BleedButton`** — link/button with cursor-position color-bleed reveal. Variants: `accent | invert | ghost | card`. Sizes: `md | lg`.
- **`ChapterReveal`** — character-by-character scroll-in for headings. Used by every section heading.
- **`MagneticButton`** — older animated-ring button (kept available for future use).
- **`Button`**, **`Input`** — shadcn-style primitives re-themed to the dark palette.

---

## Custom hooks

Located in `src/hooks/`:

- **`useScrollAnimation`** — scoped `gsap.context` wrapper that auto-cleans ScrollTriggers on unmount.
- **`useMagneticEffect`** — magnetic pointer-pull via `gsap.quickTo`.
- **`useMousePosition`** — global pointer position state.
- **`useScrambleHover`** — per-character cursor-proximity warp for headings (`scramble | lift | magnet | blur`).

---

## Layout primitives

Located in `src/components/layout/`:

- **`Navbar`** — sticky header with scroll-driven height collapse, IntersectionObserver active-link tracking, footer-style underline-draw hover.
- **`Footer`** — three columns of links + social row. Underline-draw hover matches navbar.
- **`CustomCursor`** — twin-dot trailing cursor (small acid dot leads, larger ring trails). Theme-aware via `[data-cursor-theme="light"]`.
- **`SmoothScroll`** — Lenis smooth scrolling, GSAP-synced, intercepts every `<a href="#…">` for eased anchor jumps.

---

## Theming

The palette is defined in `tailwind.config.ts` and used everywhere via Tailwind tokens:

| Token | Hex | Use |
|-------|-----|-----|
| `background` | `#050505` | Page bg |
| `surface` | `#0F0F0F` | Card / panel bg |
| `foreground` | `#F0EDE6` | Primary text + light fills |
| `muted` | `#3A3A3A` | Borders + dim text |
| `accent` | `#C8F400` | Acid-green accent (CTAs, highlights, links) |
| `urgent` | `#FF2D20` | Brand red (active dots, alerts) |

Font families:

- `font-display` — Bebas Neue (headings)
- `font-editorial` — DM Serif Display (decorative)
- `font-mono` — Space Mono (technical / labels)
- `font-label` — Barlow Condensed (uppercase tags)
- `font-grotesk` — Space Grotesk (UI / nav / buttons)

---

## SEO

- Per-page metadata flows through `siteConfig` (`src/lib/site-config.ts`).
- `robots.ts` and `sitemap.ts` are App-Router file-conventions — no separate `public/sitemap.xml` needed.
- OG image at `public/og-image.svg` (1200×630). Replace with a PNG for stricter platform support.
- Favicon at `src/app/icon.svg` (Next.js auto-serves at `/icon.svg` and writes the `<link>` tags).

Override the canonical URL per environment via `NEXT_PUBLIC_SITE_URL`.

---

## Scripts

```bash
yarn dev      # next dev — local development
yarn build    # next build — production bundle + type-check
yarn start    # next start — serve the production build
yarn lint     # next lint — ESLint pass
```

---

## Deployment

The project is a vanilla Next.js App Router app — works on Vercel, Netlify, Cloudflare Pages, AWS Amplify, or self-hosted via `next start` behind a reverse proxy.

For Vercel: connect the repo, set `NEXT_PUBLIC_SITE_URL` in project env, deploy.

---

## Browser support

Modern evergreen browsers (Chromium, Firefox, Safari 15+). The custom cursor and Lenis smooth-scroll are pointer-only — touch devices keep native scroll and the system cursor.

---

## License

MIT — see [`LICENSE`](./LICENSE).
