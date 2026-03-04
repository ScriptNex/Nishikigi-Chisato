import { createAPI } from "whispa-js"
import config from "./config.js"

async function start() {

 await createAPI(config)

 console.log("🌸 Nishikigi Chisato iniciada")

}

start()
