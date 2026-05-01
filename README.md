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

```bash
# 1. Install dependencies
npm install

# 2. Copy env file (optional — defaults are baked in)
cp .env.example .env.local

# 3. Start dev server
npm run dev

# Open http://localhost:3000
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

> **For step-by-step instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).**
> The condensed version is below.

### 0. Provision the server

1. Create a Hetzner Cloud server (CX22 or larger, Ubuntu 24.04).
2. Point your DNS **A records** at the server's IP:

   | Host              | Type | Value                |
   | ----------------- | ---- | -------------------- |
   | `qubixsolution.com`     | A    | `<your.server.ip>`   |
   | `www.qubixsolution.com` | A    | `<your.server.ip>`   |

3. SSH in and install Docker:

   ```bash
   curl -fsSL https://get.docker.com | sudo sh
   sudo usermod -aG docker $USER
   # log out and back in, or run: newgrp docker
   ```

### 1. Clone the repo

```bash
git clone <your-repo-url> qubix-solutions
cd qubix-solutions
cp .env.example .env
```

### 2. Bootstrap the SSL certificate

The included `scripts/init-letsencrypt.sh` will:

1. Generate a temporary self-signed cert so Nginx can start.
2. Start Nginx and the Next.js app.
3. Use Certbot's webroot challenge to issue a real Let's Encrypt cert.
4. Reload Nginx.

Run it once:

```bash
sudo bash scripts/init-letsencrypt.sh
```

> If the domain isn't fully propagated yet, set `STAGING=1` at the top of the
> script first to test against Let's Encrypt's staging server.

### 3. Bring everything up

```bash
docker compose up -d --build
docker compose ps
```

You should see three containers running:

- `qubix-web`     — Next.js (port 3000, internal)
- `qubix-nginx`   — Nginx (ports 80, 443)
- `qubix-certbot` — Background certificate renewer

Visit **https://qubixsolution.com** ✅

### 4. Updating the site

```bash
git pull
docker compose up -d --build web
```

Zero-downtime: the new container is built first, then swapped in. Nginx
keeps serving from the old one until the new one is healthy.

### 5. Logs & ops

```bash
# Tail logs
docker compose logs -f web
docker compose logs -f nginx

# Reload Nginx after editing nginx/conf.d/*.conf
docker compose exec nginx nginx -s reload

# Renew certs manually (otherwise auto-renews every 12h)
docker compose run --rm certbot renew
docker compose exec nginx nginx -s reload
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