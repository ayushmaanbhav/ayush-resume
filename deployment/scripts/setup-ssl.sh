#!/bin/bash

# SSL Certificate setup script for ayushmaanbhav.me
echo "Setting up Let's Encrypt SSL certificate..."

# Install certbot if not already installed
sudo apt update
sudo apt install -y certbot

# Get SSL certificate
# Make sure your domain DNS points to this server first!
sudo certbot certonly --standalone -d ayushmaanbhav.me --agree-tos --register-unsafely-without-email

# Update pingora configuration with SSL paths
PINGORA_CONFIG="/etc/pingora/pingora.conf"  # Adjust this path based on your pingora config location

sudo tee -a "$PINGORA_CONFIG" > /dev/null << EOF

# SSL configuration for ayushmaanbhav.me
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ayushmaanbhav.me;

    ssl_certificate /etc/letsencrypt/live/ayushmaanbhav.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ayushmaanbhav.me/privkey.pem;

    # SSL Security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to local static server
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://127.0.0.1:8080;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF

# Test pingora configuration
sudo pingora --test-config  # Adjust command based on your pingora setup

# Reload pingora
sudo systemctl reload pingora

echo "SSL setup complete!"
echo "Don't forget to set up automatic certificate renewal:"
echo "sudo crontab -e"
echo "Add: 0 3 * * * certbot renew --quiet"
