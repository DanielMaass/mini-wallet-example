import { promises as fs } from "fs"
import { exportJWK, generateKeyPair, importJWK, type JWK_OKP_Public } from "jose"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, "../../data")
const keysFile = path.join(dataDir, "keys.json")

const KID = process.env.KID || "default-key-id"
const ISSUER_ID = process.env.ISSUER_ID || "default-issuer-id"

export async function ensureKeys() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    const raw = await fs.readFile(keysFile, "utf8")
    const { privateJwk, publicJwk } = JSON.parse(raw)
    console.log("########")
    console.log({ raw, privateJwk, publicJwk })
    console.log("########")
    const privateKey = await importJWK(privateJwk, "EdDSA")
    const publicKey = await importJWK(publicJwk, "EdDSA")
    return { privateKey, publicKey, privateJwk, publicJwk }
  } catch (error) {
    console.error("### Error reading keys file:", error)
    const { publicKey, privateKey } = await generateKeyPair("Ed25519", {
      extractable: true,
    })
    console.log("########")
    console.log({ publicKey, privateKey })
    console.log("########")
    const publicJwk = await exportJWK(publicKey)
    const privateJwk = await exportJWK(privateKey)
    if (!KID) {
      throw new Error("Environment variable KID is not defined")
    }
    publicJwk.kid = KID
    privateJwk.kid = KID
    await fs.writeFile(keysFile, JSON.stringify({ publicJwk, privateJwk }, null, 2))
    return { privateKey, publicKey, privateJwk, publicJwk }
  }
}

export function issuerMeta(publicJwk: JWK_OKP_Public) {
  return {
    id: ISSUER_ID,
    kid: KID,
    publicKeyJwk: publicJwk,
  }
}

export const jwksRoute = (publicJwk: JWK_OKP_Public) => ({ keys: [{ ...publicJwk, use: "sig", alg: "EdDSA" }] })
