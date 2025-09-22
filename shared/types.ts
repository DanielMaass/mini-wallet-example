export type JWK_OKP_Public = {
  kty?: string
  crv: string
  x: string
  kid?: string
}

export type IssuerMeta = {
  id: string
  kid: string
  publicKeyJwk: JWK_OKP_Public
}

export type CredentialProof = {
  type: "Ed25519Signature2018"
  jws: string
}

export type VerifiableCredential = {
  id: string
  issuer: IssuerMeta
  type: string[]
  subject: string
  issuedAt: string
  claims: Record<string, unknown>
  proof: CredentialProof
}
