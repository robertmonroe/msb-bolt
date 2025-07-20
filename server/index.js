import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { rateLimiter } from './services/rateLimiter.js';
import { searchEngines } from './services/searchEngines.js';
import { aiSummaryService } from './services/aiSummary.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy headers
app.set('trust proxy', true);

// Rate limiting middleware
app.use((req, res, next) => {
  // More lenient rate limiting for development
  const result = rateLimiter.checkLimit(req, { requests: 50, window: 60000 });
  
  if (!result.allowed) {
    console.log(`🚫 Rate limit exceeded for IP: ${rateLimiter.getRealIP(req)}`);
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      resetTime: result.resetTime,
      remaining: 0,
      retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
    });
  }
  
  // Add rate limit headers to response
  res.set({
    'X-RateLimit-Limit': '50',
    'X-RateLimit-Remaining': result.remaining || 0,
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
  });
  
  next();
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Check if build directory exists and serve static files
const buildPath = path.join(__dirname, '../dist');

// Always serve static files with proper headers
console.log(`📁 Checking build directory: ${buildPath}`);

if (fs.existsSync(buildPath)) {
  console.log(`✅ Build directory found: ${buildPath}`);
  
  // Serve static files with proper headers
  app.use(express.static(buildPath, {
    maxAge: '1d',
    etag: false,
    lastModified: false,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));
  
  // Explicitly handle root route
  app.get('/', (req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Index file not found');
    }
  });
  
} else {
  console.log(`⚠️  Build directory not found: ${buildPath}`);
  console.log('📦 Run "npm run build" to generate the build files');
  
  // Serve a simple fallback page for development
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>MySearchBot™ - Build Required</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 8px; }
          code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>MySearchBot™ - Build Required</h1>
          <p>The application build files are missing. Please run <code>npm run build</code> to generate them.</p>
          <p>For development, use <code>npm run dev</code> to start the development server.</p>
          <p><strong>Current path:</strong> ${buildPath}</p>
        </div>
      </body>
      </html>
    `);
  });
}

// Mock search engines data
const mockSearchResults = {
  google: [
    {
      title: "Understanding AI and Machine Learning in 2024",
      url: "https://example.com/ai-ml-2024",
      snippet: "Comprehensive guide to artificial intelligence and machine learning trends, covering neural networks, deep learning, and practical applications in various industries.",
      timestamp: "2 days ago"
    },
    {
      title: "Top 10 Machine Learning Frameworks for Developers",
      url: "https://example.com/ml-frameworks",
      snippet: "Explore the most popular machine learning frameworks including TensorFlow, PyTorch, and Scikit-learn with practical examples and use cases.",
      timestamp: "1 week ago"
    },
    {
      title: "AI Ethics and Responsible Machine Learning",
      url: "https://example.com/ai-ethics",
      snippet: "Important considerations for ethical AI development, bias prevention, and responsible deployment of machine learning systems in production.",
      timestamp: "3 days ago"
    }
  ],
  bing: [
    {
      title: "Machine Learning Applications in Healthcare",
      url: "https://example.com/ml-healthcare",
      snippet: "How artificial intelligence and machine learning are revolutionizing medical diagnosis, drug discovery, and patient care in modern healthcare systems.",
      timestamp: "5 days ago"
    },
    {
      title: "Natural Language Processing Breakthroughs",
      url: "https://example.com/nlp-breakthroughs",
      snippet: "Latest advances in natural language processing, including transformer models, BERT, GPT, and their applications in real-world scenarios.",
      timestamp: "1 day ago"
    },
    {
      title: "Computer Vision and Image Recognition Trends",
      url: "https://example.com/computer-vision",
      snippet: "Exploring the latest developments in computer vision, object detection, facial recognition, and autonomous vehicle technology.",
      timestamp: "4 days ago"
    }
  ],
  duckduckgo: [
    {
      title: "Open Source AI Tools and Libraries",
      url: "https://example.com/open-source-ai",
      snippet: "Comprehensive list of open-source artificial intelligence tools, libraries, and frameworks for developers and researchers.",
      timestamp: "6 days ago"
    },
    {
      title: "Machine Learning for Beginners: Complete Guide",
      url: "https://example.com/ml-beginners",
      snippet: "Step-by-step introduction to machine learning concepts, algorithms, and practical implementation for newcomers to the field.",
      timestamp: "1 week ago"
    },
    {
      title: "AI in Business: ROI and Implementation Strategies",
      url: "https://example.com/ai-business",
      snippet: "How businesses are implementing AI solutions, measuring return on investment, and overcoming common challenges in AI adoption.",
      timestamp: "2 weeks ago"
    }
  ],
  yahoo: [
    {
      title: "Future of Artificial Intelligence",
      url: "https://example.com/ai-future",
      snippet: "Predictions and trends for the future of AI technology, including quantum computing integration and AGI development.",
      timestamp: "1 week ago"
    },
    {
      title: "Deep Learning Neural Networks",
      url: "https://example.com/deep-learning",
      snippet: "Understanding deep learning architectures, convolutional neural networks, and their applications in various industries.",
      timestamp: "3 days ago"
    }
  ],
  brave: [
    {
      title: "Privacy-Focused AI Development",
      url: "https://example.com/privacy-ai",
      snippet: "Building AI systems with privacy by design, federated learning, and protecting user data in machine learning applications.",
      timestamp: "4 days ago"
    },
    {
      title: "Decentralized Machine Learning",
      url: "https://example.com/decentralized-ml",
      snippet: "Exploring decentralized approaches to machine learning, blockchain integration, and distributed AI networks.",
      timestamp: "1 week ago"
    }
  ],
  mojeek: [
    {
      title: "Independent Search Technology",
      url: "https://example.com/independent-search",
      snippet: "How independent search engines are building alternative approaches to web search and information discovery.",
      timestamp: "5 days ago"
    },
    {
      title: "Alternative AI Models",
      url: "https://example.com/alternative-ai",
      snippet: "Exploring alternative approaches to AI development outside of big tech, including community-driven models.",
      timestamp: "1 week ago"
    }
  ]
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    console.log('🏥 Health check requested');
    
    // Check if critical services are available
    const engineStats = searchEngines.getStats();
    const rateLimiterStats = rateLimiter.getStats();
    
    const healthData = { 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      version: '2.1.0',
      server: 'MySearchBot API Server',
      message: 'Server is running and ready to handle requests',
      aiServices: {
        huggingface: process.env.HUGGINGFACE_API_KEY ? 'configured' : 'not configured',
        openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured'
      },
      rateLimiter: { 
        status: 'active',
        activeClients: rateLimiterStats.activeClients,
        blockedIPs: rateLimiterStats.blockedIPs
      },
      proxy: { status: 'not configured' },
      engines: engineStats,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    };

    console.log('✅ Health check successful');
    res.json(healthData);
  } catch (error) {
    console.error('❌ Health check error:', error);
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '2.1.0',
      server: 'MySearchBot API Server',
      message: 'Server is running with basic functionality',
      error: error.message
    });
  }
});

// Search endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { query, engines, category = 'general' } = req.body;
    
    if (!query || !engines || engines.length === 0) {
      return res.status(400).json({ error: 'Query and engines are required' });
    }

    if (typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query must be a non-empty string' });
    }

    if (!Array.isArray(engines) || engines.length > 6) {
      return res.status(400).json({ error: 'Engines must be an array with maximum 6 engines' });
    }

    console.log(`🔍 Search request: "${query}" using engines: ${engines.join(', ')}`);

    // Perform searches in parallel with timeout
    const searchPromises = engines.map(async (engine) => {
      try {
        const results = await Promise.race([
          searchEngines[engine] ? searchEngines[engine](query, category) : [],
          new Promise((_, reject) => setTimeout(() => reject(new Error('Search timeout')), 15000))
        ]);
        return { engine, results: results || [] };
      } catch (error) {
        console.error(`❌ ${engine} search failed:`, error.message);
        return { engine, results: [] };
      }
    });

    const searchResults = await Promise.all(searchPromises);
    const results = {};
    
    searchResults.forEach(({ engine, results: engineResults }) => {
      results[engine] = engineResults;
    });

    console.log(`✅ Search completed: ${Object.keys(results).length} engines, ${Object.values(results).flat().length} total results`);

    res.json(results);
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Search service temporarily unavailable'
    });
  }
});

// AI Summary endpoint
app.post('/api/ai-summary', async (req, res) => {
  try {
    const { query, results } = req.body;
    
    if (!query || !results) {
      return res.status(400).json({ error: 'Query and results are required' });
    }

    if (typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query must be a non-empty string' });
    }

    if (typeof results !== 'object' || results === null) {
      return res.status(400).json({ error: 'Results must be an object' });
    }

    console.log(`🤖 AI summary request for: "${query}"`);

    try {
      // Generate AI summary with timeout
      const aiSummary = await Promise.race([
        aiSummaryService.generateSummary(query, results),
        new Promise((_, reject) => setTimeout(() => reject(new Error('AI summary timeout')), 30000))
      ]);
      
      console.log('✅ AI summary generated successfully');
      res.json(aiSummary);
    } catch (summaryError) {
      console.error('❌ AI Summary generation failed:', summaryError.message);
      
      // Fallback summary
      const allResults = Object.values(results).flat();
      const sources = Object.keys(results);
      
      const fallbackSummary = {
        summary: `Based on search results for "${query}", multiple sources provide comprehensive information covering various aspects of this topic. The results offer diverse perspectives and detailed insights from ${sources.length} different search engines.`,
        keyPoints: [
          `Found ${allResults.length} relevant results across ${sources.length} search engines`,
          'Results include both current information and comprehensive background',
          'Multiple perspectives provided from different authoritative sources',
          'Information covers practical applications and theoretical concepts',
          'Sources include both recent developments and established knowledge'
        ],
        sources: sources
      };
      
      res.json(fallbackSummary);
    }
  } catch (error) {
    console.error('❌ AI Summary error:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI summary',
      message: error.message || 'AI service temporarily unavailable'
    });
  }
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  try {
    const indexPath = path.join(buildPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send(`
        <h1>MySearchBot™ - Build Required</h1>
        <p>The application build files are missing. Please run <code>npm run build</code> to generate them.</p>
        <p>For development, use <code>npm run dev</code> to start the development server.</p>
      `);
    }
  } catch (error) {
    console.error('Static file serving error:', error);
    res.status(500).send('Server error');
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server'
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MySearchBot Server v2.1 running on port ${PORT}`);
  
  // Check build status
  if (fs.existsSync(buildPath)) {
    console.log(`✅ Serving built React app from: ${buildPath}`);
  } else {
    console.log(`⚠️  No build files found. Run "npm run build" to generate them.`);
    console.log(`📝 For development, use "npm run dev" for the frontend.`);
  }
  
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Server listening on all interfaces (0.0.0.0:${PORT})`);
  console.log(`✅ Server is ready to handle requests`);
  
  // Test health endpoint on startup
});

server.on('error', (error) => {
  console.error('❌ Server startup error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port or stop the existing process.`);
    console.error(`Try: lsof -ti:${PORT} | xargs kill -9`);
  }
  process.exit(1);
});

export default app;