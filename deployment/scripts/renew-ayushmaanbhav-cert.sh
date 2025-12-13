#!/bin/bash

# Certificate renewal script for ayushmaanbhav.me
# Runs daily via cron
# Uses HTTP-01 challenge (fully automatic, no manual intervention)

EMAIL="ayush@banoo.in"
LOG_FILE="/var/log/certbot-renewal-ayushmaanbhav.log"
DOMAIN="ayushmaanbhav.me"

# Log function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Send email notification (placeholder)
send_notification() {
    local subject="$1"
    local message="$2"
    log "EMAIL NOTIFICATION - Subject: $subject - Message: $message"
}

# Run certbot renewal (uses HTTP-01 challenge automatically)
log "Running certbot renewal check for $DOMAIN"
certbot renew --cert-name "$DOMAIN" --quiet

if [ $? -eq 0 ]; then
    log "Certificate renewal check completed successfully"
    # Restart Pingora if it's running (graceful due to 30s grace period)
    if systemctl is-active --quiet pingora; then
        systemctl restart pingora
        log "Pingora restarted gracefully (30s grace period for existing connections)"
    fi
else
    log "Certificate renewal check failed"
    send_notification "Certificate Renewal Failed" "Certbot failed to renew certificates for $DOMAIN"
fi
