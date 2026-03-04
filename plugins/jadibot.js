export default {

 command: "jadibot",

 async execute(ctx) {

  const id = ctx.sender.split("@")[0]

  await ctx.reply("🌸 Iniciando subbot... escanea el QR en consola")

  await ctx.sock.createSubBot(id)

 }

}
