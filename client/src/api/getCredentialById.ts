import { api } from "../lib/api"

export function getCredentialById(id?: string) {
  if (!id) throw new Error("ID is required")
  return api.get(`/credentials/${id}`)
}
