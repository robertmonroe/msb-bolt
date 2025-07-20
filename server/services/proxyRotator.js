import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

// Proxy rotation and IP management
class ProxyRotator {
  constructor() {
    // Example proxy configurations - replace with your actual proxies
    this.proxies = [
      // Uncomment and configure with your actual proxy servers
      // { host: 'proxy1.example.com', port: 8080, auth: 'user:pass', protocol: 'http' },
      // { host: 'proxy2.example.com', port: 8080, auth: 'user:pass', protocol: 'https' },
      // { host: 'proxy3.example.com', port: 3128, auth: 'user:pass', protocol: 'http' },
      // { host: 'socks-proxy.example.com', port: 1080, auth: 'user:pass', protocol: 'socks5' },
    ];
    
    this.currentProxyIndex = 0;
    this.failedProxies = new Set();
    this.proxyStats = new Map();
    this.lastRotation = Date.now();
    this.rotationInterval = 30000; // Rotate every 30 seconds
  }

  // Get next proxy in rotation
  getNextProxy() {
    if (this.proxies.length === 0) {
      console.log('⚠️  No proxies configured. Google searches may be blocked.');
      return null;
    }
    
    // Force rotation after interval
    if (Date.now() - this.lastRotation > this.rotationInterval) {
      this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
      this.lastRotation = Date.now();
    }
    
    let attempts = 0;
    while (attempts < this.proxies.length) {
      const proxy = this.proxies[this.currentProxyIndex];
      this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
      
      if (!this.failedProxies.has(proxy.host)) {
        console.log(`🔄 Using proxy: ${proxy.host}:${proxy.port}`);
        return proxy;
      }
      attempts++;
    }
    
    // All proxies failed, reset and try again
    console.log('🔄 All proxies failed, resetting failed list');
    this.failedProxies.clear();
    return this.proxies[0];
  }

  // Mark proxy as failed
  markProxyFailed(proxyHost) {
    this.failedProxies.add(proxyHost);
    console.log(`❌ Proxy ${proxyHost} marked as failed`);
    
    // Auto-recover failed proxies after 5 minutes
    setTimeout(() => {
      this.failedProxies.delete(proxyHost);
      console.log(`🔄 Proxy ${proxyHost} recovered and available again`);
    }, 300000);
  }

  // Get proxy configuration for fetch (returns agent for node-fetch v3.x)
  getProxyConfig() {
    const proxy = this.getNextProxy();
    
    const config = {
      headers: {
        'User-Agent': this.getRandomUserAgent()
      }
    };
    
    if (proxy) {
      try {
        // Create proxy URL
        const proxyUrl = `${proxy.protocol || 'http'}://${proxy.auth ? proxy.auth + '@' : ''}${proxy.host}:${proxy.port}`;
        
        // Create appropriate agent based on proxy protocol
        if (proxy.protocol === 'socks5' || proxy.protocol === 'socks4') {
          config.agent = new SocksProxyAgent(proxyUrl);
        } else {
          // Default to HTTP/HTTPS proxy
          config.agent = new HttpsProxyAgent(proxyUrl);
        }
        
        console.log(`🔄 Created proxy agent for: ${proxy.host}:${proxy.port}`);
      } catch (error) {
        console.error(`❌ Failed to create proxy agent: ${error.message}`);
        // Continue without proxy if agent creation fails
      }
    }
    
    return config;
  }

  // Get random user agent to avoid detection
  getRandomUserAgent() {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  // Record proxy performance
  recordProxyPerformance(proxyHost, success, responseTime) {
    if (!this.proxyStats.has(proxyHost)) {
      this.proxyStats.set(proxyHost, {
        requests: 0,
        successes: 0,
        failures: 0,
        avgResponseTime: 0
      });
    }
    
    const stats = this.proxyStats.get(proxyHost);
    stats.requests++;
    
    if (success) {
      stats.successes++;
      stats.avgResponseTime = (stats.avgResponseTime * (stats.successes - 1) + responseTime) / stats.successes;
    } else {
      stats.failures++;
    }
  }

  // Get proxy statistics
  getStats() {
    return {
      totalProxies: this.proxies.length,
      activeProxies: this.proxies.length - this.failedProxies.size,
      failedProxies: this.failedProxies.size,
      proxyStats: Object.fromEntries(this.proxyStats)
    };
  }

  // Check if proxies are configured
  hasProxies() {
    return this.proxies.length > 0;
  }
}

export const proxyRotator = new ProxyRotator();