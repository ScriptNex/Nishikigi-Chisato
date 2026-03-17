export default {
    name: 'menu',
    async execute({ bot, message }: any) {
        const chat = message.key.remoteJid;
        const text = `
╭━━━〔 Nishikigi Chisato 〕━━━⬣
┃
┃ 💴 ECONOMÍA
┃ ├ #balance
┃ ├ #work
┃
╰━━━━━━━━━━━━━━━━⬣
        `.trim();

        await bot.sendMessage(chat, { text });
    }
}
