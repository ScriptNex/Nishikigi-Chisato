import { MessageHandler as BaseHandler } from '@imjxsx/wapi';

export class MessageHandler {
    commands: Map<string, any>;
    services: any;

    constructor(commands: Map<string, any>, services: any) {
        this.commands = commands;
        this.services = services;
    }

    async handle(bot: any, message: any) {
        const text = message.message?.conversation || '';
        if (!text.startsWith('#')) return;

        const args = text.slice(1).trim().split(' ');
        const commandName = args.shift()?.toLowerCase();
        const command = this.commands.get(commandName);
        if (!command) return;

        await command.execute({ bot, message, args, services: this.services });
    }
}

export const getCachedGroupMetadata = async (bot: any, chatId: string) => {
    if (!bot.store || !bot.store.groups) return null;
    try {
        let group = bot.store.groups[chatId];
        if (!group) {
            const metadata = await bot.groupMetadata(chatId);
            bot.store.groups[chatId] = metadata;
            return metadata;
        }
        return group;
    } catch {
        return null;
    }
};
