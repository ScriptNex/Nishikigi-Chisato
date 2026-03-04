export default {

 name: "stopbot",
 command: "stopbot",
 owner: true,

 async execute(ctx) {

  const id = ctx.sender.split("@")[0]

  if (!ctx.sock?.stopSubBot) {
   await ctx.reply("⚠️ Sistema de subbots no disponible")
   return
  }

  ctx.sock.stopSubBot(id)

  await ctx.reply("🛑 Subbot detenido")

 }

}
