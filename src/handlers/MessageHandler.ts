export class MessageHandler {
    commands: Map<string, any>;
    services: any;

    constructor(commands: Map<string, any> = new Map(), services: any = {}) {
        this.commands = commands;
        this.services = services;
    }

    async handle(bot: any, message: any) {
        if (!this.commands) this.commands = new Map();
        const text = message.message?.conversation || '';
        if (!text.startsWith('#')) return;

        const args = text.slice(1).trim().split(' ');
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        const command = this.commands.get(commandName);
        if (!command) return;

        await command.execute({ bot, message, args, services: this.services });
    }
}
