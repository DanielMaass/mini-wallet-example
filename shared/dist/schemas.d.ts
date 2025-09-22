import { z } from "zod";
export declare const JWK_OKP_PublicSchema: z.ZodObject<{
    kty: z.ZodOptional<z.ZodString>;
    crv: z.ZodString;
    x: z.ZodString;
    kid: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const IssuerMetaSchema: z.ZodObject<{
    id: z.ZodString;
    kid: z.ZodString;
    publicKeyJwk: z.ZodObject<{
        kty: z.ZodOptional<z.ZodString>;
        crv: z.ZodString;
        x: z.ZodString;
        kid: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const CredentialProofSchema: z.ZodObject<{
    type: z.ZodLiteral<"Ed25519Signature2018">;
    jws: z.ZodString;
}, z.core.$strip>;
export declare const VerifiableCredentialSchema: z.ZodObject<{
    id: z.ZodString;
    issuer: z.ZodObject<{
        id: z.ZodString;
        kid: z.ZodString;
        publicKeyJwk: z.ZodObject<{
            kty: z.ZodOptional<z.ZodString>;
            crv: z.ZodString;
            x: z.ZodString;
            kid: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    type: z.ZodArray<z.ZodString>;
    subject: z.ZodString;
    issuedAt: z.ZodString;
    claims: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    proof: z.ZodObject<{
        type: z.ZodLiteral<"Ed25519Signature2018">;
        jws: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
