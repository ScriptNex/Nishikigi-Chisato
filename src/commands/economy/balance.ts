import { formatNumberLarge } from '../../utils/formatters.ts';
import { getName } from '../../utils/helpers.ts';

export default {
    name: 'balance',
    aliases: ['bal', 'saldo'],
    async execute({ bot, message, services }: any) {
        const chatId = message.key.remoteJid;
        if (!chatId) return;

        const mentioned = message.mentionedJid || [];
        const targetJid = mentioned.length > 0
            ? mentioned[0]
            : (message.quoted ? message.quoted.sender : message.key.participant || message.key.remoteJid);

        const user = await services.economy.getUser(targetJid);
        if (!user) return bot.sendMessage(chatId, { text: 'El usuario no está registrado.' });

        const coins = user.yenes ?? 0;
        const bank = user.bank ?? 0;
        const total = coins + bank;

        const username = await getName(bot, chatId, targetJid, message.pushName);

        const text =
            `ꕣ *Balance de @${username}*\n\n` +
            `⟡ Billetera: *¥${formatNumberLarge(coins)}*\n` +
            `⟡ Banco: *¥${formatNumberLarge(bank)}*\n` +
            `⟡ Total: *¥${formatNumberLarge(total)}*`;

        await bot.sendMessage(chatId, {
            text,
            mentions: [targetJid]
        });
    }
};
