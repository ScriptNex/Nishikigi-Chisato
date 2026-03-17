export default {
    name: 'work',

    async execute({ bot, message, services }: any) {
        const sender = message.key.remoteJid;
        if (!services?.economy) return;

        const reward = Math.floor(Math.random() * 200) + 100;

        services.economy.addMoney(sender, reward);

        await bot.sendMessage(sender, {
            text: `💼 Trabajaste y ganaste ¥${reward}`
        });
    }
}
