#!/bin/bash

# Fixed SSL Certificate setup script for ayushmaanbhav.me
# Works with existing pingora proxy setup

echo "Setting up Let's Encrypt SSL certificate with existing pingora..."

# Method 1: Use webroot authentication (recommended)
# Create webroot directory for certbot
sudo mkdir -p /var/www/ayushmaanbhav.me/.well-known/acme-challenge

# Set proper ownership
sudo chown -R www-data:www-data /var/www/ayushmaanbhav.me

# Get SSL certificate using webroot method
sudo certbot certonly --webroot -w /var/www/ayushmaanbhav.me -d ayushmaanbhav.me --agree-tos --register-unsafely-without-email

if [ $? -eq 0 ]; then
    echo "SSL certificate obtained successfully!"

    # Update pingora configuration with SSL paths
    echo "Updating pingora configuration..."

    # Find your pingora config file (adjust path if needed)
    PINGORA_CONFIG="/etc/pingora/pingora.conf"

    # Add SSL configuration to pingora (this should be added to your existing config)
    sudo tee -a "$PINGORA_CONFIG" > /dev/null << 'EOF'

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
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://127.0.0.1:8080;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Handle ACME challenge for certificate renewal
    location /.well-known/acme-challenge/ {
        proxy_pass http://127.0.0.1:8080/.well-known/acme-challenge/;
        proxy_set_header Host $host;
    }
}
EOF

    echo "Pingora configuration updated!"
    echo "Please reload pingora to apply changes:"
    echo "sudo systemctl reload pingora"

    # Set up automatic renewal
    echo "Setting up automatic certificate renewal..."
    sudo crontab -l | grep -v "certbot renew" | sudo crontab -
    (sudo crontab -l ; echo "0 3 * * * certbot renew --quiet --webroot -w /var/www/ayushmaanbhav.me") | sudo crontab -

    echo "SSL setup complete!"
    echo "Don't forget to reload pingora: sudo systemctl reload pingora"

else
    echo "SSL certificate generation failed. Trying DNS challenge method..."
    echo "You'll need to create a DNS TXT record for verification."

    # Method 2: DNS challenge (if webroot fails)
    sudo certbot certonly --manual --preferred-challenges dns -d ayushmaanbhav.me --agree-tos --register-unsafely-without-email

    if [ $? -eq 0 ]; then
        echo "Certificate obtained via DNS challenge!"
        echo "Now please add the SSL configuration to your pingora config manually."
    fi
fi
