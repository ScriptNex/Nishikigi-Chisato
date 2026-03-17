export default {
    name: 'work',

    async execute({ bot, message, services }: any) {
        const sender = message.key.remoteJid
        const chat = sender

        const reward = Math.floor(Math.random() * 200) + 100

        services.economy.addMoney(sender, reward)

        await bot.sendMessage(chat, {
            text: `💼 Trabajaste y ganaste ¥${reward}`
        })
    }
}
