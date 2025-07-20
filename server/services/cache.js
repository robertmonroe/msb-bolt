// Simple in-memory cache (replace with Redis in production)
class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
  }

  async get(key) {
    if (this.ttl.has(key) && Date.now() > this.ttl.get(key)) {
      this.cache.delete(key);
      this.ttl.delete(key);
      return null;
    }
    return this.cache.get(key) || null;
  }

  async set(key, value, ttlSeconds = 300) {
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + (ttlSeconds * 1000));
  }

  async delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  async clear() {
    this.cache.clear();
    this.ttl.clear();
  }
}

export const cacheService = new CacheService();