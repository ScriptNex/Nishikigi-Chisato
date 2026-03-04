export default {

 name: "menu",
 command: "menu",
 aliases: ["help"],

 async execute(ctx) {

  await ctx.sendButtons(
   "🌸 *Nishikigi Chisato*\n\nSelecciona una opción:",
   [
    { id: ".ping", text: "🏓 Ping" },
    { id: ".code", text: "🤖 Jadibot" },
    { id: ".listbot", text: "📜 Subbots" }
   ],
   "Whispa Framework"
  )

 }

}
