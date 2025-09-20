import { type NextFunction, type Request, type Response } from "express"
import { CompactSign, compactVerify } from "jose"
import { nanoid } from "nanoid"
import type { VerifiableCredential } from "../models/credential.ts"
import { readAllCredentials, writeAllCredentials } from "../utils/credentials-file-utils.ts"
import { ensureKeys, issuerMeta } from "../utils/jwks-utils.ts"
import { nowIso } from "../utils/now-iso.ts"

// issue a credential
export const createCredential = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type = ["VerifiableCredential"], claims = {}, subject = "did:example:self" } = req.body || {}
    const id = nanoid()
    const issuedAt = nowIso()
    const { privateKey, publicJwk } = await ensureKeys()

    const credential = {
      id,
      issuer: issuerMeta(publicJwk),
      type: Array.isArray(type) ? type : [String(type)],
      subject,
      issuedAt,
      claims,
    }

    const payload = new TextEncoder().encode(JSON.stringify(credential))
    const jws = await new CompactSign(payload)
      .setProtectedHeader({ alg: "EdDSA", kid: credential.issuer.kid || "" })
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
    res.json({ ok: true, removed })
  } catch (error) {
    next(error)
  }
}

// verify a credential
export const verifyCredential = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { credential, jws } = req.body || {}
    let toVerifyJws = jws

    if (!toVerifyJws) {
      if (!credential || !credential.proof || !credential.proof.jws) {
        return res.status(400).json({ valid: false, error: "no_jws" })
      }
      toVerifyJws = credential.proof.jws
    }

    const { publicKey } = await ensureKeys()

    const { payload, protectedHeader } = await compactVerify(toVerifyJws, publicKey)
    const decoded = JSON.parse(new TextDecoder().decode(payload))

    // If a credential was provided, ensure payload deep‑equals minus proof
    if (credential) {
      const { proof, ...bare } = credential
      const equal = JSON.stringify(bare) === JSON.stringify(decoded)
      if (!equal) return res.json({ valid: false, error: "payload_mismatch", header: protectedHeader })
    }

    res.json({ valid: true, header: protectedHeader, payload: decoded })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    res.json({ valid: false, error: errorMessage })
  }
}
