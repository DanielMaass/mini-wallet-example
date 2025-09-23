import cors from "cors"
import express from "express"
import morgan from "morgan"
import { errorHandler } from "./middlewares/error-handler.js"
import credentialRoutes from "./routes/credential-routes.js"
import healthRoutes from "./routes/health-routes.js"
import swaggerRoutes from "./routes/swagger-routes.js"

const app = express()
app.use(cors())
app.use(express.json({ limit: "1mb" }))
app.use(morgan("dev"))

// Routes
app.use(healthRoutes)
app.use(credentialRoutes)
app.use(swaggerRoutes)

// Global error handler (should be after routes)
app.use(errorHandler)

export default app
