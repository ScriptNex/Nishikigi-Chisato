export default {
    name: 'balance',

    async execute({ bot, message, services }: any) {
        const sender = message.key.remoteJid;
        if (!services?.economy) return;

        const user = services.economy.getUser(sender);

        await bot.sendMessage(sender, {
            text: `💴 Balance\n\n💰 Yenes: ¥${user.yenes}\n🏦 Banco: ¥${user.bank}`
        });
    }
}
