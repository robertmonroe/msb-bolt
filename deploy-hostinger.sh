#!/bin/bash

# MySearchBot™ - Hostinger VPS Deployment Script
# Run this script on your Hostinger VPS

echo "🚀 MySearchBot™ - Hostinger VPS Deployment"
echo "=========================================="

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x (LTS)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx for reverse proxy
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/mysearchbot
sudo chown -R $USER:$USER /var/www/mysearchbot
cd /var/www/mysearchbot

# Clone or upload your files here
echo "📂 Upload your project files to: /var/www/mysearchbot"
echo "   You can use SCP, SFTP, or Git to upload files"

# Install dependencies (run after uploading files)
echo "📦 Installing application dependencies..."
npm install

# Build the frontend
echo "🔨 Building frontend..."
npm run build

# Create environment file
echo "⚙️ Creating environment file..."
cat > .env << EOL
# Production Configuration
NODE_ENV=production
PORT=3001
CONTACT_EMAIL=admin@yourdomain.com

# Optional AI Enhancement (add your keys)
# OPENAI_API_KEY=your_openai_key_here
# HUGGINGFACE_API_KEY=your_huggingface_token_here

# Optional Proxy Configuration
# HTTP_PROXY=http://proxy.example.com:8080
# HTTPS_PROXY=http://proxy.example.com:8080
EOL

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'mysearchbot',
    script: 'server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOL

# Start application with PM2
echo "🚀 Starting application..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
echo "⚙️ Configuring Nginx..."
sudo tee /etc/nginx/sites-available/mysearchbot << EOL
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain
    
    # Serve static files
    location / {
        root /var/www/mysearchbot/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 90s;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOL

# Enable the site
sudo ln -sf /etc/nginx/sites-available/mysearchbot /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your MySearchBot™ is now running on:"
echo "   - Local: http://localhost"
echo "   - Public: http://your-server-ip"
echo "   - Domain: http://your-domain.com (if configured)"
echo ""
echo "📊 Management commands:"
echo "   - View logs: pm2 logs mysearchbot"
echo "   - Restart app: pm2 restart mysearchbot"
echo "   - Stop app: pm2 stop mysearchbot"
echo "   - App status: pm2 status"
echo ""
echo "🔧 Next steps:"
echo "   1. Replace 'your-domain.com' in Nginx config with your actual domain"
echo "   2. Add SSL certificate with: sudo certbot --nginx -d your-domain.com"
echo "   3. Configure your API keys in .env file for AI features"