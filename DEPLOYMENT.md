# Deployment Guide — Qubix Solutions

Deploy the Qubix Solutions website to a **Hetzner Cloud VPS** (or any Linux
server) in **3 commands** once the server is set up:

```bash
git clone <your-repo-url> /opt/qubix && cd /opt/qubix
docker compose up -d
bash scripts/enable-ssl.sh
```

That's it. The site is live at `https://qubixsolution.com` with
auto-renewing SSL.

> Estimated time for a first-time deploy: **20–30 minutes** (mostly waiting
> for DNS to propagate).

---

## How it works (60-second overview)

`docker compose up -d` launches **four** containers in this order:

1. **`init-certs`** — runs once. If no SSL certificate exists yet, it
   generates a self-signed *dummy* cert so Nginx can start. Exits.
2. **`web`** — Next.js app on port 3000 (internal).
3. **`nginx`** — TLS terminator + reverse proxy on ports 80/443.
4. **`certbot`** — background daemon that auto-renews the SSL cert every
   12 hours.

After the first boot the site is technically reachable, but HTTPS shows a
"not trusted" warning because of the dummy cert. Running
`bash scripts/enable-ssl.sh` swaps it for a real Let's Encrypt cert and
reloads Nginx — done.

---

## Table of contents

1. [Prerequisites](#1-prerequisites)
2. [Provision a Hetzner server](#2-provision-a-hetzner-server)
3. [Configure DNS](#3-configure-dns)
4. [One-time server setup](#4-one-time-server-setup)
5. [The 3-command deploy](#5-the-3-command-deploy)
6. [Verify the deployment](#6-verify-the-deployment)
7. [Updating the site](#7-updating-the-site)
8. [Day-2 operations](#8-day-2-operations)
9. [Backups](#9-backups)
10. [Troubleshooting](#10-troubleshooting)
11. [Rollback](#11-rollback)
12. [Hardening (optional)](#12-hardening-optional)
13. [CI/CD (optional)](#13-cicd-optional)

---

## 1. Prerequisites

- A Hetzner Cloud account (or any VPS provider — DigitalOcean, Linode,
  AWS Lightsail all work identically).
- A domain (`qubixsolution.com`) you control.
- Code pushed to a Git remote (GitHub / GitLab / etc.).
- An SSH key pair on your local machine. If you don't have one:

  ```bash
  ssh-keygen -t ed25519 -C "you@example.com"
  ```

---

## 2. Provision a Hetzner server

1. [console.hetzner.cloud](https://console.hetzner.cloud) → **+ New Project**
   → name it `qubix-solutions`.
2. **+ Add Server**:
   - **Location**: closest to your audience.
   - **Image**: **Ubuntu 24.04**.
   - **Type**: `CX22` (2 vCPU / 4 GB) is plenty for the marketing site.
   - **SSH keys**: paste your `~/.ssh/id_ed25519.pub`.
   - **Name**: `qubix-prod`.
3. Click **Create & Buy now**. Note the public IPv4 → call it `<SERVER_IP>`.
4. *(Optional)* enable **automatic backups** (€1/mo).

---

## 3. Configure DNS

At your registrar (Namecheap / Cloudflare / Hostinger / …) add:

| Type   | Name  | Value                                 | TTL |
| ------ | ----- | ------------------------------------- | --- |
| `A`    | `@`   | `<SERVER_IP>`                         | 300 |
| `A`    | `www` | `<SERVER_IP>`                         | 300 |
| `AAAA` | `@`   | `<SERVER_IPv6>`                       | 300 |
| `AAAA` | `www` | `<SERVER_IPv6>`                       | 300 |
| `CAA`  | `@`   | `0 issue "letsencrypt.org"`           | 300 |

Wait until DNS resolves (usually 1–5 minutes):

```bash
dig +short qubixsolution.com
dig +short www.qubixsolution.com
```

Both should return `<SERVER_IP>`. **Don't continue until they do** — Let's
Encrypt will refuse to issue certs otherwise.

---

## 4. One-time server setup

SSH in and install Docker. **You only do this once per server.**

```bash
ssh root@<SERVER_IP>

apt update && apt upgrade -y
apt install -y curl ca-certificates git ufw

# Official Docker installer
curl -fsSL https://get.docker.com | sh

# Firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

*(Recommended)* create a non-root user for deploys:

```bash
adduser deploy
usermod -aG docker,sudo deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys
# From now on: ssh deploy@<SERVER_IP>
```

---

## 5. The 3-command deploy

SSH in (as `deploy` if you created that user) and run:

### Command 1 — clone and configure

```bash
sudo mkdir -p /opt/qubix && sudo chown $USER:$USER /opt/qubix
git clone https://github.com/<your-org>/qubix-solutions-portfolio.git /opt/qubix
cd /opt/qubix

cp .env.example .env
# Edit .env if needed (defaults are fine for the marketing site):
#   NEXT_PUBLIC_SITE_URL=https://qubixsolution.com
#   NEXT_PUBLIC_SUPPORT_EMAIL=support@qubixsolution.com
```

### Command 2 — start the stack

```bash
docker compose up -d
```

This will:

- Build the Next.js production image (~2 min the first time).
- Generate a self-signed dummy cert (so Nginx can boot).
- Bring up `web`, `nginx`, and the `certbot` renewer.

Verify with:

```bash
docker compose ps
```

You should see `qubix-web` (healthy), `qubix-nginx` (healthy),
`qubix-certbot` (running). At this point the site is reachable on port 80
and on port 443 with an untrusted (dummy) cert.

### Command 3 — issue the real SSL certificate

```bash
bash scripts/enable-ssl.sh
```

Output (approximate):

```
▶ 1/3  Preflight checks
✓ containers are running
▶ 2/3  Requesting Let's Encrypt certificate for: qubixsolution.com www.qubixsolution.com
…
✓ real certificate issued
▶ 3/3  Reloading Nginx
✓ Nginx reloaded

✓ All done.  Your site is now live at:
    https://qubixsolution.com

Auto-renewal is handled by the 'certbot' container (every 12h).
```

The script **does not delete the dummy certificate before issuance** — doing
so would break Nginx’s HTTPS `ssl_certificate` paths and stop the whole
process, so **port 80 would show “connection refused”** to Let’s Encrypt.
Certbot runs with **`--force-renewal`** so the dummy is replaced in place
after a successful challenge.

> **First time setting up SSL?** Run with `STAGING=1` first to test:
> `STAGING=1 bash scripts/enable-ssl.sh`. Let's Encrypt's staging server has
> much higher rate limits. Once that succeeds, run again without `STAGING`
> to issue the real cert.

---

## 6. Verify the deployment

```bash
# HTTPS works and returns 200
curl -I https://qubixsolution.com

# www → apex redirect
curl -I https://www.qubixsolution.com

# Auto-generated SEO endpoints
curl -s https://qubixsolution.com/sitemap.xml | head -10
curl -s https://qubixsolution.com/robots.txt
```

In a browser:

1. Open `https://qubixsolution.com` — padlock icon shown, no warnings.
2. DevTools → **Lighthouse** → Mobile, all categories. Targets:
   - Performance ≥ 95 · Accessibility ≥ 95 · Best Practices ≥ 95 · SEO 100
3. Click the theme toggle in the header — switches light/dark.
4. Submit the contact form — green confirmation card appears.

### SSL grade

Run [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=qubixsolution.com)
— you should get **A** or **A+**.

### Search engines

1. Add the site to
   [Google Search Console](https://search.google.com/search-console).
2. Submit `https://qubixsolution.com/sitemap.xml`.
3. Repeat in [Bing Webmaster Tools](https://www.bing.com/webmasters).

---

## 7. Updating the site

Push your changes locally, then on the server:

```bash
cd /opt/qubix
git pull
docker compose up -d --build web
```

Docker rebuilds the new `web` image and swaps it in — Nginx keeps serving
traffic the whole time, so there's **no downtime** for code changes.

For Nginx config changes:

```bash
docker compose exec nginx nginx -t        # validate
docker compose exec nginx nginx -s reload # apply
```

---

## 8. Day-2 operations

### Logs

```bash
docker compose logs -f web        # Next.js
docker compose logs -f nginx      # access + error
docker compose logs -f certbot    # SSL renewal
```

### Container shell

```bash
docker compose exec web sh
docker compose exec nginx sh
```

### Resource usage

```bash
docker stats
df -h
free -h
```

### Restart everything

```bash
docker compose restart
```

### Stop everything

```bash
docker compose down              # keeps SSL certs and data
docker compose down -v           # also wipes volumes (DESTROYS certs!)
```

### Force certificate renewal

```bash
docker compose run --rm --entrypoint certbot certbot renew --force-renewal
docker compose exec nginx nginx -s reload
```

---

## 9. Backups

The marketing site is stateless — the only on-disk state worth backing up
is `./certbot/conf` (your SSL certs). Two options:

**a)** Enable Hetzner's automatic snapshots (€1/mo) — easiest.

**b)** Daily tarball:

```bash
sudo crontab -e
# Add:
0 3 * * * tar -czf /var/backups/qubix-certs-$(date +\%F).tar.gz /opt/qubix/certbot
```

If you later add a database (e.g. Postgres for the contact form), back up
its named volume the same way.

---

## 10. Troubleshooting

### `docker compose up -d` hangs at the build step

First build downloads ~300 MB of base images and dependencies. On a slow
connection it can take 3–5 min. Watch progress with:

```bash
docker compose build --progress=plain
```

### `enable-ssl.sh` fails with `DNS problem: NXDOMAIN`

Your A records aren't pointing at the server yet. Wait for propagation
(`dig +short qubixsolution.com`), then re-run.

### `enable-ssl.sh` fails with `invalid response … 500` and `Server: hcdn`

That response is **not from this Nginx container**. The header `Server:
hcdn` means **Hetzner’s CDN / proxy** in front of your VPS is answering HTTP
before traffic reaches Docker. Let’s Encrypt asks for
`http://yourdomain/.well-known/acme-challenge/...`; the edge must either
serve the file from disk or **forward the request to your server on port
80**. If the CDN can’t reach origin or has no rule for that path, you get
**500**.

**Fix (pick one):**

1. **Bypass CDN for issuance (simplest)**  
   In your DNS / Hetzner DNS / domain panel, point `qubixsolution.com` and
   `www` with an **A record directly to your VPS public IPv4** (orange
   cloud **off** / **DNS only** if you use Cloudflare). Wait a few minutes,
   then:

   ```bash
   bash scripts/enable-ssl.sh
   ```

   After the certificate is issued, you can turn the CDN back on if your
   setup allows **origin pull to port 443** and still lets HTTP **:80** hit
   origin for renewals (many teams leave `/.well-known/` going to origin).

2. **Keep CDN but fix origin routing**  
   In the Hetzner / CDN panel: ensure **HTTP (port 80)** is enabled to your
   VPS, health checks pass, and there is no blanket “HTTPS only” rule that
   breaks HTTP challenges. Purge cache after fixing Nginx.

**Confirm origin works (on the VPS):**

```bash
echo test > certbot/www/.well-known/acme-challenge/manual-test
curl -i http://127.0.0.1/.well-known/acme-challenge/manual-test -H "Host: qubixsolution.com"
# Expect: 200 and body "test"
```

If localhost is **200** but `curl -i http://qubixsolution.com/...` shows
**500** and `hcdn`, the problem is **only** the CDN layer.

### `nginx: [emerg] host not found in upstream "web:3000"`

The repo’s `nginx/conf.d/qubix.conf` uses **`qubix-web:3000`** (the
`container_name` of the `web` service) so Docker DNS resolves reliably. If
you still see this, run `git pull` then `docker compose up -d nginx`.

### `enable-ssl.sh` fails with `Connection refused` on port 80

Either:

- A firewall is blocking port 80 → `ufw allow 80/tcp`
- Nginx isn't running → `docker compose ps` and `docker compose logs nginx`
- Another service is using port 80 → `sudo lsof -i :80`

### Site shows the default "Welcome to Nginx" page

The custom config didn't mount. Check:

```bash
docker compose exec nginx ls /etc/nginx/conf.d/
docker compose exec nginx cat /etc/nginx/conf.d/qubix.conf
```

### Let’s Encrypt: `connection refused` to `95.x.x.x:80`

Usually **nothing is listening on port 80** (Nginx container crashed or never
started). Common causes:

1. **SSL files were deleted while Nginx still referenced them** — restore and
   retry:

   ```bash
   docker compose run --rm init-certs
   docker compose up -d nginx
   docker compose ps
   ```

   Then run **`bash scripts/enable-ssl.sh`** again (use the current script;
   it no longer removes certs before issuance).

2. **Firewall** — allow HTTP from the internet:

   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw status
   ```

3. **Another process on port 80** — `sudo lsof -i :80` and stop the host
   `nginx`/`apache2` if it conflicts with Docker.

### `502 Bad Gateway`

The Next.js container isn't healthy:

```bash
docker compose ps
docker compose logs web --tail=200
```

Common fixes:

```bash
docker compose up -d --build web   # rebuild
docker compose restart web         # restart
```

### Out of disk space

```bash
docker system df
docker image prune -af
docker builder prune -af
```

### Certificate is still untrusted after running enable-ssl.sh

If you ran with `STAGING=1`, the cert is signed by Let's Encrypt's staging
CA (not browser-trusted). Re-run **without** `STAGING`:

```bash
bash scripts/enable-ssl.sh
```

### Containers won't start because of "permission denied" on `./certbot/conf`

```bash
sudo chown -R $USER:$USER /opt/qubix/certbot
docker compose up -d
```

---

## 11. Rollback

Revert to the last good commit:

```bash
cd /opt/qubix
git log --oneline -10           # find the SHA
git checkout <good-sha>
docker compose up -d --build web
```

To return to `main`:

```bash
git checkout main
docker compose up -d --build web
```

---

## 12. Hardening (optional)

### Disable root SSH

```bash
sudo nano /etc/ssh/sshd_config
#   PermitRootLogin no
#   PasswordAuthentication no
sudo systemctl restart ssh
```

### Unattended security upgrades

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### Fail2Ban

```bash
sudo apt install -y fail2ban
sudo systemctl enable --now fail2ban
```

### Cloudflare in front (optional)

For DDoS protection / free CDN:

1. Add the domain to Cloudflare (free plan).
2. Switch your nameservers at the registrar to Cloudflare's.
3. Set the A records to **Proxied** (orange cloud).
4. SSL/TLS mode: **Full (strict)**.

---

## 13. CI/CD (optional)

Auto-deploy on every push to `main` with GitHub Actions. Create
`.github/workflows/deploy.yml`:

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
      - uses: appleboy/ssh-action@v1.0.3
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

Add secrets in **GitHub → Settings → Secrets and variables → Actions**:

| Secret     | Value                                                        |
| ---------- | ------------------------------------------------------------ |
| `SSH_HOST` | `<SERVER_IP>`                                                |
| `SSH_KEY`  | The **private** key matching the deploy user's authorized_keys |

After this, every `git push origin main` triggers a deploy.

---

## Cheat sheet

```bash
# First-time deploy (3 commands after server setup)
git clone <repo> /opt/qubix && cd /opt/qubix && cp .env.example .env
docker compose up -d
bash scripts/enable-ssl.sh

# Updates
git pull && docker compose up -d --build web

# Logs
docker compose logs -f web
docker compose logs -f nginx

# Restart / reload
docker compose restart
docker compose exec nginx nginx -s reload

# Force SSL renewal
docker compose run --rm --entrypoint certbot certbot renew --force-renewal && \
  docker compose exec nginx nginx -s reload

# Cleanup
docker system prune -af
```

---

Need help? Email **[support@qubixsolution.com](mailto:support@qubixsolution.com)**.
