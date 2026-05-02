#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# enable-ssl.sh
#
# Obtains a real Let's Encrypt certificate (HTTP-01 webroot) while Nginx keeps
# running with the existing dummy (or old) cert. Do NOT delete certs before
# issuance — Nginx's HTTPS block references those files; removing them first
# makes nginx refuse to start → port 80 "connection refused" for Let's Encrypt.
#
# Run when DNS A for qubixsolution.com (and www) points at this server's IPv4.
#
# Usage:
#   bash scripts/enable-ssl.sh
#
# Optional:
#   STAGING=1 bash scripts/enable-ssl.sh   # Let's Encrypt staging (not browser-trusted)
# ----------------------------------------------------------------------------
set -euo pipefail

# -------- configuration ------------------------------------------------------
DOMAINS=(qubixsolution.com www.qubixsolution.com)
EMAIL="support@qubixsolution.com"
STAGING="${STAGING:-0}"
# -----------------------------------------------------------------------------

cd "$(cd "$(dirname "$0")/.." && pwd)"

step() { printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }
ok()   { printf "\033[1;32m✓\033[0m %s\n" "$1"; }
err()  { printf "\033[1;31m✗\033[0m %s\n" "$1" >&2; }

# ---------- 1. preflight -----------------------------------------------------
step "1/3  Preflight checks"

if ! command -v docker >/dev/null 2>&1; then
  err "docker is not installed"; exit 1
fi

if ! docker compose ps --status running --services 2>/dev/null | grep -qx nginx; then
  err "The 'nginx' service is not running. Start the stack first:"
  echo  "      docker compose run --rm init-certs"
  echo  "      docker compose up -d"
  exit 1
fi

if ! docker compose ps --status running --services 2>/dev/null | grep -qx web; then
  err "The 'web' service is not running. Start the stack first:"
  echo  "      docker compose up -d"
  exit 1
fi

ok "containers are running"

# ---------- 2. issue certificate (keep existing files until LE succeeds) -----
step "2/3  Requesting Let's Encrypt certificate for: ${DOMAINS[*]}"

PRIMARY="${DOMAINS[0]}"
DOMAIN_ARGS=""
for d in "${DOMAINS[@]}"; do DOMAIN_ARGS="$DOMAIN_ARGS -d $d"; done

STAGING_ARG=""
if [ "$STAGING" = "1" ]; then
  STAGING_ARG="--staging"
  echo "  (using Let's Encrypt STAGING — certs won't be browser-trusted)"
fi

# Dummy certs from init-certs create live/<domain>/ but NOT renewal/*.conf.
# Certbot errors with "live directory exists" if we only use --cert-name.
# Move dummy dirs aside once; running nginx keeps old cert files open until reload.
LE_CONF="certbot/conf"
LIVE="${LE_CONF}/live/${PRIMARY}"
RENEWAL="${LE_CONF}/renewal/${PRIMARY}.conf"
ARCHIVE="${LE_CONF}/archive/${PRIMARY}"
if [ -d "$LIVE" ] && [ ! -f "$RENEWAL" ]; then
  ts="$(date +%Y%m%d%H%M%S)"
  echo "  (init-certs dummy detected — moving aside: ${LIVE})"
  mv "$LIVE" "${LIVE}.bak-init-${ts}"
  if [ -d "$ARCHIVE" ]; then
    mv "$ARCHIVE" "${ARCHIVE}.bak-init-${ts}"
  fi
fi

# --force-renewal only when a real LE renewal file exists (re-issue).
FORCE_ARG=""
if [ -f "$RENEWAL" ]; then
  FORCE_ARG="--force-renewal"
  echo "  (existing Let's Encrypt renewal — using --force-renewal)"
fi

docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  $STAGING_ARG \
  --cert-name "$PRIMARY" \
  --email "$EMAIL" \
  $DOMAIN_ARGS \
  --rsa-key-size 4096 \
  --agree-tos \
  --no-eff-email \
  --non-interactive \
  $FORCE_ARG

ok "real certificate issued"

# ---------- 3. reload nginx --------------------------------------------------
step "3/3  Reloading Nginx"

docker compose exec nginx nginx -t >/dev/null
docker compose exec nginx nginx -s reload

ok "Nginx reloaded"

printf "\n\033[1;32m✓ All done.\033[0m  Your site is now live at:\n"
printf "    \033[1mhttps://%s\033[0m\n\n" "${DOMAINS[0]}"
printf "Auto-renewal is handled by the 'certbot' container (every 12h).\n"
