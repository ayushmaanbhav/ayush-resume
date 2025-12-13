#!/bin/bash

# Fix certbot renewal configuration for ayushmaanbhav.me
# This adds the manual-auth-hook to the renewal config

set -e

RENEWAL_CONF="/etc/letsencrypt/renewal/ayushmaanbhav.me.conf"
AUTH_HOOK="/home/vscode/ayush-resume/acme-dns-auth.py"

echo "Fixing certbot renewal configuration..."

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    echo "ERROR: This script must be run as root (use sudo)"
    exit 1
fi

# Check if renewal config exists
if [ ! -f "$RENEWAL_CONF" ]; then
    echo "ERROR: Renewal config not found at $RENEWAL_CONF"
    exit 1
fi

# Check if auth hook exists
if [ ! -f "$AUTH_HOOK" ]; then
    echo "ERROR: Auth hook script not found at $AUTH_HOOK"
    exit 1
fi

# Make auth hook executable
chmod +x "$AUTH_HOOK"

# Backup the original config
cp "$RENEWAL_CONF" "$RENEWAL_CONF.backup.$(date +%Y%m%d_%H%M%S)"
echo "✓ Backed up original config"

# Add manual_auth_hook to the renewalparams section if not present
if grep -q "manual_auth_hook" "$RENEWAL_CONF"; then
    echo "✓ manual_auth_hook already present"
else
    # Add the auth hook after the authenticator line
    sed -i "/authenticator = manual/a manual_auth_hook = $AUTH_HOOK" "$RENEWAL_CONF"
    echo "✓ Added manual_auth_hook to config"
fi

echo ""
echo "Updated renewal configuration:"
echo "================================"
cat "$RENEWAL_CONF"
echo "================================"
echo ""
echo "✅ Configuration fixed!"
echo ""
echo "Test renewal with:"
echo "  sudo certbot renew --dry-run --cert-name ayushmaanbhav.me"
