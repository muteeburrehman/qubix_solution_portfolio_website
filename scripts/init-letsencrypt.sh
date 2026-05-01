#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# init-letsencrypt.sh
#
# Bootstraps a Let's Encrypt certificate for qubixsolution.com using webroot
# challenges. Run this ONCE on the Hetzner server, after pointing your DNS A
# records (qubixsolution.com & www.qubixsolution.com) at the server's IP.
#
# Usage:  sudo bash scripts/init-letsencrypt.sh
# ----------------------------------------------------------------------------
set -euo pipefail

DOMAINS=(qubixsolution.com www.qubixsolution.com)
EMAIL="support@qubixsolution.com"   # Used by Let's Encrypt for renewal warnings
STAGING=0                           # 1 = use staging server (for testing)

if ! [ -x "$(command -v docker)" ]; then
  echo "Error: docker is not installed." >&2
  exit 1
fi

DATA_PATH="./certbot"
mkdir -p "$DATA_PATH/conf" "$DATA_PATH/www"

# 1. Create dummy certificate so nginx can start with HTTPS config
echo "### Creating dummy certificate for ${DOMAINS[0]} ..."
DUMMY_PATH="/etc/letsencrypt/live/${DOMAINS[0]}"
mkdir -p "$DATA_PATH/conf/live/${DOMAINS[0]}"
docker compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout '$DUMMY_PATH/privkey.pem' \
    -out '$DUMMY_PATH/fullchain.pem' \
    -subj '/CN=localhost'" certbot

# 2. Start nginx (with HTTPS server block referencing the dummy cert)
echo "### Starting nginx ..."
docker compose up -d nginx web

# 3. Delete the dummy cert
echo "### Deleting dummy certificate ..."
docker compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/${DOMAINS[0]} && \
  rm -Rf /etc/letsencrypt/archive/${DOMAINS[0]} && \
  rm -Rf /etc/letsencrypt/renewal/${DOMAINS[0]}.conf" certbot

# 4. Request the real certificate
DOMAIN_ARGS=""
for d in "${DOMAINS[@]}"; do DOMAIN_ARGS="$DOMAIN_ARGS -d $d"; done

STAGING_ARG=""
if [ "$STAGING" != "0" ]; then STAGING_ARG="--staging"; fi

echo "### Requesting Let's Encrypt certificate for ${DOMAINS[*]} ..."
docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $STAGING_ARG \
    --email $EMAIL \
    $DOMAIN_ARGS \
    --rsa-key-size 4096 \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

echo "### Reloading nginx ..."
docker compose exec nginx nginx -s reload

echo "### Done. Your site should be reachable at https://${DOMAINS[0]}"
