export function createCredential(data: { claims: Record<string, string>; type: string; subject: string }) {
  return fetch("/api/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}
