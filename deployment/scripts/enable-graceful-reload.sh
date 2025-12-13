#!/bin/bash

# Enable graceful reload for Pingora (zero-downtime certificate updates)

set -e

echo "Enabling graceful reload for Pingora..."

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    echo "ERROR: This script must be run as root (use sudo)"
    exit 1
fi

echo "Step 1: Updating Pingora config to enable daemon mode..."
cp /home/vscode/pingora/config/pingora.yaml /home/vscode/pingora/config/pingora.yaml.backup.$(date +%Y%m%d_%H%M%S)
# The config has already been updated via the script
echo "✓ Config updated (daemon: true)"

echo "Step 2: Updating systemd service file..."
cp /home/vscode/pingora/pingora.service /etc/systemd/system/pingora.service
echo "✓ Service file updated (Type=forking with reload support)"

echo "Step 3: Reloading systemd daemon..."
systemctl daemon-reload
echo "✓ Systemd reloaded"

echo "Step 4: Updating renewal script..."
cp /home/vscode/ayush-resume/renew-ayushmaanbhav-cert.sh /usr/local/bin/
chmod +x /usr/local/bin/renew-ayushmaanbhav-cert.sh
echo "✓ Renewal script updated"

echo "Step 5: Restarting Pingora with new configuration..."
systemctl restart pingora
sleep 2

echo "Step 6: Verifying service status..."
if systemctl is-active --quiet pingora; then
    echo "✓ Pingora is running"
else
    echo "❌ Pingora failed to start"
    systemctl status pingora --no-pager -l
    exit 1
fi

echo ""
echo "🎉 Graceful reload enabled!"
echo ""
echo "What changed:"
echo "  ✅ Pingora runs with -u flag (upgrade mode enabled)"
echo "  ✅ systemctl reload pingora → sends SIGHUP for graceful reload"
echo "  ✅ Zero-downtime certificate updates"
echo "  ✅ Existing connections complete before reload"
echo "  ✅ upgrade_sock configured in pingora.yaml for seamless handoff"
echo ""
echo "Test graceful reload:"
echo "  sudo systemctl reload pingora"
echo ""
echo "Verify it works:"
echo "  # In one terminal:"
echo "  sudo journalctl -u pingora -f"
echo ""
echo "  # In another terminal:"
echo "  sudo systemctl reload pingora"
echo ""
echo "You should see graceful reload happening with no connection drops!"
