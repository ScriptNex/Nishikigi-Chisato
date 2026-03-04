import { createAPI, createConnection } from "whispa-js"
import config from "./config.js"

async function start() {

 const connection = await createConnection({
  sessionPath: config.sessionPath,
  botName: config.botName,
  logger: console
 })

 const api = await createAPI({
  prefix: config.prefix,
  pluginsDir: config.pluginsDir,
  connection,
  logger: console
 })

 connection.onSocketUpdate(sock => {

  sock.ev.on("messages.upsert", async ({ messages }) => {

   const msg = messages?.[0]

   if (!msg?.message) return

   await api.handle({
    raw: msg,
    sock
   })

  })

 })

 api.start()

 console.log("🌸 Nishikigi Chisato iniciado")

}

start()
