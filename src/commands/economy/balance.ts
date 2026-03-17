export default {
    name: 'balance',
    async execute({ bot, message, services }: any) {
        const sender = message.key.remoteJid;
        const user = services.economy.getUser(sender);
        const number = sender.split('@')[0];

        await bot.sendMessage(sender, {
            text: `💴 Balance de @${number}\n\n💰 Yenes: ¥${user.yenes}\n🏦 Banco: ¥${user.bank}`,
            mentions: [sender]
        });
    }
}
