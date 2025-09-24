import { promises as fs } from "fs"
import { importJWK, type JWK_OKP_Public } from "jose"
import { issuers, type DataIssuer } from "mini-vc-wallet-shared"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, "../../data")
const keysFile = path.join(dataDir, "keys.json")

export async function getCryptoKeysByIssuerId(id:string) {
  try {
    await fs.mkdir(dataDir, { recursive: true })
    const raw = await fs.readFile(keysFile, "utf8")
    const dataKeys = JSON.parse(raw)
    const { privateJwk, publicJwk } = dataKeys[id] || {}
    const privateKey = await importJWK(privateJwk, "EdDSA")
    const publicKey = await importJWK(publicJwk, "EdDSA")
    return { privateKey, publicKey, privateJwk, publicJwk }
  } catch (error) {
    throw new Error(`No keys found for issuer id: ${id}`)
  }
}

export async function issuerMeta(id: string) {
  const issuer = issuers.find((i: DataIssuer) => i.id === id)
  if (!issuer) throw new Error(`No issuer found for id: ${id}`)
  const {publicJwk} = await getCryptoKeysByIssuerId(id)

  return {
    id,
    kid: issuer.kid,
    publicKeyJwk: publicJwk,
  }
}

export const jwksRoute = (publicJwk: JWK_OKP_Public) => ({ keys: [{ ...publicJwk, use: "sig", alg: "EdDSA" }] })
