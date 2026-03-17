export default {
    name: 'balance',
    async execute({ bot, message, services, args }: {
        bot: any;
        message: any;
        services: any;
        args?: string[];
    }) {
        const sender: string = message.key.remoteJid;
        const user = services.economy.getUser(sender);

        const number = sender.split('@')[0];

        await bot.sendMessage(sender, {
            text: `💴 Balance de @${number}\n\n💰 Yenes: ¥${user.yenes}\n🏦 Banco: ¥${user.bank}`,
            mentions: [sender]
        });
    }
}
