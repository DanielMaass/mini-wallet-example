import { Router } from "express"
import { getHealth } from "../controllers/health-controller.ts"

const router = Router()

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check the health of the API
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 */
router.get("/health", getHealth)

export default router
