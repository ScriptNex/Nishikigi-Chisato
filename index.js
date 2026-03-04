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

 console.log("🌸 Nishikigi Chisato iniciada")

}

start()
