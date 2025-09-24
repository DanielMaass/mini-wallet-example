import { type NextFunction, type Request, type Response } from "express"
import { CompactSign, compactVerify } from "jose"
import { VerifiableCredentialSchema, type VerifiableCredential } from "mini-vc-wallet-shared"
import { nanoid } from "nanoid"
import { isDeepStrictEqual } from "util"
import { readAllCredentials, writeAllCredentials } from "../utils/credentials-file-utils.js"
import { getCryptoKeysByIssuerId, issuerMeta } from "../utils/jwks-utils.js"
import { nowIso } from "../utils/now-iso.js"

// issue a credential
export const createCredential = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type = "VerifiableCredential", claims = {"no": "content"}, subject = "did:example:no-set", issuer = "did:example:not-set" } = req.body || {}
    const id = nanoid()
    const issuedAt = nowIso()
    const { privateKey } = await getCryptoKeysByIssuerId(issuer)
    const {kid} = await issuerMeta(issuer)

    const credential: VerifiableCredential = {
      id,
      issuer,
      type: ["VerifiableCredential", type],
      subject,
      issuedAt,
      credentialSubject: claims,
    }

    const payload = new TextEncoder().encode(JSON.stringify(credential))
    const jws = await new CompactSign(payload)
      .setProtectedHeader({ alg: "EdDSA", kid })
      .sign(privateKey)

    const stored: VerifiableCredential = { ...credential, proof: { type: "Ed25519Signature2018", jws } }

    const all = await readAllCredentials()
    all.unshift(stored)
    await writeAllCredentials(all)

    res.status(201).json(stored)
  } catch (error) {
    next(error)
  }
}

// Read all credentials
export const getCredentials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const all = await readAllCredentials()
    res.json(all)
  } catch (error) {
    next(error)
  }
}

// Read single credential
export const getCredentialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    if (!id) return res.status(400).json({ error: "invalid_id" })
    const all = await readAllCredentials()
    const found = all.find((c) => c.id === id)
    if (!found) return res.status(404).json({ error: "not_found" })
    res.json(found)
  } catch (error) {
    next(error)
  }
}

// Delete a credential
export const deleteCredential = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    if (!id) return res.status(400).json({ error: "invalid_id" })
    const all = await readAllCredentials()
    const idx = all.findIndex((c) => c.id === id)
    if (idx === -1) return res.status(404).json({ error: "not_found" })
    const [removed] = all.splice(idx, 1)
    await writeAllCredentials(all)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

// verify a credential
export const verifyCredential = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body || {}
    // check for valid credential format
    const credential = VerifiableCredentialSchema.parse(data)
    const { jws } = credential.proof
    // check existing issuer
    const { publicKey } = await getCryptoKeysByIssuerId(credential.issuer)
    // ceck existing subject
    await issuerMeta(credential.subject) // throws if not found
    // verify signature
    const { payload, protectedHeader } = await compactVerify(jws, publicKey)
    // check payload integrity
    const decoded = JSON.parse(new TextDecoder().decode(payload))
    const { proof, ...plain } = credential
    const equal = isDeepStrictEqual(plain, decoded)
    if (!equal) return res.json({ valid: false, error: "payload_mismatch", header: protectedHeader })

    res.json({ valid: true, header: protectedHeader, payload: decoded })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    res.json({ valid: false, error: errorMessage })
  }
}
