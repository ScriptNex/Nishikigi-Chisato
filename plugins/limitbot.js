export default {

 name: "limitbot",
 command: "limitbot",
 owner: true,

 async execute(ctx) {

  if (!ctx.sock?.listSubBots) {
   return ctx.reply("⚠️ Sistema de subbots no disponible")
  }

  const bots = ctx.sock.listSubBots()

  const total = bots.length

  await ctx.reply(`🤖 Subbots activos: ${total}`)

 }

}
