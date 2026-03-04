export default {

 name: "jadibot",
 command: "code",

 async execute(ctx) {

  const number = ctx.sender.split("@")[0]

  if (!ctx.sock?.requestCode) {
   return ctx.reply("⚠️ Sistema de subbots no disponible")
  }

  if (ctx.sock?.listSubBots && ctx.sock.listSubBots().includes(number)) {
   return ctx.reply("🤖 Ya tienes un subbot activo")
  }

  try {

   const code = await ctx.sock.requestCode(number)

   if (!code) {
    return ctx.reply("❌ No se pudo generar el código")
   }

   await ctx.reply(
`🌸 *Código de vinculación*

${code}

WhatsApp → Dispositivos vinculados → Vincular dispositivo`
   )

  } catch (err) {

   await ctx.reply("❌ Error generando el código")

  }

 }

}
