// server/src/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Globs für beide Welten: Dev (TS in src) und Prod (JS in dist)
const apis = [
  path.resolve(__dirname, "./routes/*.ts"),     // wenn via tsx aus src ausgeführt
  path.resolve(__dirname, "./routes/*.js"),     // falls mal kompiliert in dist gestartet würde und __dirname zeigt auf dist
  path.resolve(process.cwd(), "server/src/routes/*.ts"), // Fallback, wenn CWD=Repo-Root ist
];

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Wallet Example API",
      version: "1.0.0",
      description: "API Documentation with Swagger",
    },
    // optional aber praktisch: „Try it out“ benutzt gleich die richtige Base-URL
    servers: [{ url: "http://localhost:3000" }],
  },
  apis,
};

export const swaggerSpec = swaggerJSDoc(options);
