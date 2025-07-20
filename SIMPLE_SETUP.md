# 🚀 MySearchBot™ - Simple Setup

## Like SearXNG, but with AI summaries and modern UI

### 1-Command Setup

```bash
# Clone and run
git clone <your-repo>
cd mysearchbot
docker-compose up -d
```

**That's it!** Visit http://localhost:3001

### Alternative: Manual Setup

```bash
git clone <your-repo>
cd mysearchbot
npm install
npm run build
npm start
```

### Deploy to VPS

```bash
# On your server
git clone <your-repo>
cd mysearchbot
docker-compose up -d

# Or with custom port
PORT=8080 docker-compose up -d
```

### Configuration (Optional)

Create `.env` file:
```bash
CONTACT_EMAIL=admin@yourdomain.com
OPENAI_API_KEY=sk-your-key-here  # Optional for AI summaries
```

### Features Out of the Box

- ✅ 6 search engines (DuckDuckGo, Bing, Brave, etc.)
- ✅ AI-powered summaries
- ✅ Modern responsive UI
- ✅ Privacy-focused (no tracking)
- ✅ Docker deployment
- ✅ Rate limiting & ban prevention

### Resource Usage

- **RAM**: ~100MB
- **CPU**: Low (only during searches)
- **Storage**: ~50MB

Much simpler than the previous complex setup!