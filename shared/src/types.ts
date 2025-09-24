import { z } from "zod"
import type {
  CredentialProofSchema,
  DataIssuerSchema,
  DataKeysSchema,
  IssuerMetaSchema,
  JWK_OKP_PrivateSchema,
  JWK_OKP_PublicSchema,
  VerifiableCredentialSchema,
} from "./schemas.js"

export type JWK_OKP_Public = z.infer<typeof JWK_OKP_PublicSchema>

export type JWK_OKP_Private = z.infer<typeof JWK_OKP_PrivateSchema>

export type IssuerMeta = z.infer<typeof IssuerMetaSchema>

export type CredentialProof = z.infer<typeof CredentialProofSchema>

export type VerifiableCredential = z.infer<typeof VerifiableCredentialSchema>

export type DataKeys = z.infer<typeof DataKeysSchema>

export type DataIssuer = z.infer<typeof DataIssuerSchema>
