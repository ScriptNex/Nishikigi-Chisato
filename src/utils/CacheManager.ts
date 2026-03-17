import NodeCache from 'node-cache';

class CacheManager {
    cache: NodeCache;
    stats: { hits: number; misses: number; sets: number };

    constructor(ttlSeconds = 60 * 5) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2 });
        this.stats = { hits: 0, misses: 0, sets: 0 };
    }

    get<T>(key: string): T | undefined {
        const value = this.cache.get<T>(key);
        if (value !== undefined) {
            this.stats.hits++;
        } else {
            this.stats.misses++;
        }
        return value;
    }

    set(key: string, value: any, ttl?: number): boolean {
        this.stats.sets++;
        if (ttl) {
            return this.cache.set(key, value, ttl);
        }
        return this.cache.set(key, value);
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    del(key: string): number {
        return this.cache.del(key);
    }

    keys(): string[] {
        return this.cache.keys();
    }

    flush(): void {
        this.cache.flushAll();
        this.stats = { hits: 0, misses: 0, sets: 0 };
    }

    getStats() {
        const nodeStats = this.cache.getStats();
        const hitRate = this.stats.hits + this.stats.misses > 0
            ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2)
            : 0;

        return {
            ...this.stats,
            hitRate: `${hitRate}%`,
            keyCount: this.cache.keys().length,
            nodeCache: nodeStats
        };
    }

    async getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttl?: number): Promise<T> {
        const cached = this.get<T>(key);
        if (cached !== undefined) return cached;
        const value = await fetchFn();
        this.set(key, value, ttl);
        return value;
    }
}

export default CacheManager;
