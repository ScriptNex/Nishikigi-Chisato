export class MessageHandler {
    commands: Map<string, any>
    services: any

    constructor(commands: Map<string, any>, services: any) {
        this.commands = commands
        this.services = services
    }

    async handle(bot: any, message: any) {
        const text = message.message?.conversation || ''
        if (!text.startsWith('#')) return

        const args = text.slice(1).trim().split(' ')
        const commandName = args.shift()?.toLowerCase()

        const command = this.commands.get(commandName)
        if (!command) return

        await command.execute({
            bot,
            message,
            args,
            services: this.services
        })
    }
}
