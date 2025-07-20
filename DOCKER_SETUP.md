# 🐳 Docker Deployment Preparation Guide

## Prerequisites

### 1. Install Docker & Docker Compose

**Ubuntu/Debian:**
```bash
# Update package index
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin

# Add your user to docker group (optional, avoids sudo)
sudo usermod -aG docker $USER
newgrp docker
```

**CentOS/RHEL:**
```bash
# Install Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

**macOS:**
```bash
# Install Docker Desktop
brew install --cask docker
# Or download from: https://www.docker.com/products/docker-desktop
```

**Windows:**
```bash
# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop
# Or use WSL2 with Ubuntu and follow Linux instructions
```

### 2. Verify Installation

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker compose version

# Test Docker (should print "Hello from Docker!")
docker run hello-world
```

## Deployment Steps

### Option 1: Quick Deploy (Recommended)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd mysearchbot

# 2. Deploy with Docker Compose
docker compose up -d

# 3. Check status
docker compose ps

# 4. View logs (optional)
docker compose logs -f
```

**That's it!** Your search engine will be available at:
- **Local**: http://localhost:3001
- **VPS**: http://your-server-ip:3001

### Option 2: Custom Configuration

```bash
# 1. Clone and enter directory
git clone <your-repo-url>
cd mysearchbot

# 2. Create custom environment file
cp .env.example .env

# 3. Edit configuration (optional)
nano .env
```

**Example .env configuration:**
```bash
# Basic Configuration
NODE_ENV=production
PORT=3001
CONTACT_EMAIL=admin@yourdomain.com

# AI Enhancement (Optional)
OPENAI_API_KEY=sk-your-openai-key-here
HUGGINGFACE_API_KEY=hf_your-huggingface-token

# Proxy Configuration (Optional - for better Google access)
HTTP_PROXY=http://proxy.example.com:8080
HTTPS_PROXY=http://proxy.example.com:8080
```

```bash
# 4. Deploy with custom config
docker compose up -d

# 5. Verify deployment
curl http://localhost:3001/api/health
```

### Option 3: Production VPS Deployment

```bash
# 1. Connect to your VPS
ssh user@your-server-ip

# 2. Clone repository
git clone <your-repo-url>
cd mysearchbot

# 3. Configure firewall (if needed)
sudo ufw allow 3001/tcp
sudo ufw reload

# 4. Deploy
docker compose up -d

# 5. Set up reverse proxy (optional)
# See nginx configuration below
```

## Configuration Options

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `production` |
| `PORT` | Server port | No | `3001` |
| `CONTACT_EMAIL` | Contact for polite scraping | Recommended | `admin@mysearchbot.com` |
| `OPENAI_API_KEY` | OpenAI API key for AI summaries | No | - |
| `HUGGINGFACE_API_KEY` | HuggingFace token for AI | No | - |
| `HTTP_PROXY` | HTTP proxy for better access | No | - |
| `HTTPS_PROXY` | HTTPS proxy for better access | No | - |

### Custom Port

```bash
# Deploy on custom port (e.g., 8080)
PORT=8080 docker compose up -d
```

### Custom Domain with Nginx

Create `/etc/nginx/sites-available/mysearchbot`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
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
sudo nginx -t
sudo systemctl reload nginx

# Optional: Add SSL with Let's Encrypt
sudo certbot --nginx -d yourdomain.com
```

## Management Commands

### View Status
```bash
# Check if containers are running
docker compose ps

# View resource usage
docker stats

# Check health
curl http://localhost:3001/api/health
```

### View Logs
```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View last 100 lines
docker compose logs --tail=100
```

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker compose down
docker compose up -d --build

# Or force rebuild
docker compose build --no-cache
docker compose up -d
```

### Stop/Start
```bash
# Stop application
docker compose down

# Start application
docker compose up -d

# Restart application
docker compose restart
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3001
sudo lsof -i :3001

# Kill process if needed
sudo kill -9 <PID>

# Or use different port
PORT=8080 docker compose up -d
```

### Permission Issues
```bash
# Fix Docker permissions
sudo chown -R $USER:$USER .
sudo chmod +x docker-compose.yml

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Container Won't Start
```bash
# Check detailed logs
docker compose logs mysearchbot

# Check Docker daemon
sudo systemctl status docker

# Restart Docker if needed
sudo systemctl restart docker
```

### Memory Issues
```bash
# Check available memory
free -h

# Check Docker memory usage
docker stats

# Clean up unused containers/images
docker system prune -a
```

## Resource Requirements

### Minimum Requirements
- **RAM**: 512MB
- **CPU**: 1 vCPU
- **Storage**: 1GB free space
- **OS**: Any Linux with Docker support

### Recommended for Production
- **RAM**: 1GB+
- **CPU**: 2 vCPU
- **Storage**: 5GB+ free space
- **Network**: Stable internet connection

## Security Considerations

### Basic Security
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3001/tcp  # Only if not using reverse proxy
```

### Production Security
- Use reverse proxy (Nginx/Apache)
- Enable SSL/TLS with Let's Encrypt
- Regular security updates
- Monitor logs for suspicious activity
- Consider rate limiting at proxy level

## Performance Optimization

### For High Traffic
```bash
# Increase container resources in docker-compose.yml
services:
  mysearchbot:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
```

### Monitoring
```bash
# Monitor in real-time
watch docker stats

# Check application health
watch curl -s http://localhost:3001/api/health
```

## Success Indicators

✅ **Deployment Successful When:**
- `docker compose ps` shows container as "Up"
- `curl http://localhost:3001/api/health` returns `{"status":"OK"}`
- Web interface loads at http://localhost:3001
- Search functionality works with multiple engines
- No error messages in `docker compose logs`

🎉 **You're Ready!** Your MySearchBot™ instance is now running and ready to handle search requests.