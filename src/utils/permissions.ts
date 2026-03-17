import { globalLogger as logger } from './Logger.js';
import { getCachedGroupMetadata } from '../handlers/MessageHandler.js';

const permissionCache = new Map<string, { value: boolean; timestamp: number }>();
const CACHE_TTL = 60_000;

export function normalizeUserId(userId: string | null | undefined): string | null {
    if (!userId) return null;
    return userId.split(':')[0].split('@')[0];
}

export function clearPermissionCache(chatId: string) {
    const keysToDelete: string[] = [];
    for (const [key] of permissionCache) {
        if (key.startsWith(`${chatId}:`)) keysToDelete.push(key);
    }
    keysToDelete.forEach(key => permissionCache.delete(key));
}

export async function isAdmin(bot: any, chatId: string, userId: string): Promise<boolean> {
    try {
        const normalizedId = normalizeUserId(userId);
        if (!normalizedId) return false;

        const cacheKey = `${chatId}:${normalizedId}:admin`;
        const cached = permissionCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.value;

        const sock = bot.ws || bot.sock || bot;
        let groupMetadata;
        try {
            groupMetadata = await getCachedGroupMetadata(sock, chatId);
        } catch {
            return false;
        }

        if (!groupMetadata?.participants) return false;

        const participant = groupMetadata.participants.find((p: any) => {
            const pId = normalizeUserId(p.id);
            const pLid = p.lid ? normalizeUserId(p.lid) : null;
            return pId === normalizedId || pLid === normalizedId;
        });

        const result = !!(participant && (participant.admin === 'admin' || participant.admin === 'superadmin'));
        permissionCache.set(cacheKey, { value: result, timestamp: Date.now() });
        return result;
    } catch (error: any) {
        logger.error(`[isAdmin] Error:`, error.message);
        return false;
    }
}

export async function isBotAdmin(bot: any, chatId: string): Promise<boolean> {
    try {
        const cacheKey = `${chatId}:bot:admin`;
        const cached = permissionCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.value;

        const sock = bot.ws || bot.sock || bot;
        let groupMetadata;
        try {
            groupMetadata = await getCachedGroupMetadata(sock, chatId);
        } catch {
            return false;
        }

        if (!groupMetadata?.participants) return false;

        const botId = normalizeUserId(sock.user?.id);
        const botLid = sock.user?.lid ? normalizeUserId(sock.user.lid) : null;

        const participant = groupMetadata.participants.find((p: any) => {
            const pId = normalizeUserId(p.id);
            return pId === botId || (botLid && pId === botLid);
        });

        const result = !!(participant && (participant.admin === 'admin' || participant.admin === 'superadmin'));
        permissionCache.set(cacheKey, { value: result, timestamp: Date.now() });
        return result;
    } catch (error: any) {
        logger.error(`[isBotAdmin] Error:`, error.message);
        return false;
    }
}

export async function getGroupPermissions(bot: any, chatId: string) {
    try {
        const sock = bot.ws || bot.sock || bot;
        let groupMetadata;
        try {
            groupMetadata = await getCachedGroupMetadata(sock, chatId);
        } catch {
            return { admins: [], superadmins: [], participants: [] };
        }

        if (!groupMetadata?.participants) return { admins: [], superadmins: [], participants: [] };

        const admins: string[] = [];
        const superadmins: string[] = [];
        const participants: string[] = [];

        for (const p of groupMetadata.participants) {
            const normalizedId = normalizeUserId(p.id);
            if (!normalizedId) continue;
            participants.push(normalizedId);
            if (p.admin === 'admin') admins.push(normalizedId);
            else if (p.admin === 'superadmin') superadmins.push(normalizedId);
        }

        return { admins, superadmins, participants, metadata: groupMetadata };
    } catch (error: any) {
        logger.error(`[getGroupPermissions] Error:`, error.message);
        return { admins: [], superadmins: [], participants: [] };
    }
}

export async function findParticipant(bot: any, chatId: string, userId: string) {
    try {
        const sock = bot.ws || bot.sock || bot;
        const normalizedId = normalizeUserId(userId);
        if (!normalizedId) return null;

        let groupMetadata;
        try {
            groupMetadata = await getCachedGroupMetadata(sock, chatId);
        } catch {
            return null;
        }

        if (!groupMetadata?.participants) return null;

        return groupMetadata.participants.find((p: any) => {
            const pId = normalizeUserId(p.id);
            const pLid = p.lid ? normalizeUserId(p.lid) : null;
            return pId === normalizedId || pLid === normalizedId;
        });
    } catch (error: any) {
        logger.error(`[findParticipant] Error:`, error.message);
        return null;
    }
}

setInterval(() => {
    const now = Date.now();
    for (const [key, value] of permissionCache) {
        if (now - value.timestamp > CACHE_TTL) permissionCache.delete(key);
    }
}, 30_000);
