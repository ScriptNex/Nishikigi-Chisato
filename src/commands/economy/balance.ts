import { formatNumberLarge, styleText } from '../../utils/formatters.js';

export default {
    name: 'balance',
    aliases: ['bal', 'saldo'],
    async execute({ bot, message, services }: { bot: any; message: any; services: any }) {
        const sender: string = message.key.remoteJid;
        const user = services.economy.getUser(sender) || { yenes: 0, bank: 0 };

        const coins = user.yenes || 0;
        const bank = user.bank || 0;
        const total = coins + bank;

        const text = styleText(
            `ꕣ *Balance de Usuario*\n\n` +
            `⟡ Billetera: *¥${formatNumberLarge(coins)}*\n` +
            `⟡ Banco: *¥${formatNumberLarge(bank)}*\n` +
            `⟡ Total: *¥${formatNumberLarge(total)}*`
        );

        await bot.sendMessage(sender, {
            text,
            mentions: [sender]
        });
    }
};
