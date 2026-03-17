import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export class PluginLoader {
    commands: Map<string, any>;

    constructor() {
        this.commands = new Map();
    }

    async loadCommands(dir: string) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const commandsDir = path.isAbsolute(dir) ? dir : path.join(__dirname, dir);

        const files = fs.readdirSync(commandsDir, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                await this.loadCommands(path.join(commandsDir, file.name));
                continue;
            }
            if (!file.name.endsWith('.ts') && !file.name.endsWith('.js')) continue;

            const fullPath = path.join(commandsDir, file.name);
            const module = await import(fullPath);
            const cmd = module.default;

            if (cmd?.name) this.commands.set(cmd.name, cmd);
        }

        return { commandMap: this.commands };
    }
}
