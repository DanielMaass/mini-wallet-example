import { api } from "../lib/api"

export function createCredential(data: { claims: Record<string, string>; type: string; subject: string }) {
  return api.post("/credentials", {
    body: JSON.stringify(data),
  })
}
