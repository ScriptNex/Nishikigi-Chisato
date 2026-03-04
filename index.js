import { createAPI } from "whispa-js"
import { createConnection } from "whispa-js/src/core/connection.js"

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
  api.lifecycle.start()
 })

 console.log("🌸 Nishikigi Chisato iniciada")

}

start()
