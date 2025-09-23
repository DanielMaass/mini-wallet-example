// scripts/dev-server.mjs
import { spawn } from "node:child_process"

// lästige Shell-ENVs killen (zur Sicherheit)
for (const k of ["ENV", "BASH_ENV", "PROMPT_COMMAND", "ZDOTDIR", "DEBUGCOMMAND"]) {
  delete process.env[k]
}

// Helper: Promise-basierter Spawn (ohne Shell)
function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", ...opts })
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))))
  })
}

;(async () => {
  // Nur die benötigten Workspaces installieren – shallow, damit Binaries im jeweiligen Workspace landen
  await run("npm", [
    "ci",
    "--workspace",
    "shared",
    "--workspace",
    "server",
    "--include-workspace-root=false",
    "--install-strategy=shallow",
  ])

  // PATH so setzen, dass tsx & Co. aus dem server-Workspace gefunden werden
  process.env.PATH = `/app/server/node_modules/.bin:${process.env.PATH || ""}`

  // shared im Watch-Modus starten (im Hintergrund)
  const shared = spawn("npm", ["run", "--workspace", "shared", "dev"], { stdio: "inherit" })

  // server im Watch-Modus starten (im Vordergrund)
  await run("npm", ["run", "--workspace", "server", "dev"])

  // falls server endet, shared auch beenden
  shared.kill("SIGINT")
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
