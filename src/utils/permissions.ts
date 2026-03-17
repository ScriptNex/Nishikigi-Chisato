import fs from 'fs';
import NodeCache from 'node-cache';

const ownerData = JSON.parse(fs.readFileSync('./owner.json', 'utf-8'));
const groupCache = new NodeCache({ stdTTL: 25 });

export function normalize(jid: string = ''): string {
    return jid.split('@')[0].split(':')[0];
}

export function isOwner(userJid?: string): boolean {
    if (!userJid) return false;
    const num = normalize(userJid);
    return ownerData.owner.includes(num);
}

export async function isAdmin(sock: any, groupJid?: string, userJid?: string): Promise<boolean> {
    if (!groupJid?.endsWith('@g.us')) return false;
    if (isOwner(userJid)) return true;

    try {
        let metadata: any = groupCache.get(groupJid);

        if (!metadata) {
            metadata = await sock.groupMetadata(groupJid);
            groupCache.set(groupJid, metadata);
        }

        const userNum = normalize(userJid);

        for (const p of metadata.participants || []) {
            const pNum = normalize(p.id);
            if (pNum === userNum) {
                return p.admin === 'admin' || p.admin === 'superadmin';
            }
        }
    } catch (e: any) {
        console.log('isAdmin cache error:', e?.message);
    }

    return false;
}
