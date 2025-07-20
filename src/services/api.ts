import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Request throttling to prevent rate limiting
class RequestThrottler {
  private lastRequestTime = 0;
  private minInterval = 1000; // Minimum 1 second between requests
  private retryAfter = 0;

  async throttle(): Promise<void> {
    const now = Date.now();
    
    // If we're in a rate limit cooldown period, wait
    if (this.retryAfter > now) {
      const waitTime = this.retryAfter - now;
      console.log(`⏳ Rate limit cooldown: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // Ensure minimum interval between requests
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      console.log(`⏳ Throttling request: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  setRetryAfter(resetTime: number): void {
    this.retryAfter = resetTime;
    console.log(`🚫 Rate limit hit, will retry after: ${new Date(resetTime).toLocaleTimeString()}`);
  }
}

const requestThrottler = new RequestThrottler();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90 seconds for search operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  async (config) => {
    // Throttle requests to prevent rate limiting
    await requestThrottler.throttle();
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ API Response Error:', error.response.status, error.response.statusText);
      console.error('Response data:', error.response.data);
      
      // Handle rate limiting
      if (error.response.status === 429) {
        const resetTime = error.response.data?.resetTime;
        if (resetTime) {
          requestThrottler.setRetryAfter(resetTime);
        }
      }
    } else if (error.request) {
      console.error('❌ API Request Error (no response):', error.message);
    } else {
      console.error('❌ API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  timestamp?: string;
  thumbnail?: string;
}

export interface EngineResults {
  [key: string]: SearchResult[];
}

export interface AISummary {
  summary: string;
  keyPoints: string[];
  sources: string[];
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  server: string;
  aiServices: {
    huggingface: string;
    openai: string;
  };
  rateLimiter: any;
  proxy: any;
  engines: any;
  uptime: number;
  memory: any;
}

export const searchAPI = {
  async performSearch(query: string, engines: string[], category: string = 'general'): Promise<EngineResults> {
    try {
      console.log(`🔍 Performing real search for: "${query}" using engines: ${engines.join(', ')}`);
      
      const response = await api.post('/search', {
        query,
        engines,
        category
      });

      console.log('✅ Search completed successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Search API error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          throw new Error('Unable to connect to search service. Please ensure the server is running on port 3001.');
        } else if (error.response?.status === 429) {
          const resetTime = error.response.data?.resetTime;
          const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60;
          throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds before searching again.`);
        } else if (error.response?.status === 400) {
          throw new Error('Invalid search parameters. Please check your query and try again.');
        } else if (error.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Search timeout. The search engines may be slow to respond.');
        } else if (!error.response) {
          throw new Error('Unable to connect to search service. Please check if the backend server is running.');
        }
      }
      
      throw new Error(`Search failed: ${error.message || 'Unknown error occurred'}`);
    }
  },

  async generateAISummary(query: string, results: EngineResults): Promise<AISummary> {
    try {
      console.log(`🤖 Generating AI summary for: "${query}"`);
      
      const response = await api.post('/ai-summary', {
        query,
        results
      });

      console.log('✅ AI summary generated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ AI Summary API error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          throw new Error('Unable to connect to AI service. Please ensure the server is running.');
        } else if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before requesting another summary.');
        } else if (error.response?.status === 400) {
          throw new Error('Invalid summary request. Please try searching again.');
        } else if (error.response?.status >= 500) {
          throw new Error('AI service temporarily unavailable. Please try again later.');
        } else if (!error.response) {
          throw new Error('Unable to connect to AI service. Please check your connection.');
        }
      }
      
      throw new Error(`Failed to generate AI summary: ${error.message || 'Unknown error occurred'}`);
    }
  },

  async healthCheck(): Promise<HealthStatus> {
    try {
      console.log('🏥 Checking API health...');
      const response = await api.get('/health');
      console.log('✅ Health check successful');
      return response.data;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || !error.response) {
          throw new Error('Backend server is not running. Please start the server with "npm run server" or "npm run dev:full".');
        } else if (error.response?.status === 500) {
          throw new Error(`Server error (500): ${error.response.data?.message || 'Internal server error'}`);
        } else if (error.response?.status === 429) {
          const resetTime = error.response.data?.resetTime;
          const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60;
          throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds before making more requests.`);
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Health check timeout. Server may be overloaded.');
        } else if (error.response?.status >= 400) {
          throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
        }
      }
      
      throw new Error('Unable to connect to search service');
    }
  }
};