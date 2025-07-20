# 🚀 Hostinger VPS Deployment Guide

## Quick Deploy (5 Minutes)

### Step 1: Connect to Your VPS
```bash
ssh root@your-vps-ip
# Or use Hostinger's web terminal
```

### Step 2: Upload Files
**Option A: Direct Upload**
1. Download all project files as ZIP
2. Upload via Hostinger File Manager
3. Extract to `/var/www/mysearchbot`

**Option B: Git Clone**
```bash
git clone https://github.com/your-username/mysearchbot.git /var/www/mysearchbot
cd /var/www/mysearchbot
```

**Option C: SCP Upload**
```bash
# From your local machine
scp -r ./mysearchbot root@your-vps-ip:/var/www/
```

### Step 3: Run Deployment Script
```bash
cd /var/www/mysearchbot
chmod +x deploy-hostinger.sh
./deploy-hostinger.sh
```

### Step 4: Configure Domain (Optional)
```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/mysearchbot

# Replace 'your-domain.com' with your actual domain
# Then restart Nginx
sudo systemctl restart nginx
```

### Step 5: Add SSL Certificate (Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Manual Deployment Steps

If you prefer manual setup:

### 1. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 and Nginx
sudo npm install -g pm2
sudo apt install -y nginx
```

### 2. Setup Application
```bash
# Create directory
sudo mkdir -p /var/www/mysearchbot
sudo chown -R $USER:$USER /var/www/mysearchbot
cd /var/www/mysearchbot

# Upload your files here
# Then install dependencies
npm install
npm run build
```

### 3. Configure Environment
```bash
# Create .env file
cat > .env << EOL
NODE_ENV=production
PORT=3001
CONTACT_EMAIL=admin@yourdomain.com
EOL
```

### 4. Start with PM2
```bash
# Start application
pm2 start server/index.js --name mysearchbot
pm2 save
pm2 startup
```

### 5. Configure Nginx
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/mysearchbot
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/mysearchbot/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/mysearchbot /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## Hostinger-Specific Tips

### VPS Control Panel
- Use Hostinger's VPS control panel to manage your server
- Monitor resource usage (CPU, RAM, disk)
- Set up automatic backups

### Domain Configuration
1. Point your domain to your VPS IP in Hostinger DNS
2. Add A record: `@` → `your-vps-ip`
3. Add CNAME record: `www` → `your-domain.com`

### SSL Certificate
```bash
# Free SSL with Let's Encrypt
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall Setup
```bash
# Configure UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Management Commands

### Application Management
```bash
# View application status
pm2 status

# View logs
pm2 logs mysearchbot

# Restart application
pm2 restart mysearchbot

# Stop application
pm2 stop mysearchbot

# Update application
cd /var/www/mysearchbot
git pull  # if using git
npm install
npm run build
pm2 restart mysearchbot
```

### Server Management
```bash
# Check Nginx status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# Check server resources
htop
df -h
free -h
```

## Troubleshooting

### Common Issues

**Port 3001 already in use:**
```bash
sudo lsof -i :3001
sudo kill -9 <PID>
pm2 restart mysearchbot
```

**Nginx configuration error:**
```bash
sudo nginx -t
# Fix errors shown, then:
sudo systemctl restart nginx
```

**Application won't start:**
```bash
pm2 logs mysearchbot
# Check logs for errors
```

**Domain not working:**
1. Check DNS propagation: `nslookup your-domain.com`
2. Verify Nginx config: `sudo nginx -t`
3. Check firewall: `sudo ufw status`

### Performance Optimization

**For high traffic:**
```bash
# Increase PM2 instances
pm2 scale mysearchbot 2

# Optimize Nginx
sudo nano /etc/nginx/nginx.conf
# Increase worker_processes and worker_connections
```

**Monitor resources:**
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor in real-time
htop
pm2 monit
```

## Success Checklist

✅ **VPS Setup Complete**
- [ ] Node.js 18 installed
- [ ] PM2 installed and configured
- [ ] Nginx installed and configured
- [ ] Firewall configured

✅ **Application Deployed**
- [ ] Files uploaded to `/var/www/mysearchbot`
- [ ] Dependencies installed (`npm install`)
- [ ] Frontend built (`npm run build`)
- [ ] Backend running with PM2

✅ **Web Server Configured**
- [ ] Nginx serving static files
- [ ] API proxy working
- [ ] Domain pointing to VPS (if applicable)
- [ ] SSL certificate installed (recommended)

✅ **Testing**
- [ ] Website loads at `http://your-domain.com`
- [ ] Search functionality works
- [ ] API endpoints respond
- [ ] No console errors

## Cost Estimate

**Hostinger VPS Pricing:**
- VPS 1: ~$3.99/month (1 vCPU, 1GB RAM) - Perfect for this app
- VPS 2: ~$8.99/month (2 vCPU, 2GB RAM) - For higher traffic
- Domain: ~$8.99/year (optional)

**Total: ~$4-9/month** for a fully functional search engine!

## Support

If you encounter issues:
1. Check the logs: `pm2 logs mysearchbot`
2. Verify Nginx: `sudo nginx -t`
3. Check firewall: `sudo ufw status`
4. Monitor resources: `htop`

Your MySearchBot™ will be live and accessible worldwide! 🌍