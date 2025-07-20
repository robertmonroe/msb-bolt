// Advanced rate limiting with Redis-like functionality
class RateLimiter {
  constructor() {
    this.clients = new Map();
    this.blockedIPs = new Set();
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Cleanup every minute
  }

  // Get real client IP from headers
  getRealIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const realIP = req.headers['x-real-ip'];
    const remoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress;
    
    if (forwarded) {
      // Take the first IP from the forwarded chain
      return forwarded.split(',')[0].trim();
    }
    
    return realIP || remoteAddress || 'unknown';
  }

  // Check if request should be allowed
  checkLimit(req, limits = { requests: 30, window: 60000, burst: 5 }) {
    const ip = this.getRealIP(req);
    const now = Date.now();
    
    // Check if IP is blocked
    if (this.blockedIPs.has(ip)) {
      return { allowed: false, reason: 'IP_BLOCKED', resetTime: now + 300000 }; // 5 min block
    }

    // Get or create client record
    if (!this.clients.has(ip)) {
      this.clients.set(ip, {
        requests: [],
        violations: 0,
        firstSeen: now,
        lastSeen: now,
        userAgent: req.headers['user-agent'] || 'unknown'
      });
    }

    const client = this.clients.get(ip);
    client.lastSeen = now;

    // Clean old requests outside the window
    client.requests = client.requests.filter(time => now - time < limits.window);

    // Check if within limits
    if (client.requests.length >= limits.requests) {
      client.violations++;
      
      // Progressive blocking
      if (client.violations >= 5) {
        this.blockedIPs.add(ip);
        console.log(`🚫 IP ${ip} blocked after ${client.violations} violations`);
        return { allowed: false, reason: 'RATE_LIMIT_EXCEEDED', resetTime: now + 300000 };
      }
      
      return { 
        allowed: false, 
        reason: 'RATE_LIMIT', 
        resetTime: now + limits.window,
        violations: client.violations
      };
    }

    // Add current request
    client.requests.push(now);
    
    return { 
      allowed: true, 
      remaining: limits.requests - client.requests.length,
      resetTime: now + limits.window
    };
  }

  // Cleanup old entries
  cleanup() {
    const now = Date.now();
    const maxAge = 3600000; // 1 hour

    for (const [ip, client] of this.clients.entries()) {
      if (now - client.lastSeen > maxAge) {
        this.clients.delete(ip);
      }
    }

    console.log(`🧹 Rate limiter cleanup: ${this.clients.size} active clients, ${this.blockedIPs.size} blocked IPs`);
  }

  // Get stats for monitoring
  getStats() {
    return {
      activeClients: this.clients.size,
      blockedIPs: this.blockedIPs.size,
      topClients: Array.from(this.clients.entries())
        .sort(([,a], [,b]) => b.requests.length - a.requests.length)
        .slice(0, 10)
        .map(([ip, client]) => ({
          ip,
          requests: client.requests.length,
          violations: client.violations,
          userAgent: client.userAgent.slice(0, 50)
        }))
    };
  }

  // Unblock IP (for admin use)
  unblockIP(ip) {
    this.blockedIPs.delete(ip);
    if (this.clients.has(ip)) {
      this.clients.get(ip).violations = 0;
    }
    console.log(`✅ IP ${ip} unblocked`);
  }
}

export const rateLimiter = new RateLimiter();