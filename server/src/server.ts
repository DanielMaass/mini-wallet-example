import app from "./app.js"
import config from "./config.js"
import { initData } from './initData.js'

await initData()

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`)
})
