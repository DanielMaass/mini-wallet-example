import { promises as fs } from "fs"
import { exportJWK, generateKeyPair } from "jose"
import { DataKeysSchema, issuers, type DataIssuer, type JWK_OKP_Private, type JWK_OKP_Public } from "mini-vc-wallet-shared"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, "../data")
const keysFile = path.join(dataDir, "keys.json")


export const initData = async () => {

  try {
      // check if data key exists
      await fs.mkdir(dataDir, { recursive: true })
      const raw = await fs.readFile(keysFile, "utf8")
      DataKeysSchema.parse(JSON.parse(raw))
  } catch (error) {
      console.log("Data keys not found, generating new ones...")
      const keys: { [key: string]: { publicJwk: JWK_OKP_Public, privateJwk: JWK_OKP_Private } }[] = await Promise.all(issuers.map(async ({ id, kid }: DataIssuer) => {
        const { publicKey, privateKey } = await generateKeyPair("Ed25519", {
          extractable: true,
        })
        const publicJwk = await exportJWK(publicKey)
        const privateJwk = await exportJWK(privateKey)
        publicJwk.kid = kid
        privateJwk.kid = kid

        return { [id]: { publicJwk, privateJwk } }
      }))

      const keysObj = keys.reduce((acc, current) => ({...acc, ...current}), {})
      await fs.writeFile(keysFile, JSON.stringify(keysObj, null, 2))
  }
}
