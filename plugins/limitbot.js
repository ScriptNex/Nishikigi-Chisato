export default {

 command: "limitbot",

 async execute(ctx) {

  const total = ctx.sock.instances.count()

  await ctx.reply(`🤖 Subbots activos: ${total}`)

 }

}
