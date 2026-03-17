export default {
    name: 'balance',

    async execute({ bot, message, services }: any) {
        const chat = message.key.remoteJid
        const user = services.economy.getUser(chat)

        await bot.sendMessage(chat, {
            text: `💴 Balance\n\n💰 Yenes: ¥${user.yenes}\n🏦 Banco: ¥${user.bank}`
        })
    }
}
