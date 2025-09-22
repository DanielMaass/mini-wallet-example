import { type VerifiableCredential } from "@shared/types.ts"

export const verifyCredential = (credential: VerifiableCredential) => {
  return fetch("/api/credentials/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  }).then((res) => res.json())
}
