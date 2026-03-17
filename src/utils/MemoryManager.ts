import os from 'os';
import { EventEmitter } from 'events';
import { globalLogger as logger } from './Logger.js';

export const MEMORY_LIMITS = {
    MAX_DOWNLOAD_SIZE: 100 * 1024 * 1024,
    MAX_BUFFER_SIZE: 50 * 1024 * 1024,
    CRITICAL_FREE_MEMORY: 50 * 1024 * 1024,
    WARNING_FREE_MEMORY: 100 * 1024 * 1024,
    MAX_HEAP_USAGE_PERCENT: 95,
    CLEANUP_INTERVAL: 30000,
    MONITOR_INTERVAL: 10000,
    BUFFER_TTL: 30000
};

interface BufferData {
    size: number;
    createdAt: number;
    [key: string]: any;
}

class MemoryManager extends EventEmitter {
    activeBuffers: Map<string, BufferData>;
    downloadQueue: any[];
    isProcessing: boolean;
    stats: {
        totalDownloads: number;
        failedDownloads: number;
        memoryCleanups: number;
        rejectedBySize: number;
        rejectedByMemory: number;
    };
    monitorInterval?: NodeJS.Timeout;
    cleanupInterval?: NodeJS.Timeout;

    constructor() {
        super();
        this.activeBuffers = new Map();
        this.downloadQueue = [];
        this.isProcessing = false;
        this.stats = {
            totalDownloads: 0,
            failedDownloads: 0,
            memoryCleanups: 0,
            rejectedBySize: 0,
            rejectedByMemory: 0
        };
        this.startMonitoring();
        this.startCleanup();
    }

    getMemoryStatus() {
        const freeMemory = os.freemem();
        const totalMemory = os.totalmem();
        const usedMemory = totalMemory - freeMemory;
        const heapUsed = process.memoryUsage().heapUsed;
        const heapTotal = process.memoryUsage().heapTotal;
        const rss = process.memoryUsage().rss;

        return {
            freeMemory,
            totalMemory,
            usedMemory,
            usedPercent: Math.round((usedMemory / totalMemory) * 100),
            heapUsed,
            heapTotal,
            heapPercent: Math.round((heapUsed / heapTotal) * 100),
            rss,
            activeBuffers: this.activeBuffers.size,
            activeBuffersSize: this.getActiveBuffersSize(),
            isCritical: freeMemory < MEMORY_LIMITS.CRITICAL_FREE_MEMORY,
            isWarning: freeMemory < MEMORY_LIMITS.WARNING_FREE_MEMORY
        };
    }

    getActiveBuffersSize(): number {
        let total = 0;
        for (const [, data] of this.activeBuffers) {
            total += data.size || 0;
        }
        return total;
    }

    canProcessDownload(estimatedSize: number = 0) {
        const status = this.getMemoryStatus();

        if (estimatedSize > MEMORY_LIMITS.MAX_DOWNLOAD_SIZE) {
            logger.warn(`[MemoryManager] Rechazado por tamaño: ${this.formatBytes(estimatedSize)} > ${this.formatBytes(MEMORY_LIMITS.MAX_DOWNLOAD_SIZE)}`);
            this.stats.rejectedBySize++;
            return { allowed: false, reason: 'FILE_TOO_LARGE', message: 'Archivo muy grande.' };
        }

        const activeSize = this.getActiveBuffersSize();
        if (this.activeBuffers.size < 5) return { allowed: true, availableMemory: status.freeMemory };

        if (activeSize + estimatedSize > MEMORY_LIMITS.MAX_BUFFER_SIZE * 3) {
            logger.warn(`[MemoryManager] Rechazado por buffer lleno: ${this.formatBytes(activeSize)}`);
            return { allowed: false, reason: 'TOO_MANY_BUFFERS', message: 'Demasiadas descargas simultáneas.' };
        }

        return { allowed: true, availableMemory: status.freeMemory };
    }

    registerBuffer(id: string, size: number, metadata: any = {}): void {
        this.activeBuffers.set(id, { size, createdAt: Date.now(), ...metadata });
    }

    releaseBuffer(id: string): void {
        this.activeBuffers.delete(id);
    }

    forceCleanup(): void {
        const now = Date.now();
        for (const [id, data] of this.activeBuffers) {
            if (now - data.createdAt > MEMORY_LIMITS.BUFFER_TTL) this.activeBuffers.delete(id);
        }
        if ((global as any).gc) (global as any).gc();
        this.stats.memoryCleanups++;
        this.emit('cleanup');
    }

    startMonitoring(): void {
        this.monitorInterval = setInterval(() => {
            const status = this.getMemoryStatus();
            if (status.isCritical) {
                logger.warn('[MemoryManager] MEMORIA CRÍTICA - Forzando limpieza');
                this.forceCleanup();
                this.emit('critical', status);
            } else if (status.isWarning) {
                logger.warn('[MemoryManager] Advertencia de memoria baja');
                this.emit('warning', status);
            }
        }, MEMORY_LIMITS.MONITOR_INTERVAL);
    }

    startCleanup(): void {
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            let cleaned = 0;
            for (const [id, data] of this.activeBuffers) {
                if (now - data.createdAt > MEMORY_LIMITS.BUFFER_TTL) {
                    this.activeBuffers.delete(id);
                    cleaned++;
                }
            }
            if (cleaned > 0) logger.info(`[MemoryManager] Limpiados ${cleaned} buffers expirados`);
            if ((global as any).gc && this.getMemoryStatus().heapPercent > 60) (global as any).gc();
        }, MEMORY_LIMITS.CLEANUP_INTERVAL);
    }

    stop(): void {
        if (this.monitorInterval) clearInterval(this.monitorInterval);
        if (this.cleanupInterval) clearInterval(this.cleanupInterval);
        this.activeBuffers.clear();
    }

    formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    getStats() {
        return { ...this.stats, ...this.getMemoryStatus() };
    }
}

const memoryManager = new MemoryManager();
export default memoryManager;
export { MemoryManager };
