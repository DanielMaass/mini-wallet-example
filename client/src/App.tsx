import { Fragment } from "react"
import { Toaster } from "@/components/ui/sonner"
import "./App.css"
import { RouterView } from "./routes"

function App() {
  return (
    <Fragment>
      <Toaster richColors />
      <RouterView />
    </Fragment>
  )
}

export default App
