import { BrowserRouter, Route, Routes } from "react-router-dom"
import { CredentialsPage } from "./pages/credentials-page"
import { CredentialDetailsPage } from "./pages/credential-details-page"
import { CredentialVerifyPage } from "./pages/credential-verify-page"
import { CredentialCreatePage } from "./pages/credential-create-page"

export const RouterView = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CredentialsPage />} />
        <Route path="/:id" element={<CredentialDetailsPage />} />
        <Route path="/verify" element={<CredentialVerifyPage />} />
        <Route path="/create" element={<CredentialCreatePage />} />
      </Routes>
    </BrowserRouter>
  )
}
