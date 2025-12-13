#!/bin/bash

# Complete deployment script for ayushmaanbhav.me on Pingora
# This script orchestrates the entire setup process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Step 1: Verify React build exists
verify_build() {
    log "Step 1: Verifying React build..."
    
    if [ ! -d "/home/vscode/ayush-resume/resume-app/build" ]; then
        info "Build directory not found. Building React app..."
        cd /home/vscode/ayush-resume/resume-app
        sudo -u vscode npm run build
    else
        info "React build already exists"
    fi
    
    # Verify build has index.html
    if [ ! -f "/home/vscode/ayush-resume/resume-app/build/index.html" ]; then
        error "Build is incomplete - index.html not found"
        exit 1
    fi
    
    log "✓ React build verified"
}

# Step 2: Setup SSL certificates
setup_ssl() {
    log "Step 2: Setting up SSL certificates for ayushmaanbhav.me..."
    
    # Check if certificates already exist
    if [ -d "/etc/letsencrypt/live/ayushmaanbhav.me" ]; then
        warn "SSL certificates already exist for ayushmaanbhav.me"
        read -p "Do you want to renew/recreate them? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "Skipping SSL certificate setup"
            return 0
        fi
    fi
    
    # Make DNS auth script executable
    chmod +x /home/vscode/ayush-resume/acme-dns-auth.py
    
    # Run the certificate setup script
    if [ -f "/home/vscode/pingora/scripts/setup-ayushmaanbhav-cert.sh" ]; then
        chmod +x /home/vscode/pingora/scripts/setup-ayushmaanbhav-cert.sh
        /home/vscode/pingora/scripts/setup-ayushmaanbhav-cert.sh
    else
        error "Certificate setup script not found"
        exit 1
    fi
    
    log "✓ SSL certificates configured"
}

# Step 3: Install and enable Pingora systemd service
setup_pingora_service() {
    log "Step 3: Setting up Pingora systemd service..."
    
    # Check if service is masked and unmask it first
    if systemctl is-enabled pingora.service 2>&1 | grep -q "masked"; then
        warn "Service is masked. Unmasking..."
        systemctl unmask pingora.service
        log "Service unmasked"
    fi
    
    # Copy service file (after unmasking to avoid it being removed)
    if [ -f "/home/vscode/pingora/pingora.service" ]; then
        cp /home/vscode/pingora/pingora.service /etc/systemd/system/
        log "Service file installed"
    else
        error "Pingora service file not found"
        exit 1
    fi
    
    # Reload systemd
    systemctl daemon-reload
    log "Systemd daemon reloaded"
    
    # Enable service
    systemctl enable pingora.service
    log "Pingora service enabled for auto-start"
    
    log "✓ Pingora service configured"
}

# Step 4: Start/Restart Pingora
start_pingora() {
    log "Step 4: Starting Pingora..."
    
    # Check if service is already running
    if systemctl is-active --quiet pingora; then
        warn "Pingora is already running. Restarting..."
        systemctl restart pingora
    else
        systemctl start pingora
    fi
    
    # Wait a moment for service to start
    sleep 2
    
    # Check status
    if systemctl is-active --quiet pingora; then
        log "✓ Pingora started successfully"
    else
        error "Failed to start Pingora"
        systemctl status pingora --no-pager -l
        exit 1
    fi
}

# Step 5: Verify deployment
verify_deployment() {
    log "Step 5: Verifying deployment..."
    
    # Check Pingora status
    info "Pingora service status:"
    systemctl status pingora --no-pager -l | head -n 10
    
    # Check if ports are listening
    info "Checking port bindings..."
    if netstat -tuln 2>/dev/null | grep -q ":80 " || ss -tuln 2>/dev/null | grep -q ":80 "; then
        log "✓ Port 80 (HTTP) is listening"
    else
        warn "Port 80 (HTTP) is not listening"
    fi
    
    if netstat -tuln 2>/dev/null | grep -q ":443 " || ss -tuln 2>/dev/null | grep -q ":443 "; then
        log "✓ Port 443 (HTTPS) is listening"
    else
        warn "Port 443 (HTTPS) is not listening"
    fi
    
    # Check certificate
    if [ -d "/etc/letsencrypt/live/ayushmaanbhav.me" ]; then
        log "✓ SSL certificate exists for ayushmaanbhav.me"
        info "Certificate info:"
        certbot certificates --cert-name ayushmaanbhav.me 2>/dev/null | grep -E "(Certificate Name|Expiry Date|Domains)" || true
    else
        warn "SSL certificate not found for ayushmaanbhav.me"
    fi
    
    log "✓ Deployment verification complete"
}

# Display final summary
display_summary() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "🎉 Deployment Complete!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    info "Your website is now live at:"
    echo "   🌐 https://ayushmaanbhav.me"
    echo ""
    info "Service Details:"
    echo "   • Pingora is running and serving static files directly"
    echo "   • SSL certificates are configured with auto-renewal"
    echo "   • Service will auto-start on system boot"
    echo ""
    info "Useful Commands:"
    echo "   sudo systemctl status pingora      # Check Pingora status"
    echo "   sudo systemctl restart pingora     # Restart Pingora"
    echo "   sudo systemctl stop pingora        # Stop Pingora"
    echo "   sudo journalctl -u pingora -f      # View Pingora logs"
    echo "   sudo certbot certificates          # Check SSL certificates"
    echo ""
    info "File Locations:"
    echo "   Static Files: /home/vscode/ayush-resume/resume-app/build"
    echo "   Pingora Config: /home/vscode/pingora/config/"
    echo "   SSL Certificates: /etc/letsencrypt/live/ayushmaanbhav.me/"
    echo "   Pingora Binary: /home/vscode/pingora/target/release/banoo-pingora"
    echo ""
    info "Auto-Renewal:"
    echo "   SSL certificates will automatically renew via cron job"
    echo "   Check renewal logs: /var/log/certbot-renewal-ayushmaanbhav.log"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Main function
main() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "Starting Complete Deployment for ayushmaanbhav.me"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    check_root
    verify_build
    setup_ssl
    setup_pingora_service
    start_pingora
    verify_deployment
    display_summary
}

# Run main function
main "$@"
