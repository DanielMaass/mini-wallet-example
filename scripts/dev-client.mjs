// scripts/dev-client.mjs
import { spawn } from "node:child_process"

for (const k of ["ENV", "BASH_ENV", "PROMPT_COMMAND", "ZDOTDIR", "DEBUGCOMMAND"]) {
  delete process.env[k]
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", ...opts })
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))))
  })
}

;(async () => {
  await run("npm", ["ci", "--workspace", "client", "--include-workspace-root=false", "--install-strategy=shallow"])
  process.env.PATH = `/app/client/node_modules/.bin:${process.env.PATH || ""}`
  await run("npm", ["run", "--workspace", "client", "dev", "--", "--host"])
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
