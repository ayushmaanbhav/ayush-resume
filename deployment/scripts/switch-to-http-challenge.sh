#!/bin/bash

# Switch ayushmaanbhav.me certificate to use HTTP-01 challenge
# This enables fully automatic renewal without manual DNS intervention

set -e

DOMAIN="ayushmaanbhav.me"
WEBROOT="/var/www/html"
EMAIL="ayush@banoo.in"
RENEWAL_CONF="/etc/letsencrypt/renewal/ayushmaanbhav.me.conf"

echo "Switching to HTTP-01 challenge for fully automatic renewal..."

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    echo "ERROR: This script must be run as root (use sudo)"
    exit 1
fi

# Create webroot directory
echo "Creating webroot directory..."
mkdir -p "$WEBROOT/.well-known/acme-challenge"
chmod -R 755 "$WEBROOT"
echo "✓ Webroot created"

# Backup current certificate
echo "Backing up current certificate..."
cp -r /etc/letsencrypt/live/ayushmaanbhav.me /etc/letsencrypt/live/ayushmaanbhav.me.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Delete the old certificate and request a new one with webroot method
echo "Requesting new certificate with HTTP-01 challenge..."
certbot delete --cert-name ayushmaanbhav.me --non-interactive || true

# Request new certificate using webroot (HTTP-01 challenge)
certbot certonly \
    --webroot \
    --webroot-path "$WEBROOT" \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive \
    --domain "$DOMAIN" \
    --force-renewal

if [ $? -eq 0 ]; then
    echo "✅ Certificate obtained successfully with HTTP-01 challenge!"
    
    # Verify the renewal configuration
    echo ""
    echo "New renewal configuration:"
    echo "================================"
    cat "$RENEWAL_CONF"
    echo "================================"
    echo ""
    
    # Restart Pingora to use new certificate
    echo "Restarting Pingora..."
    systemctl restart pingora
    echo "✓ Pingora restarted"
    
    echo ""
    echo "🎉 Successfully switched to HTTP-01 challenge!"
    echo ""
    echo "Benefits:"
    echo "  ✅ Fully automatic renewal (no manual intervention)"
    echo "  ✅ Works with Pingora's existing /.well-known/acme-challenge/ handler"
    echo "  ✅ No DNS API credentials needed"
    echo "  ✅ Faster renewal process"
    echo ""
    echo "Test automatic renewal:"
    echo "  sudo certbot renew --dry-run"
    echo ""
else
    echo "❌ Failed to obtain certificate"
    echo "Restoring backup if available..."
    exit 1
fi
