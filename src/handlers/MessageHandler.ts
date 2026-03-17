export class MessageHandler {
    commands: Map<string, any>;
    services: any;

    constructor(commands: Map<string, any>, services: any) {
        this.commands = commands;
        this.services = services;
    }

    async handle(bot: any, message: any) {
        try {
            const text = message?.message?.conversation || '';
            if (!text || !text.startsWith('#')) return;

            const args = text.slice(1).trim().split(/\s+/);
            const commandName = args.shift()?.toLowerCase();
            if (!commandName) return;

            const command = this.commands.get(commandName);
            if (!command) return;

            await command.execute({
                bot,
                message,
                args,
                services: this.services
            });
        } catch (err) {
            console.error('Error handling message:', err);
        }
    }
}
