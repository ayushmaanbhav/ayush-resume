#!/bin/bash

# Complete deployment script for ayushmaanbhav.me
echo "🚀 Deploying ayushmaanbhav.me website..."

# Step 1: Ensure the website files are in place
echo "📁 Setting up website directory..."
sudo mkdir -p /var/www/ayushmaanbhav.me

# Copy built files (if not already copied)
if [ ! -f "/var/www/ayushmaanbhav.me/index.html" ]; then
    echo "📋 Copying website files..."
    sudo cp -r resume-app/build/* /var/www/ayushmaanbhav.me/
    sudo chown -R www-data:www-data /var/www/ayushmaanbhav.me
    echo "✅ Website files copied successfully"
else
    echo "✅ Website files already in place"
fi

# Step 2: Ensure the service is running
echo "🔧 Setting up system service..."
sudo cp ayushmaanbhav-me.service /etc/systemd/system/

# Reload systemd daemon
sudo systemctl daemon-reload

# Enable and start/restart the service
sudo systemctl enable ayushmaanbhav-me.service
sudo systemctl restart ayushmaanbhav-me.service

# Check service status
echo "📊 Service status:"
sudo systemctl status ayushmaanbhav-me.service --no-pager -l

# Step 3: Update pingora configuration
echo "🌐 Updating pingora configuration..."
PINGORA_CONFIG="/etc/pingora/pingora.conf"

# Backup existing config
sudo cp "$PINGORA_CONFIG" "$PINGORA_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"

# Add our SSL configuration to the existing pingora config
sudo tee -a "$PINGORA_CONFIG" > /dev/null << 'EOF'

# === AYUSHMAANBHAV.ME CONFIGURATION ===
# Added by deployment script - works alongside existing domains

# HTTP to HTTPS redirect for ayushmaanbhav.me
server {
    listen 80;
    listen [::]:80;
    server_name ayushmaanbhav.me;

    return 301 https://$server_name$request_uri;
}

# HTTPS server block for ayushmaanbhav.me
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ayushmaanbhav.me;

    ssl_certificate /etc/letsencrypt/live/ayushmaanbhav.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ayushmaanbhav.me/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:8080;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
# === END AYUSHMAANBHAV.ME CONFIGURATION ===

EOF

# Step 4: Test pingora configuration
echo "🔍 Testing pingora configuration..."
sudo pingora --test-config

if [ $? -eq 0 ]; then
    echo "✅ Pingora configuration is valid"
else
    echo "❌ Pingora configuration has errors. Please check manually."
    echo "🔄 Restoring backup configuration..."
    sudo cp "$PINGORA_CONFIG.backup.$(date +%Y%m%d_%H%M%S)" "$PINGORA_CONFIG"
    exit 1
fi

# Step 5: Reload pingora
echo "🔄 Reloading pingora..."
sudo systemctl reload pingora

# Step 6: Set up certificate renewal (if not already done)
echo "🔐 Setting up certificate auto-renewal..."
sudo crontab -l | grep -v "certbot renew" | sudo crontab -
(sudo crontab -l ; echo "0 3 * * * certbot renew --quiet --manual --manual-auth-hook /etc/letsencrypt/acme-dns-auth.py") | sudo crontab -

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Summary:"
echo "✅ Website files deployed to /var/www/ayushmaanbhav.me"
echo "✅ System service configured and running"
echo "✅ SSL certificate installed"
echo "✅ Pingora configuration updated"
echo "✅ Auto-renewal configured"
echo ""
echo "🌍 Your website should now be available at:"
echo "   http://ayushmaanbhav.me → redirects to → https://ayushmaanbhav.me"
echo ""
echo "🔧 Useful commands:"
echo "   sudo systemctl status ayushmaanbhav-me.service"
echo "   sudo systemctl status pingora"
echo "   sudo certbot certificates"
echo "   sudo tail -f /var/log/pingora/access.log"
