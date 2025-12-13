# Ayushmaanbhav.me Deployment Guide

This document provides comprehensive information about deploying the ayushmaanbhav.me resume website using Pingora reverse proxy with Let's Encrypt SSL certificates.

## Architecture Overview

The deployment uses the following architecture:

```
Internet → Port 443 (HTTPS) → Pingora Proxy → Static Files (React Build)
                                    ↓
                            SSL/TLS Termination
                                    ↓
                        ayushmaanbhav.me certificate
```

### Key Features

- **Static File Serving**: Pingora directly serves static files from the React build directory
- **HTTPS Support**: Let's Encrypt SSL certificates with automatic renewal
- **Multi-Domain Support**: Pingora serves both banoo.in and ayushmaanbhav.me domains
- **Auto-Start**: Systemd service ensures Pingora starts on boot
- **Security Headers**: Proper security headers (HSTS, X-Frame-Options, etc.)
- **SPA Support**: Client-side routing for React single-page application

## File Structure

```
/home/vscode/
├── ayush-resume/
│   ├── resume-app/
│   │   ├── build/                    # React production build (static files)
│   │   └── src/                      # React source code
│   ├── acme-dns-auth.py              # DNS challenge authentication script
│   ├── deploy-complete.sh            # Main deployment script
│   └── DEPLOYMENT.md                 # This file
│
└── pingora/
    ├── src/
    │   └── main.rs                   # Pingora server code
    ├── config/
    │   ├── pingora.yaml              # Pingora configuration
    │   └── services.yaml             # Service definitions
    ├── scripts/
    │   └── setup-ayushmaanbhav-cert.sh  # SSL certificate setup
    ├── target/release/
    │   └── banoo-pingora             # Compiled Pingora binary
    └── pingora.service               # Systemd service file

/etc/
├── systemd/system/
│   └── pingora.service               # Systemd service (installed)
└── letsencrypt/
    └── live/
        ├── banoo.in/                 # Existing domain certificates
        └── ayushmaanbhav.me/         # New domain certificates
            ├── fullchain.pem
            ├── privkey.pem
            ├── cert.pem
            └── chain.pem
```

## Components

### 1. Pingora Proxy Server

**Location**: `/home/vscode/pingora/src/main.rs`

Pingora is a high-performance reverse proxy written in Rust that:
- Serves static files for ayushmaanbhav.me directly from disk
- Handles SSL/TLS termination for HTTPS
- Proxies requests for banoo.in domains to their respective backends
- Manages ACME challenges for Let's Encrypt

**Key Features**:
- Static file serving with proper MIME types
- Security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
- Cache control for static assets (1 year for JS/CSS/images)
- SPA routing support (serves index.html for non-file routes)
- Multi-domain certificate support

### 2. SSL Certificates

**Location**: `/etc/letsencrypt/live/ayushmaanbhav.me/`

Let's Encrypt certificates are obtained using DNS challenge method:
- **Method**: Manual DNS challenge with acme-dns-auth.py
- **Renewal**: Automatic via cron job (daily at 3 AM)
- **Auto-reload**: Pingora automatically reloads on certificate renewal

**Renewal Script**: `/usr/local/bin/renew-ayushmaanbhav-cert.sh`

### 3. React Application

**Source**: `/home/vscode/ayush-resume/resume-app/`
**Build**: `/home/vscode/ayush-resume/resume-app/build/`

The resume website is built as a static React application:
- Single Page Application (SPA) with client-side routing
- Optimized production build with code splitting
- Responsive design with space-themed background
- Components for resume sections (Experience, Education, Skills, etc.)

### 4. Systemd Service

**Service File**: `/etc/systemd/system/pingora.service`

Ensures Pingora:
- Starts automatically on system boot
- Restarts on failure (with 10-second delay)
- Runs with appropriate capabilities for binding to privileged ports
- Logs to systemd journal

## Deployment Process

### Quick Deployment

Run the complete deployment script:

```bash
sudo bash /home/vscode/ayush-resume/deploy-complete.sh
```

This script will:
1. Verify/build React application
2. Setup SSL certificates (if needed)
3. Install and enable Pingora systemd service
4. Start Pingora
5. Verify deployment

### Manual Deployment

If you prefer step-by-step deployment:

#### Step 1: Build React Application

```bash
cd /home/vscode/ayush-resume/resume-app
npm install
npm run build
```

#### Step 2: Setup SSL Certificates

```bash
sudo bash /home/vscode/pingora/scripts/setup-ayushmaanbhav-cert.sh
```

This uses DNS challenge authentication. You'll need:
- DNS access to create TXT records
- The `acme-dns-auth.py` script properly configured

#### Step 3: Build Pingora

```bash
cd /home/vscode/pingora
cargo build --release
```

#### Step 4: Install Systemd Service

```bash
sudo cp /home/vscode/pingora/pingora.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable pingora
sudo systemctl start pingora
```

#### Step 5: Verify Deployment

```bash
sudo systemctl status pingora
sudo journalctl -u pingora -f
```

## Configuration

