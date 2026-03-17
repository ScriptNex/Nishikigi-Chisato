export class PluginLoader {
    constructor() {}

    async loadCommands(dir: string) {
        return { commandMap: new Map(), beforeHandlers: [] };
    }
}
