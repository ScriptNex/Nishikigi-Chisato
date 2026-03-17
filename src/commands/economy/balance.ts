import { formatNumberLarge } from '../../utils/formatters.ts';

export default {
    name: 'balance',
    aliases: ['bal', 'saldo'],
    async execute({ bot, message, services }: any) {
        const senderJid = message.key.participant || message.key.remoteJid;
        if (!senderJid) return;

        const chatId = message.key.remoteJid;
        const mentioned = message.mentionedJid || [];
        const targetJid = mentioned.length > 0
            ? mentioned[0]
            : (message.quoted ? message.quoted.sender : senderJid);

        const user = await services.economy.getUser(targetJid);
        if (!user) return bot.sendMessage(chatId, { text: 'El usuario no está registrado.' });

        const coins = user.yenes ?? 0;
        const bank = user.bank ?? 0;
        const total = coins + bank;

        const rawNumber = targetJid.split('@')[0];
        const username = (message.pushName?.trim() || `+${rawNumber}`);

                const text =
            `ꕣ *Balance de ${username} (@${rawNumber})*\n\n` +
            `⟡ Billetera: *¥${formatNumberLarge(coins)}*\n` +
            `⟡ Banco: *¥${formatNumberLarge(bank)}*\n` +
            `⟡ Total: *¥${formatNumberLarge(total)}*`;

        
        await bot.sendMessage(chatId, {
            text,
            mentions: [targetJid]
        });
    }
};
