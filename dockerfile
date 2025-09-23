# ---------- Deps (prod) ----------
FROM node:20-alpine AS deps-prod
WORKDIR /app
# nur Manifeste -> bestes Caching
COPY package.json package-lock.json* ./
COPY client/package.json client/
COPY server/package.json server/
COPY shared/package.json shared/
# Prod-Deps für alle Workspaces
RUN npm ci --workspaces --include-workspace-root=false --omit=dev

# ---------- Deps (dev) ----------
FROM node:20-alpine AS deps-dev
WORKDIR /app
COPY package.json package-lock.json* ./
COPY client/package.json client/
COPY server/package.json server/
COPY shared/package.json shared/
# Alle Deps inkl. Dev (brauchen wir zum Bauen: tsc, vite, etc.)
RUN npm ci --workspaces --include-workspace-root=false

# ---------- Build ----------
FROM deps-dev AS build
# Quellen kopieren
COPY client/ client/
COPY server/ server/
COPY shared/ shared/
# Build-Reihenfolge ist wichtig
RUN npm run --workspace shared build
RUN npm run --workspace server build
RUN npm run --workspace client build

# ---------- Runtime: Server ----------
FROM node:20-alpine AS server
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000
# Prod-NodeModules + Artefakte
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=build     /app/shared/dist  ./shared/dist
COPY --from=build     /app/server/dist  ./server/dist
# 🔧 WICHTIG: package.json des Shared-Pakets mitnehmen,
# damit der Workspace-Symlink in node_modules korrekt aufgelöst wird
COPY --from=deps-prod /app/shared/package.json ./shared/package.json

EXPOSE 3000
CMD ["node", "server/dist/server.js"]

# ---------- Runtime: Client (nginx) ----------
FROM nginx:alpine AS client
# Statisches Frontend deployen
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
