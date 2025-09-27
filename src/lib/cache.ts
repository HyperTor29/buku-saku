// utils/cache.ts
export class SimpleCache {
  private cache: Map<string, { data: unknown; timestamp: number; ttl: number }> = new Map();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000) { // Default 5 menit
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  has(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const globalCache = new SimpleCache();