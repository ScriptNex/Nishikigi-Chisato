import { Bot as WapiBot, LocalAuth } from '@imjxsx/wapi';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import { PluginLoader } from './PluginLoader.ts';
import { MessageHandler } from '../handlers/MessageHandler.ts';
import { EconomyService } from '../services/EconomyService.ts';
import pino from 'pino';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Bot {
    bot: WapiBot | null;
    pluginLoader: PluginLoader;
    messageHandler: MessageHandler;
    economyService: EconomyService;
    uuid: string;
    sessionsDir: string;
    logger: pino.Logger;

    constructor() {
        this.uuid = '4f3b2a1c-7e9a-4d2f-8b6f-12a3456b7890';
        this.sessionsDir = path.join(__dirname, '..', 'sessions');
        this.pluginLoader = new PluginLoader();
        this.bot = null;
        this.logger = pino({ level: 'error' });
        this.economyService = new EconomyService();
        this.messageHandler = new MessageHandler(this.pluginLoader.commands, {
            economy: this.economyService
        });
    }

    async initialize() {
        await this.loadCommands();
        await this.initializeBot();
    }

    async loadCommands() {
        const commandsDir = path.join(__dirname, '..', 'commands');
        await this.pluginLoader.loadCommands(commandsDir);
    }

    async initializeBot() {
        const auth = new LocalAuth(this.uuid, this.sessionsDir);
        this.bot = new WapiBot(this.uuid, auth, { jid: '', pn: '', name: 'Nishikigi Chisato' });
        (this.bot as any).logger = this.logger;

        this.bot.on('qr', async (qr: string) => {
            console.log(await QRCode.toString(qr, { type: 'terminal', small: true }));
        });

        this.bot.on('open', (account: any) => {
            this.logger.info(`Bot conectado: ${account.name || 'Nishikigi Chisato'}`);
            (global as any).mainBot = this.bot;

            this.bot?.ws.ev.on('messages.upsert', ({ messages }: { messages: any[] }) => {
                for (const m of messages) {
                    this.messageHandler.handle(this.bot!, m).catch(err =>
                        this.logger.error('Error procesando mensaje:', err)
                    );
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
