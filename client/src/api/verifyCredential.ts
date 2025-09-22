import { type VerifiableCredential } from "mini-vc-wallet-shared"

export const verifyCredential = (credential: VerifiableCredential) => {
  return fetch("/api/credentials/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  }).then((res) => res.json())
}
