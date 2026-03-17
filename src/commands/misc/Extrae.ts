import { getName } from '../../utils/helpers.ts';

export default {
    name: 'testjid',
    aliases: ['checkjid'],
    async execute({ bot, message }: any) {
        const chatId = message.key.remoteJid;
        if (!chatId) return;

        const mentioned = message.mentionedJid || [];
        const targetJid = mentioned.length > 0
            ? mentioned[0]
            : (message.quoted ? message.quoted.sender : message.key.participant || message.key.remoteJid);

        const username = await getName(bot, chatId, targetJid, message.pushName);

        const jidNumber = targetJid.split('@')[0];

        const text = 
            `Target JID completo: ${targetJid}\n` +
            `Número extraído: ${jidNumber}\n` +
            `Nombre resuelto: ${username}`;

        await bot.sendMessage(chatId, { text });
    }
};
