export class MessageHandler {
    commands: Map<string, any>;
    services: any;

    constructor(commands: Map<string, any>, services: any) {
        this.commands = commands;
        this.services = services;
    }

    async handle(bot: any, message: any) {
        try {
            if (!message || !message.message || !message.key) return;

            const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
            if (!text.startsWith('#')) return;

            const args = text.slice(1).trim().split(/\s+/);
            const commandName = args.shift()?.toLowerCase();
            if (!commandName) return;

            const command = this.commands.get(commandName);
            if (!command) return;

            await command.execute({ bot, message, args, services: this.services });
        } catch (err) {
            console.error('[MessageHandler] Error procesando mensaje:', err);
        }
    }
}
