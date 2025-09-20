import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Wallet Example API",
      version: "1.0.0",
      description: "API Documentation with Swagger",
    },
  },
  apis: ["./src/routes/*.ts"], // Path to your route files
}

export const swaggerSpec = swaggerJSDoc(options)
export { swaggerUi }
