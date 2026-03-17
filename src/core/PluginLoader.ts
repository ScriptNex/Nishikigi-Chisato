import fs from 'fs';
import path from 'path';

export class PluginLoader {
    commands: Map<string, any>;

    constructor() {
        this.commands = new Map();
    }

    async loadCommands(dir: string): Promise<{ commandMap: Map<string, any>; beforeHandlers: any[] }> {
        const beforeHandlers: any[] = [];
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                const nested = await this.loadCommands(fullPath);
                nested.commandMap.forEach((cmd, name) => this.commands.set(name, cmd));
                beforeHandlers.push(...nested.beforeHandlers);
                continue;
            }

            if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;

            const modulePath = pathToFileURL(fullPath).href;
            const module = await import(modulePath);
            const cmd = module.default;

            if (cmd?.name) this.commands.set(cmd.name, cmd);
            if (cmd?.beforeHandler) beforeHandlers.push(cmd.beforeHandler);
        }

        return { commandMap: this.commands, beforeHandlers };
    }
}

function pathToFileURL(filePath: string): URL {
    const resolved = path.resolve(filePath);
    return new URL(`file://${resolved}`);
}
