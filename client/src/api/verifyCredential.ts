import { type VerifiableCredential } from "mini-vc-wallet-shared"
import { api } from "../lib/api"

export const verifyCredential = (credential: VerifiableCredential) => {
  return api.post("/credentials/verify", {
    body: JSON.stringify(credential),
  })
}
