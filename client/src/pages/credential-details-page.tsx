import { getCredentialById } from "@/api/getCredentialById"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../components/ui/button"

export function CredentialDetailsPage() {
  const { id } = useParams()
  const navigateTo = useNavigate()
  const { data, isLoading, error } = useQuery({
    queryKey: ["credentials", id],
    queryFn: () => getCredentialById(id),
  })

  function copyCredential() {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading credential</div>
  if (!data) return <div>No credential found</div>

  return (
    <div className="text-start space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigateTo(-1)} size={"icon"} variant={"outline"}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Credential Details</h1>
        <Button className="ms-auto" onClick={copyCredential}>
          Copy
        </Button>
      </div>
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  )
}
