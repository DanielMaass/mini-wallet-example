export function getCredentialById(id?: string) {
  if (!id) throw new Error("ID is required")
  return fetch(`/api/credentials/${id}`).then((res) => res.json())
}
