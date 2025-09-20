import { type JWK_OKP_Public } from "jose"

export interface IssuerMeta {
  id: string // e.g. did:example:wallet
  kid: string // Key ID
  publicKeyJwk: JWK_OKP_Public // public key in JWK format
}

/** Proof section with signature */
export interface CredentialProof {
  type: "Ed25519Signature2018" // or other algorithms
  jws: string // compact JWS
}

/** A credential as stored in credentials.json */
export interface VerifiableCredential {
  id: string
  issuer: IssuerMeta
  type: string[] // VC + custom types
  subject: string // ID of the subject
  issuedAt: string // ISO-8601 Timestamp
  claims: Record<string, unknown> // Arbitrary key/value pairs
  proof: CredentialProof
}
