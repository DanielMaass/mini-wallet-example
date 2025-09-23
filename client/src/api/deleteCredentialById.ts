import { api } from "../lib/api"

export function deleteCredentialById(id?: string) {
  if (!id) throw new Error("ID is required")
  return api.del(`/credentials/${id}`)
}
