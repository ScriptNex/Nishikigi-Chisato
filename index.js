import { createAPI, createConnection } from "whispa-js"
import config from "./config.js"

async function start() {

 const connection = await createConnection({
  sessionPath: config.sessionPath,
  botName: config.botName,
  logger: console
 })

 const api = await createAPI({
  ...config,
  connection,
  logger: console
 })

 api.start()

 connection.onSocketUpdate(sock => {

  sock.ev.removeAllListeners("messages.upsert")

  sock.ev.on("messages.upsert", async ({ messages }) => {

   const msg = messages?.[0]
   if (!msg || !msg.message) return

   await api.handle({
    raw: msg,
    sock
   })

  })

 })

 console.log("🌸 Nishikigi Chisato iniciada")

}

start()
