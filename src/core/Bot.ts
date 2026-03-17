import { Bot as WapiBot, LocalAuth } from '@imjxsx/wapi';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import { PluginLoader } from './PluginLoader.ts';
import pino from 'pino';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Bot {
    bot: WapiBot | null;
    pluginLoader: PluginLoader;
    uuid: string;
    sessionsDir: string;
    logger: pino.Logger;

    constructor() {
        this.uuid = '4f3b2a1c-7e9a-4d2f-8b6f-12a3456b7890'; 
        this.sessionsDir = path.join(__dirname, '..', 'sessions');
        this.pluginLoader = new PluginLoader();
        this.bot = null;
        this.logger = pino({ level: 'error' });
    }

    async initialize() {
        this.logger.info('Inicializando Nishikigi Chisato...');
        await this.initializeBot();
    }

    async initializeBot() {
        const auth = new LocalAuth(this.uuid, this.sessionsDir);
        this.bot = new WapiBot(this.uuid, auth, { jid: '', pn: '', name: 'Nishikigi Chisato' });
        (this.bot as any).logger = this.logger;

        this.bot.on('qr', async (qr: string) => {
            this.logger.info('Escanea este código QR:');
            console.log(await QRCode.toString(qr, { type: 'terminal', small: true }));
        });

        this.bot.on('open', (account: any) => {
            this.logger.info(`Bot conectado: ${account.name || 'Nishikigi Chisato'}`);
        });

        this.bot.on('error', (err: any) => this.logger.error(err));
    }

    async start() {
        if (!this.bot) throw new Error('Bot no inicializado');
        await this.bot.login('qr');
    }
}
