import { formatNumberLarge, styleText } from './helpers.js';
import { globalLogger as logger } from './Logger.js';

export default {
    commands: ['board', 'leaderboard', 'top', 'baltop'],
    async execute(ctx: any) {
        const { args, isGroup, dbService, bot, chatId, reply, sender, from } = ctx;
        const isGlobal = args[0]?.toLowerCase() === 'global' || args[0]?.toLowerCase() === 'g';
        const senderId = sender || from || chatId;

        let users: any[] = [];
        let title = '';

        if (isGlobal || !isGroup) {
            const allUsers = await dbService.getTopUsers(100);

            users = allUsers
                .map((u: any) => ({
                    id: u.id,
                    name: u.name,
                    coins: u.economy?.coins || 0,
                    bank: u.economy?.bank || 0,
                    total: (u.economy?.coins || 0) + (u.economy?.bank || 0)
                }))
                .filter((u: any) => u.total > 0)
                .sort((a, b) => b.total - a.total)
                .slice(0, 10);

            title = '🌍 Ranking Global de Economía';
        } else {
            try {
                const groupMetadata = await bot.groupMetadata(chatId);
                const participants = groupMetadata.participants || [];
                const participantsMap = new Map();
                const searchIds: string[] = [];

                participants.forEach((p: any) => {
                    const numero = p.id.split('@')[0].split(':')[0];
                    participantsMap.set(numero, p.id);
                    searchIds.push(p.id);
                    const normalized = `${numero}@s.whatsapp.net`;
                    if (normalized !== p.id) {
                        searchIds.push(normalized);
                    }
                });

                const dbUsers = await dbService.getUsersByIds(searchIds);

                const economyMap = new Map();
                dbUsers.forEach((u: any) => {
                    const numero = u.id.split('@')[0].split(':')[0];
                    const coins = u.economy?.coins || 0;
                    const bank = u.economy?.bank || 0;
                    const total = coins + bank;

                    if (!economyMap.has(numero) || economyMap.get(numero).total < total) {
                        economyMap.set(numero, {
                            id: u.id,
                            name: u.name,
                            coins,
                            bank,
                            total
                        });
                    }
                });

                users = Array.from(participantsMap.entries())
                    .map(([numero, jid]) => {
                        const data = economyMap.get(numero);
                        if (data) {
                            return {
                                ...data,
                                realJid: jid
                            };
                        }
                        return null;
                    })
                    .filter(u => u !== null && u.total > 0)
                    .sort((a: any, b: any) => b.total - a.total)
                    .slice(0, 10);

                title = `👥 Ranking del Grupo ${groupMetadata.subject}`;
            } catch (err) {
                logger.error('Error fetching group leaderboard:', err);
                return reply('⚠️ Error al obtener el ranking del grupo.');
            }
        }

        if (users.length === 0) {
            return reply('⚠️ No hay usuarios con coins en este ranking.');
        }

        let message = `${title}\n\n`;
        message += '🏆 Top 10 Ricachones\n\n';

        const mentions: string[] = [];

        users.forEach((user, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
            const mentionJid = user.realJid || user.id;
            const displayId = mentionJid.split('@')[0].split(':')[0];

            mentions.push(mentionJid);
            message += `${medal} @${displayId}\n`;
            message += `> 💰 Coins » *$${formatNumberLarge(user.coins)}*\n`;
            message += `> 🏦 Banco » *$${formatNumberLarge(user.bank)}*\n`;
            message += `> 📊 Total » *$${formatNumberLarge(user.total)}*\n\n`;
        });

        message += '💪 _Sigue esforzándote!_';

        if (!isGlobal && isGroup) {
            message += '\n\n> Usa *#baltop global* para ver el ranking mundial.';
        }

        await reply(styleText(message), { mentions });
    }
};
