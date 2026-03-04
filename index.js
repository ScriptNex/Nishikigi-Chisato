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

 connection.onSocketUpdate(sock => {

  sock.ev.on("messages.upsert", async ({ messages }) => {

   const msg = messages?.[0]
   if (!msg || !msg.message) return

   await api.handle({
    raw: msg,
    sock
   })

  })

 })

 api.start()

 console.log("🌸 Nishikigi Chisato iniciada")

}

start()
