#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# enable-ssl.sh
#
# Replaces the self-signed dummy certificate (created by the init-certs
# container) with a real Let's Encrypt certificate, then reloads Nginx.
#
# Run this ONCE on the server, after `docker compose up -d`, when:
#   • DNS for qubixsolution.com points to this server
#   • All containers are healthy (`docker compose ps`)
#
# Usage:
#   bash scripts/enable-ssl.sh
#
# Optional:
#   STAGING=1 bash scripts/enable-ssl.sh   # use Let's Encrypt's staging server
# ----------------------------------------------------------------------------
set -euo pipefail

# -------- configuration ------------------------------------------------------
DOMAINS=(qubixsolution.com www.qubixsolution.com)
EMAIL="support@qubixsolution.com"
STAGING="${STAGING:-0}"
# -----------------------------------------------------------------------------

# Move to repo root regardless of where the script is invoked from
cd "$(cd "$(dirname "$0")/.." && pwd)"

step() { printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }
ok()   { printf "\033[1;32m✓\033[0m %s\n" "$1"; }
err()  { printf "\033[1;31m✗ %s\033[0m\n" "$1" >&2; }

# ---------- 1. preflight checks ----------------------------------------------
step "1/4  Preflight checks"

if ! command -v docker >/dev/null 2>&1; then
  err "docker is not installed"; exit 1
fi

if ! docker compose ps --status running --services 2>/dev/null | grep -qx nginx; then
  err "The 'nginx' service is not running. Start the stack first:"
  echo  "      docker compose up -d"
  exit 1
fi

if ! docker compose ps --status running --services 2>/dev/null | grep -qx web; then
  err "The 'web' service is not running. Start the stack first:"
  echo  "      docker compose up -d"
  exit 1
fi

ok "containers are running"

# ---------- 2. remove the dummy / any previous cert --------------------------
step "2/4  Removing dummy certificate (if present)"

PRIMARY="${DOMAINS[0]}"
docker compose run --rm --entrypoint sh certbot -c "
  rm -rf /etc/letsencrypt/live/${PRIMARY} \
         /etc/letsencrypt/archive/${PRIMARY} \
         /etc/letsencrypt/renewal/${PRIMARY}.conf
" >/dev/null

ok "dummy certificate removed"

# ---------- 3. issue the real certificate ------------------------------------
step "3/4  Requesting Let's Encrypt certificate for: ${DOMAINS[*]}"

DOMAIN_ARGS=""
for d in "${DOMAINS[@]}"; do DOMAIN_ARGS="$DOMAIN_ARGS -d $d"; done

STAGING_ARG=""
if [ "$STAGING" = "1" ]; then
  STAGING_ARG="--staging"
  echo "  (using Let's Encrypt STAGING — certs won't be browser-trusted)"
fi

docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  $STAGING_ARG \
  --email "$EMAIL" \
  $DOMAIN_ARGS \
  --rsa-key-size 4096 \
  --agree-tos \
  --no-eff-email \
  --non-interactive

ok "real certificate issued"

# ---------- 4. reload nginx --------------------------------------------------
step "4/4  Reloading Nginx"

docker compose exec nginx nginx -t >/dev/null
docker compose exec nginx nginx -s reload

ok "Nginx reloaded"

printf "\n\033[1;32m✓ All done.\033[0m  Your site is now live at:\n"
printf "    \033[1mhttps://%s\033[0m\n\n" "${DOMAINS[0]}"
printf "Auto-renewal is handled by the 'certbot' container (every 12h).\n"
