export default {

 command: "ping",

 async execute(ctx) {
  await ctx.reply("pong")
 }

}
