import { createConnection } from "whispa-js"
import config from "./config.js"

async function start() {

 const connection = await createConnection({
  sessionPath: config.sessionPath,
  botName: config.botName,
  logger: console
 })

 console.log("🌸 Nishikigi Chisato iniciado")

}

start()
