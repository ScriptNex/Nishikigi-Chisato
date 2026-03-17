export default {
    name: 'work',

    async execute({ bot, message, services }: any) {
        const chat = message.key.remoteJid
        const reward = Math.floor(Math.random() * 200) + 100

        services.economy.addMoney(chat, reward)

        await bot.sendMessage(chat, {
            text: `💼 Trabajaste y ganaste ¥${reward}`
        })
    }
}
