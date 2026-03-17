import { formatNumberLarge } from '../../utils/formatters.ts';
import { styleText } from '../../utils/helpers.ts';

export default {
    name: 'balance',
    async execute({ bot, message, services }: any) {
        const sender = message.key.remoteJid;
        const user = services.economy.getUser(sender);

        const coins = user.yenes || 0;
        const bank = user.bank || 0;
        const total = coins + bank;

        await bot.sendMessage(sender, {
            text: styleText(
                `💴 Balance de @${sender.split('@')[0]}\n\n` +
                `💰 Yenes: ¥${formatNumberLarge(coins)}\n` +
                `🏦 Banco: ¥${formatNumberLarge(bank)}\n` +
                `⛀ Total: ¥${formatNumberLarge(total)}`
            ),
            mentions: [sender]
        });
    }
};
