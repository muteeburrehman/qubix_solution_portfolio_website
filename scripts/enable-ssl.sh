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
#   bash scripts/enable-ssl.sh --sync-tls-only   # only refresh nginx/tls/live-paths.inc + reload (no certbot)
#
# Optional:
#   STAGING=1 bash scripts/enable-ssl.sh   # Let's Encrypt staging (not browser-trusted)
# ----------------------------------------------------------------------------
set -euo pipefail

# -------- configuration ------------------------------------------------------
DOMAINS=(qubixsolution.com www.qubixsolution.com)
PRIMARY="${DOMAINS[0]}"
EMAIL="support@qubixsolution.com"
STAGING="${STAGING:-0}"
LE_CONF="certbot/conf"
# -----------------------------------------------------------------------------

cd "$(cd "$(dirname "$0")/.." && pwd)"

step() { printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }
ok()   { printf "\033[1;32m✓\033[0m %s\n" "$1"; }
err()  { printf "\033[1;31m✗\033[0m %s\n" "$1" >&2; }

# Certbot may store certs under live/<primary>-0001/ when a name collision
# occurred; nginx must load those paths, not stale live/<primary>/ files.
pick_le_lineage() {
  local cert name dir="${LE_CONF}/live"
  [ -d "$dir" ] || return 1
  local names=("$PRIMARY")
  shopt -s nullglob
  for cert in "${dir}/${PRIMARY}"-*; do
    [ -d "$cert" ] || continue
    names+=("$(basename "$cert")")
  done
  shopt -u nullglob
  for name in "${names[@]}"; do
    cert="${dir}/${name}/fullchain.pem"
    [ -f "$cert" ] || continue
    if openssl x509 -in "$cert" -noout -issuer 2>/dev/null | grep -q "Let's Encrypt"; then
      printf '%s' "$name"
      return 0
    fi
  done
  return 1
}

write_nginx_tls_paths() {
  mkdir -p nginx/tls
  local lineage
  if lineage="$(pick_le_lineage)"; then
    cat > nginx/tls/live-paths.inc <<EOF
ssl_certificate     /etc/letsencrypt/live/${lineage}/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/${lineage}/privkey.pem;
EOF
    echo "  (nginx TLS -> /etc/letsencrypt/live/${lineage}/)"
  else
    err "Could not find a Let's Encrypt fullchain under ${LE_CONF}/live/ (install openssl on the host)."
    exit 1
  fi
}

if [ "${1:-}" = "--sync-tls-only" ]; then
  if ! command -v docker >/dev/null 2>&1; then
    err "docker is not installed"; exit 1
  fi
  if ! command -v openssl >/dev/null 2>&1; then
    err "openssl is required (e.g. apt install openssl)"; exit 1
  fi
  if ! docker compose ps --status running --services 2>/dev/null | grep -qx nginx; then
    err "The 'nginx' service is not running."; exit 1
  fi
  step "Sync nginx TLS paths from ${LE_CONF}/live (no certbot)"
  write_nginx_tls_paths
  step "Reloading Nginx"
  docker compose exec nginx nginx -t >/dev/null
  docker compose exec nginx nginx -s reload
  ok "TLS paths synced and Nginx reloaded"
  exit 0
fi

# ---------- 1. preflight -----------------------------------------------------
step "1/3  Preflight checks"

if ! command -v docker >/dev/null 2>&1; then
  err "docker is not installed"; exit 1
fi

if ! command -v openssl >/dev/null 2>&1; then
  err "openssl is required after issuance to detect the active cert lineage (e.g. apt install openssl)"
  exit 1
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

# ---------- 2b. point nginx at the lineage Certbot actually uses ------------
write_nginx_tls_paths

# ---------- 3. reload nginx --------------------------------------------------
step "3/3  Reloading Nginx"

docker compose exec nginx nginx -t >/dev/null
docker compose exec nginx nginx -s reload

ok "Nginx reloaded"

printf "\n\033[1;32m✓ All done.\033[0m  Your site is now live at:\n"
printf "    \033[1mhttps://%s\033[0m\n\n" "${DOMAINS[0]}"
printf "Auto-renewal is handled by the 'certbot' container (every 12h).\n"
