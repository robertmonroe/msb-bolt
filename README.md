# MySearchBot™ - Multi-Engine Search Platform

A privacy-focused search engine that queries multiple search engines simultaneously and provides AI-enhanced summaries.

## 🚀 Quick Start

### Option 1: Frontend Only (Current Live Demo)
The frontend is already deployed and working with mock data at:
**https://rainbow-capybara-01afc3.netlify.app**

### Option 2: Full Setup with Real Backend

## 🌐 Backend Deployment (Choose One)

### Railway Deployment (Recommended - Free Tier Available)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub account

2. **Deploy Backend**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Fork this repository to your GitHub first
   - Select your forked repository
   - Railway will automatically detect Node.js and deploy

3. **Configure Environment Variables** (Optional but recommended)
   - In Railway dashboard, go to your project
   - Click "Variables" tab
   - Add these variables:
     ```
     NODE_ENV=production
     PORT=3001
     CONTACT_EMAIL=your-email@domain.com
     OPENAI_API_KEY=sk-your-openai-key-here (optional)
     HUGGINGFACE_API_KEY=hf_your-huggingface-token (optional)
     ```

4. **Get Your Backend URL**
   - Railway will provide a URL like: `https://mysearchbot-production-xxxx.up.railway.app`
   - Copy this URL

### Render Deployment (Alternative Free Option)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub account

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub account
   - Select your forked repository

3. **Configure Build Settings**
   - **Name**: mysearchbot-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run server`
   - **Instance Type**: Free

4. **Add Environment Variables** (Optional)
   - In Render dashboard, go to Environment tab
   - Add the same variables as Railway above

5. **Deploy and Get URL**
   - Click "Create Web Service"
   - Render will provide a URL like: `https://mysearchbot-backend-xxxx.onrender.com`

### Heroku Deployment (Paid Option)

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   
   # Ubuntu/Debian
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Deploy to Heroku**
   ```bash
   # Clone your fork
   git clone https://github.com/yourusername/mysearchbot.git
   cd mysearchbot
   
   # Login to Heroku
   heroku login
   
   # Create Heroku app
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set CONTACT_EMAIL=your-email@domain.com
   
   # Deploy
   git push heroku main
   
   # Get your URL
   heroku open
   ```

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18 or higher
- npm 8 or higher

### Setup Steps
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/mysearchbot.git
cd mysearchbot

# 2. Install dependencies
npm install

# 3. Create environment file (optional)
cp .env.example .env
# Edit .env with your API keys if you have them

# 4. Start both frontend and backend
npm run dev:full
```

This will start:
- Frontend at: http://localhost:5173
- Backend at: http://localhost:3001

### Development Commands
```bash
# Start only frontend (with mock data)
npm run dev

# Start only backend
npm run dev:server

# Build for production
npm run build

# Start production server
npm run server
```

## 🔑 API Keys Setup (Optional - For AI Summaries)

### OpenAI API Key (Recommended)

1. **Create OpenAI Account**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Sign up and verify your phone number
   - New accounts get $5 free credit

2. **Get API Key**
   - Go to [API Keys page](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)

3. **Add to Environment**
   - Railway/Render: Add `OPENAI_API_KEY=sk-your-key` in dashboard
   - Local: Add to `.env` file

### HuggingFace Token (Free Alternative)

1. **Create HuggingFace Account**
   - Go to [huggingface.co](https://huggingface.co)
   - Sign up for free account

2. **Get Access Token**
   - Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
   - Click "New token"
   - Select "Read" permissions
   - Copy the token (starts with `hf_`)

3. **Add to Environment**
   - Add `HUGGINGFACE_API_KEY=hf_your-token` to your deployment

## 🔗 Connect Frontend to Backend

### Update API Configuration

1. **Edit API Configuration**
   - Open `src/services/api.ts`
   - Replace the API_BASE_URL:
   ```typescript
   const API_BASE_URL = 'https://your-backend-url.railway.app/api';
   // or
   const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
   ```

2. **Redeploy Frontend**
   - Commit changes to GitHub
   - Netlify will automatically redeploy
   - Or manually trigger deploy in Netlify dashboard

## 🐳 Docker Deployment (Advanced)

### Quick Docker Setup
```bash
# Build and run
docker build -t mysearchbot .
docker run -d -p 3001:3001 --name mysearchbot mysearchbot

