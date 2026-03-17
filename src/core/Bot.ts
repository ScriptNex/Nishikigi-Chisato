import { Bot as WapiBot, LocalAuth } from '@imjxsx/wapi';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import { PluginLoader } from './PluginLoader.ts';
import { globalLogger as logger } from '../utils/Logger.ts';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SESSION_FILE = path.join(__dirname, '..', 'sessions', 'uuid.txt');

export class Bot {
    bot: any;
    pluginLoader: PluginLoader;
    uuid: string;

    constructor() {
        this.pluginLoader = new PluginLoader();
        this.bot = null;

        
        if (fs.existsSync(SESSION_FILE)) {
            this.uuid = fs.readFileSync(SESSION_FILE, 'utf-8').trim();
        } else {
            this.uuid = require('crypto').randomUUID();
            fs.mkdirSync(path.dirname(SESSION_FILE), { recursive: true });
            fs.writeFileSync(SESSION_FILE, this.uuid);
        }
    }

    async initialize() {
        logger.info('✨ Inicializando Nishikigi Chisato...');
        await this.initializeBot();
    }

    async initializeBot() {
        const auth = new LocalAuth(this.uuid, path.join(__dirname, '..', 'sessions'));
        this.bot = new WapiBot(this.uuid, auth, { jid: '', pn: '', name: '' });

        this.bot.logger.level = 'error';

        this.bot.on('qr', async (qr: string) => {
            const qrString = await QRCode.toString(qr, { type: 'terminal', small: true });
            console.log(qrString);
        });

        this.bot.on('open', (account: any) => {
            logger.info(`Bot conectado: ${account.name || 'Nishikigi Chisato'}`);
        });

        this.bot.on('close', () => {
            logger.warn('Conexión cerrada');
        });

        this.bot.on('error', (err: any) => logger.error(err));
    }

    async start() {
        await this.bot.login('qr');
    }
}
