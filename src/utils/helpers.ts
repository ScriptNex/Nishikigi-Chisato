import { normalizeUserId, isAdmin } from './permissions.js';
import * as formatters from './formatters.js';
import { getCachedGroupMetadata } from '../handlers/MessageHandler.js';

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getBuffer = async (url: string) => {
    const response = await fetch(url);
    return Buffer.from(await response.arrayBuffer());
};

export const getRandom = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

export const getGroupAdmins = (participants: any[]) => participants.filter(p => p.admin).map(p => p.id);

export const extractMentions = (ctx: any): string[] => {
    const mentioned = ctx.message?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentioned.length > 0) return mentioned;
    const text = ctx.body || ctx.text || '';
    const matches = text.match(/@(\d+)/g);
    if (!matches) return [];
    return matches.map((m: string) => m.slice(1) + '@s.whatsapp.net');
};

export const getMentions = (text: string): string[] => {
    const matches = text.match(/@(\d+)/g);
    if (!matches) return [];
    return matches.map(m => m.slice(1) + '@s.whatsapp.net');
};

const owners = ['57324709996@s.whatsapp.net', '526631079388@s.whatsapp.net', '5356795360@s.whatsapp.net', '18096521129@s.whatsapp.net', '5491125741379@s.whatsapp.net', '639972367773@s.whatsapp.net', '5493777606761@s.whatsapp.net', '78224272920733@s.whatsapp.net', '85968115769454@s.whatsapp.net', '573013751308@s.whatsapp.net'];

export const isOwner = (userId: string | null | undefined, specificOwner: string | null = null): boolean => {
    if (!userId) return false;
    const clean = (id: string | null | undefined) => id ? id.split('@')[0].split(':')[1] || id.split('@')[0].split(':')[0] : '';
    const userNum = clean(userId).replace(/\D/g, '');
    if (specificOwner && userNum === clean(specificOwner).replace(/\D/g, '')) return true;
    return owners.some(o => clean(o).replace(/\D/g, '') === userNum);
};

export const getName = async (bot: any, chatId: string | null, userId: string): Promise<string> => {
    try {
        const sock = bot.ws || bot.sock || bot;
        const extractNum = (id: string | null | undefined) => {
            if (!id) return '';
            let num = id.split('@')[0];
            if (num.includes(':')) num = num.split(':')[1] || num.split(':')[0];
            return num.replace(/\D/g, '');
        };
        const targetNum = extractNum(userId);
        const fullJid = targetNum + '@s.whatsapp.net';
        if (sock.store && sock.store.contacts) {
            const contact = sock.store.contacts[fullJid];
            if (contact && (contact.name || contact.notify || contact.verifiedName)) return contact.name || contact.notify || contact.verifiedName;
        }
        if (chatId && chatId.endsWith('@g.us')) {
            try {
                const groupMetadata = await getCachedGroupMetadata(sock, chatId);
                if (groupMetadata && groupMetadata.participants) {
                    const participant = groupMetadata.participants.find((p: any) => {
                        const pNum = extractNum(p.id);
                        const pLidNum = p.lid ? extractNum(p.lid) : '';
                        return pNum === targetNum || pLidNum === targetNum;
                    });
                    if (participant) return participant.notify || participant.name || targetNum;
                }
            } catch (e) {
                console.error('Error obteniendo metadata del grupo:', e);
            }
        }
        return targetNum;
    } catch (e) {
        console.error('Error en getName:', e);
        const num = userId.split('@')[0].split(':').pop() || '';
        return num.replace(/\D/g, '') || userId;
    }
};

export const getCurrencyName = async (ctx: any): Promise<string> => {
    if (!ctx.isGroup) return 'coins';
    const groupData = await ctx.dbService.getGroup(ctx.chatId);
    return groupData?.settings?.currencyName || 'coins';
};

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const styleText = (text: string) => text.replace(/a/g, 'ᥲ').replace(/e/g, 'ꫀ').replace(/t/g, 't').replace(/u/g, 'ᥙ').replace(/x/g, 'ꪎ').replace(/y/g, 'ᥡ');

export * from './formatters.js';
export * from './permissions.js';
export { normalizeUserId, isAdmin };
