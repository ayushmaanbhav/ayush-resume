#!/bin/bash

# Setup auto-renewal for ayushmaanbhav.me SSL certificates
# Run this script with: sudo bash setup-auto-renewal.sh

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root (use sudo)"
    exit 1
fi

log "Setting up SSL certificate auto-renewal for ayushmaanbhav.me..."

# Copy renewal script to system location
log "Installing renewal script..."
cp /home/vscode/ayush-resume/renew-ayushmaanbhav-cert.sh /usr/local/bin/
chmod +x /usr/local/bin/renew-ayushmaanbhav-cert.sh
log "✓ Renewal script installed to /usr/local/bin/"

# Create log file
log "Creating log file..."
touch /var/log/certbot-renewal-ayushmaanbhav.log
chmod 644 /var/log/certbot-renewal-ayushmaanbhav.log
log "✓ Log file created: /var/log/certbot-renewal-ayushmaanbhav.log"

# Add to root's crontab
log "Setting up cron job..."
# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "renew-ayushmaanbhav-cert.sh"; then
    log "Cron job already exists"
else
    # Add new cron job (runs at 3 AM daily)
    (crontab -l 2>/dev/null || echo ""; echo "0 3 * * * /usr/local/bin/renew-ayushmaanbhav-cert.sh") | crontab -
    log "✓ Cron job added (runs daily at 3 AM)"
fi

# Test the renewal script
log "Testing renewal script..."
if /usr/local/bin/renew-ayushmaanbhav-cert.sh; then
    log "✓ Renewal script test successful"
else
    error "Renewal script test failed (this is normal if certificates don't need renewal yet)"
fi

echo ""
log "🎉 Auto-renewal setup complete!"
echo ""
echo "Details:"
echo "  • Renewal script: /usr/local/bin/renew-ayushmaanbhav-cert.sh"
echo "  • Runs daily at: 3:00 AM"
echo "  • Log file: /var/log/certbot-renewal-ayushmaanbhav.log"
echo "  • On renewal: Pingora will be automatically reloaded"
echo ""
echo "Check cron job:"
echo "  sudo crontab -l"
echo ""
echo "View renewal logs:"
echo "  sudo tail -f /var/log/certbot-renewal-ayushmaanbhav.log"
echo ""
echo "Test renewal manually:"
echo "  sudo /usr/local/bin/renew-ayushmaanbhav-cert.sh"
echo ""
