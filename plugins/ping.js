export default {

 command: "ping",
 aliases: ["test"],

 async execute(ctx) {

  const start = Date.now()

  await ctx.react("🏓")

  const end = Date.now()

  const speed = end - start

  await ctx.reply(`🏓 Pong\n⚡ ${speed} ms`)

 }

}
