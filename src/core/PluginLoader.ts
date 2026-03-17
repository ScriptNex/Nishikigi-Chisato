import fs from 'fs';
import path from 'path';

export class PluginLoader {
    commands: Map<string, any>;

    constructor() {
        this.commands = new Map();
    }

    async loadCommands(dir: string) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                await this.loadCommands(fullPath);
                continue;
            }

            if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;

            const module = await import(fullPath);
            const cmd = module.default;
            if (cmd?.name) this.commands.set(cmd.name, cmd);
        }

        return this.commands;
    }
}
