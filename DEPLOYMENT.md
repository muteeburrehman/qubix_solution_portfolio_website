# Deployment Guide — Qubix Solutions

This guide walks you through deploying the Qubix Solutions website to a
**Hetzner Cloud VPS** using **Docker**, **Docker Compose**, **Nginx** and
**Let's Encrypt SSL** — from a fresh server to a live HTTPS site at
`https://qubixsolution.com`.

> Estimated time: **30–45 minutes** for a first-time deploy.

---

## Table of contents

1. [Architecture overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Provision a Hetzner server](#3-provision-a-hetzner-server)
4. [Configure DNS](#4-configure-dns)
5. [Server setup — install Docker](#5-server-setup--install-docker)
6. [Push the code & clone on the server](#6-push-the-code--clone-on-the-server)
7. [Configure environment variables](#7-configure-environment-variables)
8. [Issue the SSL certificate](#8-issue-the-ssl-certificate)
9. [Start the full stack](#9-start-the-full-stack)
10. [Verify the deployment](#10-verify-the-deployment)
11. [Updating the site](#11-updating-the-site)
12. [Day-2 operations](#12-day-2-operations)
13. [Backups](#13-backups)
14. [Troubleshooting](#14-troubleshooting)
15. [Rollback](#15-rollback)
16. [Hardening the server (optional but recommended)](#16-hardening-the-server-optional-but-recommended)

---

## 1. Architecture overview

```
                        ┌────────────────────────────┐
   Internet ──443──▶    │  qubix-nginx               │
                        │  (Nginx 1.27 reverse proxy)│
                        │  • TLS termination          │
                        │  • HTTP/2, gzip, caching    │
                        │  • Rate limiting            │
                        └────────────┬───────────────┘
                                     │ proxy_pass (port 3000)
                                     ▼
                        ┌────────────────────────────┐
                        │  qubix-web                 │
                        │  Next.js 16 (standalone)   │
                        └────────────────────────────┘

                        ┌────────────────────────────┐
                        │  qubix-certbot             │
                        │  Auto-renews TLS every 12h │
                        └────────────────────────────┘
```

Three Docker containers, one shared bridge network, two host volumes
(`./certbot/conf` for certs, `./certbot/www` for ACME challenges).

---

## 2. Prerequisites

You'll need:

- A **Hetzner Cloud** account (or any other VPS provider — DigitalOcean,
  AWS Lightsail and Linode work identically).
- Your **domain** (`qubixsolution.com`) registered with any registrar.
- A local machine with **git** installed.
- Your code pushed to a Git repository (GitHub, GitLab, Bitbucket, or a
  self-hosted Gitea — anywhere reachable from the server).
- An **SSH key pair** on your local machine (`~/.ssh/id_ed25519.pub` or
  similar). If you don't have one:

  ```bash
  ssh-keygen -t ed25519 -C "your.email@example.com"
  ```

---

## 3. Provision a Hetzner server

1. Log in to [console.hetzner.cloud](https://console.hetzner.cloud).
2. Click **+ New Project** → name it `qubix-solutions`.
3. Click **+ Add Server** and pick:
   - **Location**: closest to your audience (e.g. `Helsinki` or `Falkenstein`
     for EU, `Ashburn, VA` for North America).
   - **Image**: **Ubuntu 24.04**.
   - **Type**:
     - `CX22` (2 vCPU / 4 GB RAM) — fine for the marketing site (≈ €4–5/mo).
     - `CX32` (4 vCPU / 8 GB RAM) — recommended if you'll also self-host n8n.
   - **Networking**: leave IPv4 + IPv6 enabled.
   - **SSH keys**: paste the contents of your `~/.ssh/id_ed25519.pub`.
   - **Name**: `qubix-prod`.
4. Click **Create & Buy now**.

After ~10 seconds Hetzner gives you a public IPv4. Note it down — we'll call
it `<SERVER_IP>`.

5. Optional: enable **automatic backups** (€1/mo, daily snapshots).

---

## 4. Configure DNS

Go to your domain registrar (Namecheap, Cloudflare, Hostinger, etc.) and
create the following records:

| Type    | Name  | Value           | TTL  |
| ------- | ----- | --------------- | ---- |
| `A`     | `@`   | `<SERVER_IP>`   | 300  |
| `A`     | `www` | `<SERVER_IP>`   | 300  |
| `AAAA`  | `@`   | `<SERVER_IPv6>` | 300  |
| `AAAA`  | `www` | `<SERVER_IPv6>` | 300  |
| `CAA`   | `@`   | `0 issue "letsencrypt.org"` | 300 |
| `MX`    | `@`   | (your email provider, if any) | 300 |

Verify propagation:

```bash
dig +short qubixsolution.com
dig +short www.qubixsolution.com
```

Both should return `<SERVER_IP>`. **Do not proceed until DNS resolves
correctly** — Let's Encrypt will refuse to issue a certificate otherwise.

---

## 5. Server setup — install Docker

SSH into the server:

```bash
ssh root@<SERVER_IP>
```

Update packages and install Docker + Docker Compose plugin:

```bash
apt update && apt upgrade -y
apt install -y curl ca-certificates git ufw

# Official Docker install (one-liner)
curl -fsSL https://get.docker.com | sh

# Verify
docker --version
docker compose version
```

Create a non-root user for deployments (optional but recommended):

```bash
adduser deploy
usermod -aG docker,sudo deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# From now on you can SSH as deploy:
# ssh deploy@<SERVER_IP>
```

Enable a basic firewall:

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status
```

---

## 6. Push the code & clone on the server

### 6.1 On your local machine — push to a remote repo

If you haven't yet:

```bash
cd /path/to/Qubix_Solutions_portfolio_website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<your-org>/qubix-solutions-portfolio.git
git push -u origin main
```

### 6.2 On the server — clone

```bash
ssh deploy@<SERVER_IP>
cd /opt
sudo mkdir -p qubix && sudo chown deploy:deploy qubix
cd qubix

# HTTPS (works without server-side SSH keys)
git clone https://github.com/<your-org>/qubix-solutions-portfolio.git .

# OR: SSH (requires the server's public key added to GitHub deploy keys)
# git clone git@github.com:<your-org>/qubix-solutions-portfolio.git .
```

---

## 7. Configure environment variables

```bash
cd /opt/qubix
cp .env.example .env
nano .env   # or: vim .env
```

Set the values:

```env
NEXT_PUBLIC_SITE_URL=https://qubixsolution.com
NEXT_PUBLIC_SUPPORT_EMAIL=support@qubixsolution.com
```

Save and close.

> If you later wire the contact form to a service like Resend, Postmark or a
> Slack webhook, add those secrets here (and reference them in
> `src/app/api/contact/route.ts`).

---

## 8. Issue the SSL certificate

The repository ships with a one-shot bootstrap script that:

1. Generates a temporary self-signed certificate so Nginx can start.
2. Boots the Next.js + Nginx containers.
3. Uses Certbot's webroot challenge to issue a real Let's Encrypt cert for
   both `qubixsolution.com` and `www.qubixsolution.com`.
4. Reloads Nginx with the real certificate.

**(Optional) Test against the staging server first**

If you've never used Let's Encrypt for this domain, you can dry-run against
their staging server (the rate limits are much higher). Edit
`scripts/init-letsencrypt.sh` and change `STAGING=0` to `STAGING=1`.
After a successful staging run, set it back to `0` and re-run.

**Run the bootstrap**

```bash
cd /opt/qubix
sudo bash scripts/init-letsencrypt.sh
```

Expected output (last few lines):

```
### Reloading nginx ...
### Done. Your site should be reachable at https://qubixsolution.com
```

---

## 9. Start the full stack

```bash
cd /opt/qubix
docker compose up -d --build
docker compose ps
```

You should see three healthy containers:

```
NAME            IMAGE                       STATUS                    PORTS
qubix-web       qubix-solutions/web:latest  Up (healthy)              3000/tcp
qubix-nginx     nginx:1.27-alpine           Up (healthy)              0.0.0.0:80->80, 0.0.0.0:443->443
qubix-certbot   certbot/certbot:latest      Up                        -
```

---

## 10. Verify the deployment

### 10.1 Quick checks

```bash
# Health endpoint (Nginx)
curl -I http://qubixsolution.com/healthz

# HTTPS redirect
curl -I http://qubixsolution.com
# → expect: HTTP/1.1 301 Moved Permanently  Location: https://...

# Live HTTPS response
curl -I https://qubixsolution.com
# → expect: HTTP/2 200, strict-transport-security header

# www → apex redirect
curl -I https://www.qubixsolution.com
# → expect: HTTP/2 301, location: https://qubixsolution.com/

# SEO endpoints
curl https://qubixsolution.com/sitemap.xml | head -20
curl https://qubixsolution.com/robots.txt
```

### 10.2 Browser checks

1. Visit **https://qubixsolution.com** — site loads, padlock icon shown.
2. Open DevTools → **Lighthouse** → run for "Mobile" with all categories
   checked. Targets:
   - Performance ≥ 95
   - Accessibility ≥ 95
   - Best Practices ≥ 95
   - SEO = 100
3. Toggle the theme button — light/dark should switch instantly with no
   flash on reload.
4. Submit the contact form — should show the green confirmation card.

### 10.3 SSL grade

Run [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=qubixsolution.com)
— you should get an **A** or **A+** rating thanks to the OCSP stapling and
strong cipher suite preconfigured in `nginx/conf.d/qubix.conf`.

### 10.4 Search engine setup

1. Register the site in
   [Google Search Console](https://search.google.com/search-console).
2. Verify ownership using the **HTML tag** method — paste the meta tag into
   `src/app/layout.tsx` (inside `<head>`), redeploy, then click verify.
3. Submit `https://qubixsolution.com/sitemap.xml`.
4. Repeat for [Bing Webmaster Tools](https://www.bing.com/webmasters).

---

## 11. Updating the site

### 11.1 Standard update

```bash
ssh deploy@<SERVER_IP>
cd /opt/qubix
git pull
docker compose up -d --build web
```

Docker rebuilds the new image, then swaps it in. Nginx keeps serving traffic
the whole time — there is **no downtime** for code updates.

### 11.2 Update Nginx config

After editing anything under `nginx/`:

```bash
docker compose exec nginx nginx -t      # validate config
docker compose exec nginx nginx -s reload
```

### 11.3 Pull a new Next.js / dependency version

```bash
# locally
npm update next react react-dom
npm run build      # smoke test
git commit -am "chore: bump dependencies"
git push

# on the server
git pull
docker compose up -d --build web
```

---

## 12. Day-2 operations

### Logs

```bash
docker compose logs -f web        # Next.js app logs
docker compose logs -f nginx      # Nginx access + error logs
docker compose logs --tail=200    # all services, last 200 lines
```

### Container shell

```bash
docker compose exec web sh
docker compose exec nginx sh
```

### Resource usage

```bash
docker stats          # live CPU / memory per container
df -h                 # disk usage
free -h               # RAM
```

### Restart everything (rare)

```bash
docker compose restart
```

### Stop everything (e.g. for maintenance)

```bash
docker compose down            # keeps volumes + certs
docker compose down -v         # also removes volumes (DESTROYS certs!)
```

### Force certificate renewal

Certbot auto-renews every 12 h, but if you need to force it:

```bash
docker compose run --rm certbot renew --force-renewal
docker compose exec nginx nginx -s reload
```

---

## 13. Backups

The marketing site itself is stateless (no database). The only data on disk
worth backing up are the **Let's Encrypt certificates**:

```bash
# On the server, daily cron
sudo tar -czf /var/backups/qubix-certs-$(date +%F).tar.gz /opt/qubix/certbot
```

Or simpler: enable Hetzner's **automated backups** when creating the server
(€1/mo). Snapshots are stored off-host and can be restored from the console.

If you later add a database (Postgres for the contact form, e.g.), add it to
`docker-compose.yml` with a named volume and back up that volume regularly.

---

## 14. Troubleshooting

### Site shows a "Welcome to Nginx" default page

`docker-compose.yml` failed to mount the custom config. Check:

```bash
ls /opt/qubix/nginx/conf.d/
docker compose exec nginx cat /etc/nginx/conf.d/qubix.conf
```

### SSL handshake fails / browser warns "not secure"

```bash
docker compose logs certbot
docker compose exec nginx nginx -t
docker compose restart nginx
```

If Certbot errors with `DNS problem: NXDOMAIN`, your A records aren't
pointing at the server yet — wait for DNS to propagate.

### "502 Bad Gateway"

The Next.js container isn't healthy:

```bash
docker compose ps
docker compose logs web --tail=100
```

Common causes: build failed, port mismatch, OOM kill. Restart:

```bash
docker compose up -d --build web
```

### Out of disk space

Old images and the build cache pile up over time:

```bash
docker system df
docker image prune -af
docker builder prune -af
```

### Can't pull from Git on the server

If you're using SSH for cloning, generate a deploy key on the server:

```bash
ssh-keygen -t ed25519 -C "qubix-prod" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Then add that public key to your repo's **Deploy keys** in GitHub/GitLab.

### Health check failing

```bash
docker compose exec web wget -qO- http://127.0.0.1:3000/
docker compose exec nginx wget -qO- http://127.0.0.1/healthz
```

If the first works but the second doesn't, the issue is in Nginx → web
networking. Make sure both containers are on the `qubix-net` network:

```bash
docker network inspect qubix-solutions_qubix-net
```

---

## 15. Rollback

If a deploy ships a bad release, roll back to the previous Git SHA:

```bash
cd /opt/qubix
git log --oneline -10           # find the last good SHA
git checkout <good-sha>
docker compose up -d --build web
```

To return to `main`:

```bash
git checkout main
docker compose up -d --build web
```

---

## 16. Hardening the server (optional but recommended)

### 16.1 Disable root SSH login

After confirming you can log in as `deploy`:

```bash
sudo nano /etc/ssh/sshd_config
# Set:
#   PermitRootLogin no
#   PasswordAuthentication no
sudo systemctl restart ssh
```

### 16.2 Enable unattended security upgrades

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### 16.3 Add Fail2Ban

```bash
sudo apt install -y fail2ban
sudo systemctl enable --now fail2ban
```

### 16.4 Put Cloudflare in front (optional)

For DDoS protection, free CDN and analytics:

1. Add `qubixsolution.com` to a free Cloudflare account.
2. Switch your registrar's nameservers to Cloudflare's.
3. In Cloudflare DNS, set the A records' **proxy status** to **Proxied
   (orange cloud)**.
4. Set SSL/TLS mode to **Full (strict)**.
5. Update Nginx `set_real_ip_from` blocks (already configured for common
   private ranges; add Cloudflare's IPv4/IPv6 ranges from
   [cloudflare.com/ips](https://www.cloudflare.com/ips/) if you need
   accurate visitor IPs in logs).

---

## 17. CI/CD (optional)

For zero-touch deploys on every push to `main`, add a GitHub Actions
workflow at `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: deploy
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/qubix
            git pull
            docker compose up -d --build web
            docker image prune -f
```

Add three secrets in **GitHub → Settings → Secrets and variables → Actions**:

| Secret     | Value                                    |
| ---------- | ---------------------------------------- |
| `SSH_HOST` | `<SERVER_IP>`                            |
| `SSH_KEY`  | The **private** key matching the deploy user's `~/.ssh/authorized_keys` |

After this, every `git push origin main` triggers a deploy.

---

## Quick reference — common commands

```bash
# Logs (one-shot)
docker compose logs --tail=100 web

# Logs (follow)
docker compose logs -f web

# Restart a single service
docker compose restart web

# Rebuild + redeploy after code changes
git pull && docker compose up -d --build web

# Reload Nginx after editing nginx/conf.d/*.conf
docker compose exec nginx nginx -s reload

# Force renew SSL
docker compose run --rm certbot renew --force-renewal && \
  docker compose exec nginx nginx -s reload

# Container shell
docker compose exec web sh

# Disk cleanup
docker system prune -af
```

---

## Need help?

Email **[support@qubixsolution.com](mailto:support@qubixsolution.com)**.
