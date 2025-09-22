import type z from "zod";
import type { CredentialProofSchema, IssuerMetaSchema, JWK_OKP_PublicSchema, VerifiableCredentialSchema } from "./schemas.js";
export type JWK_OKP_Public = z.infer<typeof JWK_OKP_PublicSchema>;
export type IssuerMeta = z.infer<typeof IssuerMetaSchema>;
export type CredentialProof = z.infer<typeof CredentialProofSchema>;
export type VerifiableCredential = z.infer<typeof VerifiableCredentialSchema>;
