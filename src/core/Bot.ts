import { Bot as WapiBot, LocalAuth } from '@imjxsx/wapi';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';
import { PluginLoader } from './PluginLoader.ts';
import { MessageHandler } from './MessageHandler.ts';
import { EconomyService } from '../services/economy/EconomyService.ts';
import FileUtils from '../utils/FileUtils.ts';
import { globalLogger } from '../utils/Logger.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Bot {
    bot: WapiBot | null;
    pluginLoader: PluginLoader;
    messageHandler: MessageHandler;
    uuid: string;
    sessionsDir: string;
    logger: pino.Logger;
    services: { economy: EconomyService };

    constructor() {
        this.uuid = '4f3b2a1c-7e9a-4d2f-8b6f-12a3456b7890';
        this.sessionsDir = path.join(__dirname, '..', 'sessions');
        this.pluginLoader = new PluginLoader();
        this.bot = null;
        this.logger = pino({ level: 'info' });
        this.messageHandler = new MessageHandler();
        this.services = { economy: new EconomyService() };
    }

    async initialize() {
        this.logger.info('Inicializando Nishikigi Chisato...');
        await this.loadCommands();
        await this.initializeBot();
    }

    async loadCommands() {
        const { commandMap, beforeHandlers } = await this.pluginLoader.loadCommands(
            path.join(__dirname, '..', 'commands')
        );
        (global as any).commandMap = commandMap;
        (global as any).beforeHandlers = beforeHandlers;
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
            (global as any).mainBot = this.bot;

            this.bot?.ws.ev.on('messages.upsert', async ({ messages }: { messages: any[] }) => {
                for (const m of messages) {
                    try {
                        await this.messageHandler.handleMessage(this.bot!, m, this.services);
                    } catch (err) {
                        this.logger.error('Error procesando mensaje:', err);
                    }
                }
            });
        });

        this.bot.on('error', (err: any) => this.logger.error(err));
    }

    async start() {
        if (!this.bot) throw new Error('Bot no inicializado');
        await this.bot.login('qr');
    }
}
