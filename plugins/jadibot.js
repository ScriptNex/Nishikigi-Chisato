export default {

 command: "code",

 async execute(ctx) {

  const number = ctx.sender.split("@")[0]

  const code = await ctx.sock.requestCode(number)

  if (!code) {
   return ctx.reply("No se pudo generar el código")
  }

  await ctx.reply(
   `🌸 Código de vinculación\n\n${code}\n\nWhatsApp → Dispositivos vinculados → Vincular con número`
  )

 }

}
