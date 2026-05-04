# Qubix Solutions — Portfolio Website

Production-grade, SEO-optimized portfolio website for **Qubix Solutions**
(`qubixsolution.com`). Built with **Next.js 16 (App Router)**, **React 19**,
**Tailwind CSS** and **Framer Motion** — designed to deploy to a Hetzner VPS
with Docker, Docker Compose and Nginx.

## Why Next.js?

Next.js was chosen specifically because it is the **most SEO-friendly React
framework**:

- Server-side rendering & static generation — pages ship with full HTML,
  not an empty `<div id="root">`.
- Built-in Metadata API (`generateMetadata`, OpenGraph, Twitter cards).
- Automatic `sitemap.xml`, `robots.txt`, JSON-LD structured data.
- Image optimization (AVIF/WebP) and font optimization out of the box.
- Excellent Core Web Vitals — LCP, CLS, INP all tuned by default.

## Tech stack

| Layer       | Tech                                                          |
| ----------- | ------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack)                            |
| UI          | React 19, Tailwind CSS, Framer Motion, Lucide icons           |
| Fonts       | Inter + Space Grotesk (self-hosted via `next/font`)           |
| SEO         | Metadata API, JSON-LD, sitemap, robots, OG image              |
| Container   | Multi-stage Dockerfile, Next.js `standalone` output           |
| Reverse proxy | Nginx 1.27 — gzip, HTTP/2, OCSP stapling, security headers |
| TLS         | Let's Encrypt via Certbot (auto-renewal every 12h)            |
| Host        | Hetzner Cloud (any provider works)                            |

## Site structure

```
/                  Home — hero, services preview, process, why us, testimonials, CTA
/services          Detailed services with bullets, stack, and CTAs
/work              Selected case studies with metrics
/about             Company mission, values
/contact           Contact form (POSTs to /api/contact)
/privacy           Privacy policy
/terms             Terms of service
/sitemap.xml       Auto-generated
/robots.txt        Auto-generated
/api/contact       Contact form handler
```

## Services covered

- AI & LLM Development (RAG, agents, fine-tuning)
- AI Chatbots & Assistants
- AI Automation with n8n & Node.js
- Web Development (React, Next.js, Angular)
- Mobile App Development (Flutter)
- Shopify E-commerce (themes & Hydrogen)
- WordPress / WooCommerce
- Digital Marketing & SEO
- DevOps & Cloud Deployment

## Local development

### Prerequisites

- Node.js **22.x** (LTS) or newer
- npm **10+**

### Run the dev server

The contact form posts to **`/api/contact`** (same origin). The Next.js server proxies to FastAPI via **`CONTACT_BACKEND_URL`** (defaults to `http://127.0.0.1:8000/contact`).

```bash
# 1. Install dependencies
npm install

# 2. Copy env file (optional — defaults match local FastAPI on port 8000)
cp .env.example .env.local

# 3. SMTP + CORS — copy backend env and add EMAIL_PASS before testing email send
cp backend/.env.example backend/.env

# 4a. Terminal A — FastAPI (from repo root or backend/)
cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload

# 4b. Terminal B — Next.js
npm run dev

# Open http://localhost:3000 — /contact submits via /api/contact → FastAPI /contact.
```

### Production build (locally)

```bash
npm run build
npm start
```

## Editing content

All copy and data are in plain TypeScript files — no CMS required:

- **Site config / brand:** `src/lib/site.ts`
- **Services list:** `src/lib/services.ts`
- **Case studies / projects:** `src/lib/projects.ts`
- **Sections (Hero, WhyUs, etc.):** `src/components/sections/*`

The favicon and OG image live in `public/` as crisp, scalable SVGs.

## Deployment to Hetzner (Docker + Nginx)

> **Full guide: [DEPLOYMENT.md](./DEPLOYMENT.md).** The TL;DR is below.

After provisioning the server (Ubuntu + Docker installed, DNS pointing at it):

```bash
# 1. Clone & configure
git clone <your-repo-url> /opt/qubix && cd /opt/qubix
cp .env.example .env

# 2. Start the stack (auto-generates a dummy cert so Nginx can boot)
docker compose up -d

# 3. Replace the dummy with a real Let's Encrypt cert
bash scripts/enable-ssl.sh
```

That's it. Site is live at **https://qubixsolution.com** with auto-renewing SSL.

### Updating

```bash
git pull
docker compose up -d --build web
```

No downtime — Nginx keeps serving the old container until the new one is healthy.

### Common ops

```bash
docker compose logs -f web                       # app logs
docker compose logs -f nginx                     # access + error
docker compose exec nginx nginx -s reload        # reload nginx config
docker compose restart                           # restart everything
```

## SEO checklist (already done)

- ✅ Server-rendered HTML on every public route
- ✅ `<title>`, `<meta description>` per page (Metadata API)
- ✅ Canonical URLs on every page
- ✅ Open Graph + Twitter cards with custom OG image
- ✅ JSON-LD `Organization` and `WebSite` structured data
- ✅ `sitemap.xml` auto-generated
- ✅ `robots.txt` allowing all, disallowing `/api/`
- ✅ Strict security headers (HSTS, X-Frame-Options, etc.)
- ✅ Optimized fonts (`display: swap`, subset to latin)
- ✅ Image optimization via `next/image` (AVIF + WebP)
- ✅ Accessible: skip-link, ARIA labels, keyboard nav, focus rings
- ✅ Mobile-first responsive layout
- ✅ Reduced-motion respected via media query

After deployment, register the site in:

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

…and submit `https://qubixsolution.com/sitemap.xml`.

## Contact form

The form on `/contact` POSTs JSON to `/api/contact`. Out of the box it logs
submissions and returns success — wire it up to your preferred provider:

- **Resend / Postmark / SES** — drop in `await resend.emails.send(...)` in
  `src/app/api/contact/route.ts`.
- **Slack / Discord webhook** — POST the payload to your webhook URL.
- **CRM (HubSpot, Pipedrive)** — call their API.
- **Database** — insert into Postgres / Supabase.

## Project structure

```
.
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout, metadata, JSON-LD
│   │   ├── page.tsx              # Home
│   │   ├── services/page.tsx
│   │   ├── work/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── api/contact/route.ts  # Contact form API
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── not-found.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/               # Header, Footer, Logo
│   │   ├── sections/             # Hero, WhyUs, Process, etc.
│   │   └── ui/                   # Section, Reveal primitives
│   └── lib/
│       ├── site.ts               # Brand config + nav
│       ├── services.ts           # Services data
│       ├── projects.ts           # Case studies
│       └── utils.ts
├── public/                       # Static assets, favicon, OG image
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
│       ├── qubix.conf            # HTTPS production config
│       └── qubix.http-only.conf.example
├── scripts/
│   └── init-letsencrypt.sh
├── Dockerfile
├── docker-compose.yml
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Performance budget targets

- LCP: < 1.5 s on 4G mobile
- CLS: < 0.05
- INP: < 200 ms
- Lighthouse Performance: ≥ 95
- Lighthouse SEO: 100

## Support

Have questions or want to extend the site? Email
[support@qubixsolution.com](mailto:support@qubixsolution.com).

---

© Qubix Solutions. All rights reserved.