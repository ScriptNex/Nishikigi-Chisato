export default {

 command:"ping",

 async execute(ctx){

  if(!ctx?.reply) return

  await ctx.reply("🏓 Pong 🌸")

 }

}
