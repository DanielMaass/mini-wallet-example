import { z } from "zod";
export const JWK_OKP_PublicSchema = z.object({
    kty: z.string().optional(),
    crv: z.string(),
    x: z.string(),
    kid: z.string().optional(),
});
export const JWK_OKP_PrivateSchema = z.object({
    kty: z.string().optional(),
    crv: z.string(),
    d: z.string(),
    x: z.string(),
    kid: z.string().optional(),
});
export const IssuerMetaSchema = z.object({
    id: z.string(),
    kid: z.string(),
    publicKeyJwk: JWK_OKP_PublicSchema,
});
export const CredentialProofSchema = z.object({
    type: z.literal("Ed25519Signature2018"),
    created: z.string().optional(),
    proofPurpose: z.string().optional(),
    verificationMethod: z.string().optional(),
    jws: z.string(),
});
// JSON-LD
export const VerifiableCredentialSchema = z.object({
    "@context": z.array(z.string()).optional(),
    id: z.string(),
    type: z.array(z.string()),
    issuer: z.string(),
    issuanceDate: z.string(),
    credentialSubject: z.record(z.string(), z.string()),
    proof: CredentialProofSchema,
});
export const DataKeysSchema = z.record(z.string(), z.object({
    publicJwk: JWK_OKP_PublicSchema,
    privateJwk: JWK_OKP_PrivateSchema,
}));
export const DataIssuerSchema = z.object({
    id: z.string(),
    kid: z.string(),
});
