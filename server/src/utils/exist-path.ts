import { promises as fs } from "fs"

export async function existPath(p: string) {
  try {
    await fs.stat(p)
    return true
  } catch {
    return false
  }
}
