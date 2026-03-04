export default {

 command: "stopbot",

 async execute(ctx) {

  const id = ctx.sender.split("@")[0]

  ctx.sock.stopSubBot(id)

  await ctx.reply("🛑 Subbot detenido")

 }

}
