import cors from "cors"
import express from "express"
import morgan from "morgan"
import { errorHandler } from "./middlewares/error-handler.ts"
import healthRoutes from "./routes/health-routes.ts"
import { swaggerSpec, swaggerUi } from "./swagger.ts"

const app = express()
app.use(cors())
app.use(express.json({ limit: "1mb" }))
app.use(morgan("dev"))

// Routes
app.use(healthRoutes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Global error handler (should be after routes)
app.use(errorHandler)

export default app
