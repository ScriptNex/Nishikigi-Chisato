import fs from 'fs'
import path from 'path'

export class PluginLoader {
    commands: Map<string, any>

    constructor() {
        this.commands = new Map()
    }

    async loadCommands(dir: string) {
        const files = fs.readdirSync(dir, { recursive: true })

        for (const file of files) {
            if (!file.toString().endsWith('.ts')) continue

            const fullPath = path.join(dir, file.toString())
            const module = await import(fullPath)

            const cmd = module.default

            if (cmd?.name) {
                this.commands.set(cmd.name, cmd)
            }
        }

        return this.commands
    }
}
