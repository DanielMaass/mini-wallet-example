import z from "zod"

export const claimEntrySchema = z.object({
  key: z.string().min(1, "Key cannot be empty"),
  value: z.string().min(1, "Value cannot be empty"),
})

export const createVCSchema = z.object({
  type: z.string().min(1, { message: "Type cannot be empty" }),
  claims: z.array(claimEntrySchema).min(1, { message: "Claims must have at least one entry" }),
  subject: z.string().min(1, { message: "Subject cannot be empty" }),
  issuer: z.string().min(1, { message: "Issuer cannot be empty" }),
})
