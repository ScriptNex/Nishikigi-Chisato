import { createAPI } from "whispa-js"
import config from "./config.js"

async function start(){

 try{

  console.log(`🌸 Iniciando ${config.botName}...`)

  await createAPI(config)

 }catch(e){

  console.error("❌ Error iniciando bot")

  console.error(e)

  process.exit(1)

 }

}

start()