### Pingora Configuration

Edit `/home/vscode/pingora/config/pingora.yaml`:

```yaml
---
version: 1
daemon: false
error_log: /var/log/pingora/error.log
pid_file: /var/run/pingora.pid
threads: 4
work_stealing: true
grace_period_seconds: 30
```

### Services Configuration

Edit `/home/vscode/pingora/config/services.yaml` to add/modify services.

### Modifying Pingora Code

If you need to change Pingora behavior:

1. Edit `/home/vscode/pingora/src/main.rs`
2. Rebuild: `cd /home/vscode/pingora && cargo build --release`
3. Restart service: `sudo systemctl restart pingora`

## Management Commands

### Service Management

```bash
# Check status
sudo systemctl status pingora

# Start service
sudo systemctl start pingora

# Stop service
sudo systemctl stop pingora

# Restart service
sudo systemctl restart pingora

# Reload configuration (graceful)
sudo systemctl reload pingora

# View logs
sudo journalctl -u pingora -f

# Enable auto-start
sudo systemctl enable pingora

# Disable auto-start
sudo systemctl disable pingora
```

### SSL Certificate Management

```bash
# View certificates
sudo certbot certificates

# Manual renewal test
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal --cert-name ayushmaanbhav.me

# View renewal logs
sudo cat /var/log/certbot-renewal-ayushmaanbhav.log
```

### Website Updates

To update the website content:

```bash
# 1. Make changes to React source code
cd /home/vscode/ayush-resume/resume-app/src

# 2. Rebuild
npm run build

# 3. Pingora will automatically serve new files (no restart needed)
```

## Troubleshooting

### Pingora Won't Start

Check logs:
```bash
sudo journalctl -u pingora -n 50 --no-pager
```

Common issues:
- Port already in use: Check if another service is using port 80/443
- Permission issues: Ensure Pingora has CAP_NET_BIND_SERVICE capability
- Missing certificates: Verify SSL certificates exist in `/etc/letsencrypt/live/`

### SSL Certificate Issues

Check certificate status:
```bash
sudo certbot certificates
```

Manual renewal:
```bash
sudo /usr/local/bin/renew-ayushmaanbhav-cert.sh
```

### Website Not Loading

1. Check if Pingora is running: `sudo systemctl status pingora`
2. Check if ports are listening: `sudo netstat -tuln | grep -E ':(80|443)'`
3. Check build directory exists: `ls -la /home/vscode/ayush-resume/resume-app/build/`
4. View Pingora logs: `sudo journalctl -u pingora -f`

### DNS Issues

Verify DNS records:
```bash
dig ayushmaanbhav.me
dig ayushmaanbhav.me AAAA
```

### Performance Issues

Check resource usage:
```bash
# CPU and memory
top -p $(pgrep banoo-pingora)

# Network connections
sudo netstat -tnp | grep banoo-pingora
```

## Security Considerations

1. **SSL/TLS**: Only TLS 1.2+ supported, strong cipher suites
2. **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options enabled
3. **File Permissions**: Certificate private keys have 600 permissions
4. **Service Isolation**: Pingora runs with minimal required capabilities
5. **Auto-Updates**: SSL certificates renew automatically

## Monitoring

### Log Locations

- **Pingora**: `sudo journalctl -u pingora`
- **Certificate Renewal**: `/var/log/certbot-renewal-ayushmaanbhav.log`
- **System**: `/var/log/syslog`

### Health Checks

Test website is responding:
```bash
curl -I https://ayushmaanbhav.me
```

Expected response:
```
HTTP/2 200
content-type: text/html; charset=utf-8
x-content-type-options: nosniff
x-frame-options: DENY
x-xss-protection: 1; mode=block
```

## Backup and Recovery

### Backup Checklist

1. **SSL Certificates**: `/etc/letsencrypt/`
2. **Pingora Configuration**: `/home/vscode/pingora/config/`
3. **Website Build**: `/home/vscode/ayush-resume/resume-app/build/`
4. **Systemd Service**: `/etc/systemd/system/pingora.service`

### Recovery Steps

If system fails:

1. Restore configuration files
2. Run deployment script: `sudo bash deploy-complete.sh`
3. Verify DNS points to server
4. If needed, manually obtain certificates: `sudo bash /home/vscode/pingora/scripts/setup-ayushmaanbhav-cert.sh`

## Performance Optimization

Current optimizations:
- Static file caching (1 year for assets)
- HTTP/2 support
- Gzip/Brotli compression (via Pingora)
- Code splitting in React build
- Lazy loading of components

## Future Enhancements

Potential improvements:
- Add monitoring/metrics (Prometheus)
- Implement CDN for global distribution
- Add rate limiting per IP
- Implement access logs analysis
- Add health check endpoints
- Implement blue-green deployments

## Support

For issues or questions:
- Check logs: `sudo journalctl -u pingora -f`
- Review this documentation
- Check Pingora documentation: https://github.com/cloudflare/pingora

## License

This deployment setup is part of the ayushmaanbhav.me resume website project.
