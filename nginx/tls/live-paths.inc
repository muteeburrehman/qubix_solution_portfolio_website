# Overwritten by scripts/enable-ssl.sh after Let's Encrypt issuance when the
# active lineage is not live/<primary>/ (e.g. qubixsolution.com-0001).
# Default matches init-certs dummy layout until first successful certbot run.
ssl_certificate     /etc/letsencrypt/live/qubixsolution.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/qubixsolution.com/privkey.pem;
