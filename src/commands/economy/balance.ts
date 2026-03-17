import { normalize } from '../../utils/permissions.ts';
import { formatNumberLarge, styleText } from '../../utils/formatters.ts';

export default {
    name: 'balance',
    aliases: ['bal', 'saldo'],
    async execute({ bot, message, services }: any) {
        const senderJid = message.key.participant || message.key.remoteJid;
        if (!senderJid) return;

        const user = await services.economy.getUser(senderJid);
        const coins = user.yenes ?? 0;
        const bank = user.bank ?? 0;
        const total = coins + bank;

        const rawNumber = senderJid.split('@')[0].replace(/[^0-9]/g, '');

        const username =
            message.pushName?.trim() ||
            `+${rawNumber}`;

        const text = styleText(
            `ꕣ *Balance de @${username}*\n\n` +
            `⟡ Billetera: *¥${formatNumberLarge(coins)}*\n` +
            `⟡ Banco: *¥${formatNumberLarge(bank)}*\n` +
            `⟡ Total: *¥${formatNumberLarge(total)}*`
        );

        await bot.sendMessage(message.key.remoteJid, {
            text,
            mentions: [senderJid]
        });
    }
};
