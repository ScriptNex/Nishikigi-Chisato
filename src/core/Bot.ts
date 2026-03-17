import { Bot as WapiBot, LocalAuth } from '@imjxsx/wapi';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import { PluginLoader } from './PluginLoader.ts';
import { globalLogger as logger } from '../utils/Logger.ts';
import Pino from 'pino';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Bot {
    bot: any;
    pluginLoader: PluginLoader;

    constructor() {
        this.pluginLoader = new PluginLoader();
        this.bot = null;
    }

    async initialize() {
        logger.info('Inicializando Nishikigi Chisato...');
        await this.initializeBot();
    }

    async initializeBot() {
        const auth = new LocalAuth('default', 'sessions');

        const silentLogger = Pino({ level: 'error' });

        this.bot = new WapiBot('default', auth, { jid: '', pn: '', name: '' });
        this.bot.logger = silentLogger;

        this.bot.on('qr', async (qr: string) => {
            const qrString = await QRCode.toString(qr, { type: 'terminal', small: true });
            console.log(qrString);
        });

        this.bot.on('open', (account: any) => {
            logger.info(`Bot conectado: ${account.name || 'Nishikigi Chisato'}`);
        });

        this.bot.on('error', (err: any) => logger.error(err));
    }

    async start() {
        await this.bot.login('qr');
    }
}
