import { getCredentials } from "@/api/getCredentials"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Trash } from "lucide-react"
import type { VerifiableCredential } from "mini-vc-wallet-shared"
import { useNavigate } from "react-router-dom"
import { deleteCredentialById } from "../api/deleteCredentialById"
import { Button } from "../components/ui/button"

export function CredentialsPage() {
  const navigateTo = useNavigate()
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: ["credentials"],
    queryFn: getCredentials,
  })

  async function deleteCredential(id: string) {
    const response = await deleteCredentialById(id)
    if (response.ok) {
      queryClient.invalidateQueries({ queryKey: ["credentials"] })
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading credentials</div>

  return (
    <div className="text-start space-y-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">My Credentials</h1>
        <Button className="ms-auto" onClick={() => navigateTo("/verify")}>
          Verify
        </Button>
        <Button onClick={() => navigateTo("/create")}>Create new</Button>
      </div>
      <div>
        {!data?.length && "No credentials found"}
        {data?.map((cred: VerifiableCredential) => (
          <div key={cred.id} className="flex items-center gap-2 p-2 border border-gray-300 rounded mb-2">
            <p className="grow">Type: {cred.type.join(", ")}</p>
            <p className="grow">IssuerID: {cred.issuer.id}</p>
            <p className="grow">
              credentialSubject:{" "}
              {Object.entries(cred.credentialSubject)
                .map(([key, value]) => {
                  return `${key}: ${value}`
                })
                .join(", ")}
            </p>
            <Button onClick={() => navigateTo(`/${cred.id}`)}>Details</Button>
            <Button size="icon" variant="destructive" onClick={() => deleteCredential(cred.id)}>
              <Trash />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
