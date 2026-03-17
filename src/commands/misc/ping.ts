export default {
    name: 'ping',
    async execute({ bot, message }: any) {
        
        if (!message?.key?.remoteJid) {
            console.warn('[ping] Mensaje inválido recibido, ignorando');
            return;
        }

        const chat = message.key.remoteJid;

        try {
            await bot.sendMessage(chat, { text: '🏓 Pong!' });
        } catch (err) {
            console.error('[ping] Error enviando mensaje:', err);
        }
    }
};
