import { getCachedGroupMetadata } from '../handlers/MessageHandler.ts';

export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const getBuffer = async (url: string): Promise<Buffer> => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
};

export const getRandom = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

export const getMentions = (text: string): string[] => {
    const matches = text.match(/@(\d+)/g);
    if (!matches) return [];
    return matches.map(m => m.slice(1) + '@s.whatsapp.net');
};

export const mentionUser = (userId: string) => {
    return [{ tag: userId.split('@')[0], id: userId }];
};

export const getName = async (bot: any, chatId: string | null, userId: string): Promise<string> => {
    try {
        const sock = bot.ws || bot.sock || bot;

        const extractNum = (id: string | null | undefined): string => {
            if (!id) return '';
            let num = id.split('@')[0];
            if (num.includes(':')) num = num.split(':')[1] || num.split(':')[0];
            return num.replace(/\D/g, '');
        };

        const targetNum = extractNum(userId);
        const fullJid = targetNum + '@s.whatsapp.net';

        if (sock.store && sock.store.contacts) {
            const contact = sock.store.contacts[fullJid];
            if (contact) {
                return contact.name || contact.notify || contact.verifiedName || targetNum;
            }
        }

        if (chatId && chatId.endsWith('@g.us')) {
            try {
                const groupMetadata = await getCachedGroupMetadata(sock, chatId);
                if (groupMetadata && groupMetadata.participants) {
                    const participant = groupMetadata.participants.find((p: any) => p.id === fullJid);
                    if (participant) {
                        return participant.notify || participant.name || targetNum;
                    }
                }
            } catch {}
        }

        return targetNum;
    } catch {
        const num = userId.split('@')[0].split(':').pop() || '';
        return num.replace(/\D/g, '') || userId;
    }
};

export const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const styleText = (text: string): string => {
    return text
        .replace(/a/g, 'ᥲ')
        .replace(/e/g, 'ꫀ')
        .replace(/t/g, 't')
        .replace(/u/g, 'ᥙ')
        .replace(/x/g, 'ꪎ')
        .replace(/y/g, 'ᥡ');
};
