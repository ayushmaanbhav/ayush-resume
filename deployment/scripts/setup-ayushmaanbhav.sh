#!/bin/bash

# Setup script for ayushmaanbhav.me website
echo "Setting up ayushmaanbhav.me website..."

# Create web directory
sudo mkdir -p /var/www/ayushmaanbhav.me

# Copy built files to web directory
sudo cp -r resume-app/build/* /var/www/ayushmaanbhav.me/

# Set proper ownership
sudo chown -R www-data:www-data /var/www/ayushmaanbhav.me

# Copy systemd service file
sudo cp ayushmaanbhav-me.service /etc/systemd/system/

# Reload systemd daemon
sudo systemctl daemon-reload

# Enable and start the service
sudo systemctl enable ayushmaanbhav-me.service
sudo systemctl start ayushmaanbhav-me.service

# Install certbot for Let's Encrypt
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (you'll need to configure DNS first)
echo "SSL certificate setup will be done after DNS configuration"
echo "Run the following command after DNS points to this server:"
echo "sudo certbot --nginx -d ayushmaanbhav.me"

echo "Setup complete!"
echo "Service status:"
sudo systemctl status ayushmaanbhav-me.service --no-pager
