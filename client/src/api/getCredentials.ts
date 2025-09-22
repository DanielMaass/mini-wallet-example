export function getCredentials() {
  return fetch("/api/credentials").then((res) => res.json())
}
