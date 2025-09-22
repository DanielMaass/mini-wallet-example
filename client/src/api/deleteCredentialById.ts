export function deleteCredentialById(id?: string) {
  if (!id) throw new Error("ID is required")
  return fetch(`/api/credentials/${id}`, {
    method: "DELETE",
  })
}
