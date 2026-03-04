export default {

 command: "listbot",

 async execute(ctx) {

  const bots = ctx.sock.listSubBots()

  if (!bots.length) {
    return ctx.reply("No hay subbots activos")
  }

  let text = "🤖 Subbots activos:\n\n"

  bots.forEach((id,i)=>{
    text += `${i+1}. ${id}\n`
  })

  await ctx.reply(text)

 }

}
