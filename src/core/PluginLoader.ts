import fs from 'fs';
import path from 'path';

export class PluginLoader {
    commands: Map<string, any>;

    constructor() {
        this.commands = new Map();
    }

    async loadCommands(dir: string): Promise<Map<string, any>> {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            if (!file.endsWith('.ts')) continue;

            const fullPath = path.join(dir, file);
            const module = await import(fullPath);
            const cmd = module.default;

            if (cmd?.name) {
                this.commands.set(cmd.name, cmd);
            }
        }

        return this.commands;
    }
}
