import { getCachedGroupMetadata } from '../handlers/MessageHandler.ts';

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getBuffer = async (url: string) => {
    const response = await fetch(url);
    return Buffer.from(await response.arrayBuffer());
};

export const getRandom = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

export const getMentions = (text: string): string[] => {
    const matches = text.match(/@(\d+)/g);
    if (!matches) return [];
    return matches.map(m => m.slice(1) + '@s.whatsapp.net');
};

export const mentionUser = (userId: string) => [{ tag: userId.split('@')[0], id: userId }];

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
            if (contact && (contact.name || contact.notify || contact.verifiedName))
                return contact.name || contact.notify || contact.verifiedName;
        }

        if (chatId && chatId.endsWith('@g.us')) {
            try {
                const groupMetadata = await getCachedGroupMetadata(sock, chatId);
                if (groupMetadata && groupMetadata.participants) {
                    const participant = groupMetadata.participants.find((p: any) => p.id === fullJid);
                    if (participant) return participant.notify || participant.name ||