# Or use docker-compose
docker-compose up -d
```

### VPS Deployment with Docker
```bash
# On your VPS
git clone https://github.com/yourusername/mysearchbot.git
cd mysearchbot

# Create .env file
nano .env
# Add your environment variables

# Deploy with docker-compose
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

## 🔍 Search Engine Configuration

### Reliability Ranking
1. **DuckDuckGo** ✅ - Most reliable, rarely blocks
2. **Mojeek** ✅ - Independent, good for automation
3. **Bing** ⚠️ - Good results, occasional blocking
4. **Brave** ⚠️ - Privacy-focused, limited automation
5. **Yahoo** ⚠️ - Decent results, anti-bot protection
6. **Google** ❌ - Best results, strong anti-bot measures

### Expected Behavior
- **Real Results**: DuckDuckGo and Mojeek typically work
- **Fallback Links**: Other engines may show direct search links
- **This is normal**: Search engines protect against automation

## 🛠️ Troubleshooting

### Backend Issues

**"API Offline" Message**
1. Check your backend deployment logs
2. Verify the backend URL in `src/services/api.ts`
3. Test health endpoint: `https://your-backend-url/api/health`

**Deployment Failed**
1. Check build logs in Railway/Render dashboard
2. Ensure Node.js version is 18+
3. Verify package.json scripts are correct

### Frontend Issues

**Search Not Working**
1. Open browser developer tools (F12)
2. Check Console tab for errors
3. Verify API URL is correct
4. Check Network tab for failed requests

**CORS Errors**
1. Ensure backend CORS is configured for your frontend domain
2. Check that API URL includes `/api` path
3. Verify backend is running and accessible

### Search Engine Issues

**No Real Results**
1. This is normal - search engines block automation
2. DuckDuckGo and Mojeek are most reliable
3. Direct search links are provided as fallback
4. Consider adding proxy configuration for better access

## 💰 Cost Breakdown

### Free Tier (Recommended for Testing)
- **Frontend**: Netlify (Free)
- **Backend**: Railway (500 hours/month free)
- **AI**: HuggingFace (Free tier)
- **Total**: $0/month

### Production Tier
- **Frontend**: Netlify (Free)
- **Backend**: Railway Pro ($5/month) or Render ($7/month)
- **AI**: OpenAI ($10-20/month based on usage)
- **Total**: $15-27/month

## 📊 Monitoring

### Health Checks
```bash
# Check if backend is running
curl https://your-backend-url/api/health

# Expected response
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "2.1.0"
}
```

### Performance Monitoring
- Railway: Built-in metrics dashboard
- Render: Resource usage in dashboard
- Heroku: Heroku metrics add-on

## 🔒 Security & Privacy

### Built-in Security
- Rate limiting (50 requests/minute per IP)
- Input validation and sanitization
- CORS protection
- No user data storage
- No search query logging

### Privacy Features
- No tracking cookies
- No user analytics
- No data collection
- Direct search engine links
- Client-side processing

## 🤝 Support

### Getting Help
1. **Check this README** - Most issues are covered here
2. **GitHub Issues** - Create detailed issue with logs
3. **Deployment Logs** - Check Railway/Render dashboard
4. **Browser Console** - Check for JavaScript errors

### Common Solutions
- **API Offline**: Redeploy backend, check environment variables
- **No Results**: Normal behavior, use direct search links
- **CORS Errors**: Verify API URL configuration
- **Build Failures**: Check Node.js version and dependencies

---

## 🎯 Next Steps

1. **Deploy Backend**: Choose Railway, Render, or Heroku
2. **Get API Keys**: OpenAI or HuggingFace for AI summaries
3. **Update Frontend**: Configure API URL and redeploy
4. **Test Everything**: Verify search and AI summaries work
5. **Monitor**: Check logs and performance

**Live Demo**: https://rainbow-capybara-01afc3.netlify.app

**Repository**: Fork this repo to get started with your own deployment

---

*MySearchBot™ - Search It Your Way™*