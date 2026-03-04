export default {

 name: "listbot",
 command: "listbot",
 owner: true,

 async execute(ctx) {

  if (!ctx.sock?.listSubBots) {
   return ctx.reply("⚠️ Sistema de subbots no disponible")
  }

  const bots = ctx.sock.listSubBots()

  if (!bots || !bots.length) {
   return ctx.reply("🤖 No hay subbots activos")
  }

  let text = "🤖 *Subbots activos*\n\n"

  bots.forEach((id, i) => {
   text += `${i + 1}. ${id}\n`
  })

  await ctx.reply(text)

 }

}
