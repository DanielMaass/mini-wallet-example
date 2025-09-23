const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

async function get(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    ...init,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

async function post(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...init,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

async function del(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    method: "DELETE",
    ...init,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res
}

export const api = { get, post, del }
