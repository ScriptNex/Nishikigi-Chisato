import { Bot as WapiBot, LocalAuth } from '@imjxsx/wapi';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import { PluginLoader } from './PluginLoader.ts';
import { globalLogger as logger } from '../utils/Logger.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Bot {
    bot: any;
    pluginLoader: PluginLoader;
    uuid: string;

    constructor(uuid?: string) {
        this.pluginLoader = new PluginLoader();
        this.bot = null;
        this.uuid = uuid || '00000000-0000-0000-0000-000000000000';
    }

    async initialize() {
        logger.info('Inicializando Nishikigi Chisato...');
        await this.initializeBot();
    }

    async initializeBot() {
        const auth = new LocalAuth(this.uuid, path.join(__dirname, '..', 'sessions'));
        this.bot = new WapiBot(this.uuid, auth, { jid: '', pn: '', name: '' });

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
