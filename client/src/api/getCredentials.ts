import { api } from "../lib/api"

export function getCredentials() {
  return api.get("/credentials")
}
