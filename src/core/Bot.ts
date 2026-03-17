import { Bot as WapiBot, LocalAuth } from '@imjxsx/wapi';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import { PluginLoader } from './PluginLoader.ts';
import { globalLogger as logger } from '../utils/Logger.ts';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Bot {
    bot: WapiBot | null;
    pluginLoader: PluginLoader;
    uuid: string;
    sessionsDir: string;

    constructor() {
        this.uuid = randomUUID();
        this.sessionsDir = path.join(__dirname, '..', 'sessions');
        this.pluginLoader = new PluginLoader();
        this.bot = null;
    }

    async initialize() {
        logger.info('Inicializando Nishikigi Chisato...');
        await this.initializeBot();
    }

    async initializeBot() {
        const auth = new LocalAuth(this.uuid, this.sessionsDir);
        this.bot = new WapiBot(this.uuid, auth, { jid: '', pn: '', name: '' });

        
        (this.bot as any).logger = { level: 'error', child: () => ({ level: 'error' }) };

        this.bot.on('qr', async (qr: string) => {
            logger.info('Escanea este código QR para iniciar sesión:');
            const qrString = await QRCode.toString(qr, { type: 'terminal', small: true });
            console.log(qrString);
        });

        this.bot.on('open', (account: any) => {
            logger.info(`Bot conectado: ${account.name || 'Nishikigi Chisato'}`);
        });

        this.bot.on('error', (err: any) => logger.error(err));
    }

    async start() {
        if (!this.bot) throw new Error('Bot no inicializado');
        await this.bot.login('qr');
    }
}
