export default {
    name: 'balance',

    async execute({ bot, message, services }: any) {
        const sender = message.key.remoteJid
        const chat = sender

        const user = services.economy.getUser(sender)

        await bot.sendMessage(chat, {
            text: `💴 Balance\n\n💰 Yenes: ¥${user.yenes}\n🏦 Banco: ¥${user.bank}`
        })
    }
}
