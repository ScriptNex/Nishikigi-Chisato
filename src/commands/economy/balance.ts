import { MessageType } from '@imjxsx/wapi';

export default {
    name: 'balance',
    async execute({ bot, message, services }: any) {
        const senderJid = message.key.participant || message.key.remoteJid;
        if (!senderJid) return;

        const user = await services.economy.getUser(senderJid);

        const text = `💴 Balance de @${senderJid.split('@')[0]}\n\n` +
                     `💰 Yenes: ¥${user.yenes}\n` +
                     `🏦 Banco: ¥${user.bank}`;

        await bot.sendMessage(message.key.remoteJid, {
            text,
            mentions: [senderJid],
            type: MessageType.text
        });
    }
};
