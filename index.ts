import { Bot } from './src/core/Bot.js';
import { globalLogger as logger } from './src/utils/Logger.js';

process.on('uncaughtException', (err: Error) =>
    logger.error('🔥 Uncaught Exception:', err)
);

process.on('unhandledRejection', (reason: any, promise: Promise<any>) =>
    logger.error('🔥 Unhandled Rejection', { promise, reason })
);

const config = {
    uuid: '1f1332f4-7c2a-4b88-b4ca-bd56d07ed713',
    sessionsDir: 'sessions',
    ownerJid: '639972367773@s.whatsapp.net',
    prefix: '#',
};

const nodeRole = process.env.NODE_ROLE || 'main';
const bot = new Bot(config);

if (nodeRole === 'worker') {
    logger.info('✿ Alya Kujou Bot - Modo WORKER');
    await bot.initializeWorker();
    logger.info('✿ Worker iniciado exitosamente');
} else {
    logger.info('✿ Alya Kujou Bot - Iniciando...');
    await bot.initialize();
    await bot.start();

    try {
        const { CLUSTER_CONFIG } = await import('./src/config/nodes.js');
        const { WorkerServer } = await import('./src/services/cluster/WorkerServer.js');
        const worker = new WorkerServer();
        await worker.start(CLUSTER_CONFIG.port);
    } catch (e: any) {
        logger.warn('⚠ WorkerServer not started on main:', e);
    }

    try {
        const { NodeManager } = await import('./src/services/cluster/NodeManager.js');
        const nodeManager = new NodeManager();
        (global as any).nodeManager = nodeManager;
        nodeManager.start();
        logger.info('✿ NodeManager iniciado');
    } catch (e: any) {
        logger.warn('⚠ NodeManager not started:', e);
    }

    logger.info('✿ Bot iniciado exitosamente');
}
