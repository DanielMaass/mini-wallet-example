import { Router, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger.js";

const router = Router()

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
router.get("/api-docs.json", (req: Request, res: Response) => res.json(swaggerSpec));


export default router
