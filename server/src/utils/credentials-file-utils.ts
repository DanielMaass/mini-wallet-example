import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import type { VerifiableCredential } from "../models/credential.ts"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, "../../data")
const credentialsFile = path.join(dataDir, "credentials.json")

export async function readAllCredentials() {
  try {
    await fs.access(credentialsFile);
  } catch (err) {
    // File does not exist
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw err;
  }
  const list: VerifiableCredential[] = JSON.parse(await fs.readFile(credentialsFile, "utf8"));
  return list;
}

export async function writeAllCredentials(arr: VerifiableCredential[]) {
  await fs.writeFile(credentialsFile, JSON.stringify(arr, null, 2))
}
