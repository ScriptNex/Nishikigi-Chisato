import axios from 'axios';
import { globalLogger as logger } from './Logger.js';

const URLS = {
    hentai: 'https://raw.githubusercontent.com/nekyb/Nishikigi-Chisato/refs/heads/main/database/hentai.txt',
    hentaiSemi: 'https://raw.githubusercontent.com/nekyb/Nishikigi-Chisato/refs/heads/main/database/hentai-semi.txt',
    porno: 'https://raw.githubusercontent.com/nekyb/Nishikigi-Chisato/refs/heads/main/database/porno.txt'
};

const cache: any = {
    hentai: null,
    hentaiSemi: null,
    porno: null
};

export const loadLinks = async (type: 'hentai' | 'hentaiSemi' | 'porno'): Promise<string[]> => {
    if (cache[type]) return cache[type];
    try {
        const response = await axios.get(URLS[type]);
        const links = response.data.split('\n').filter((line: string) => line.trim() !== '');
        cache[type] = links;
        return links;
    } catch (error: any) {
        logger.error(`𖤐 Error cargando ${type}:`, error.message);
        return [];
    }
};

export const getRandomLink = (links: string[]): string => {
    return links[Math.floor(Math.random() * links.length)];
};

export const downloadMedia = async (url: string): Promise<Buffer | null> => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    } catch (error: any) {
        logger.error('𖤐 Error descargando media:', error.message);
        return null;
    }
};
