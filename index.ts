import { Bot } from './src/core/Bot.ts';

(async () => {
    const bot = new Bot();
    await bot.initialize();
    await bot.start();
})();
