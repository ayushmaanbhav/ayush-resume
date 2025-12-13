# Quick Start: Deploy ayushmaanbhav.me

## Prerequisites

- Root/sudo access
- Domain DNS configured to point to this server
- Build tools installed (build-essential, cmake, lld)
- Rust toolchain installed
- Node.js and npm installed
- certbot installed

## One-Command Deployment

To deploy everything automatically:

```bash
sudo ./deploy-complete.sh
```

This will:
1. ✅ Build the React application
2. 🔐 Setup SSL certificates with Let's Encrypt (DNS challenge)
3. ⚙️ Install and configure Pingora systemd service
4. 🚀 Start the Pingora server
5. ✔️ Verify the deployment

## Manual Steps (if needed)

### 1. Build React App
```bash
cd resume-app
npm install
npm run build
```

### 2. Setup SSL Certificates
```bash
sudo /home/vscode/pingora/scripts/setup-ayushmaanbhav-cert.sh
```

### 3. Install Pingora Service
```bash
sudo cp /home/vscode/pingora/pingora.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable pingora
sudo systemctl start pingora
```

## Verify Deployment

```bash
# Check Pingora is running
sudo systemctl status pingora

# View logs
sudo journalctl -u pingora -f

# Test website
curl -I https://ayushmaanbhav.me
```

## Common Commands

```bash
# Restart Pingora
sudo systemctl restart pingora

# Stop Pingora
sudo systemctl stop pingora

# Check SSL certificates
sudo certbot certificates

# Update website (after changing React code)
cd resume-app && npm run build
# No restart needed - Pingora serves files directly
```

## Architecture

```
Internet → HTTPS (443) → Pingora → Static Files
                           ↓
                      SSL/TLS Termination
                           ↓
                   ayushmaanbhav.me cert
```

**Key Features:**
- Pingora serves static React build files directly
- SSL certificates auto-renew daily at 3 AM
- Service auto-starts on boot
- Supports multiple domains (banoo.in already configured)

## Troubleshooting

**Pingora won't start?**
```bash
sudo journalctl -u pingora -n 50 --no-pager
```

**SSL certificate issues?**
```bash
sudo certbot certificates
sudo /usr/local/bin/renew-ayushmaanbhav-cert.sh
```

**Website not loading?**
1. Check Pingora is running: `sudo systemctl status pingora`
2. Verify build exists: `ls -la resume-app/build/`
3. Check DNS: `dig ayushmaanbhav.me`

## File Locations

- **Static Files**: `/home/vscode/ayush-resume/resume-app/build/`
- **Pingora Config**: `/home/vscode/pingora/config/`
- **SSL Certs**: `/etc/letsencrypt/live/ayushmaanbhav.me/`
- **Service File**: `/etc/systemd/system/pingora.service`
- **Logs**: `journalctl -u pingora`

## Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete documentation.

## Quick Test

After deployment:
```bash
# Should return HTTP 200
curl -I https://ayushmaanbhav.me

# Should show your resume website
curl https://ayushmaanbhav.me
```

## Support

Check logs if issues occur:
```bash
sudo journalctl -u pingora -f
