# -------- Base (Dependencies) --------
FROM node:20-alpine AS base

# npm latest
RUN npm install -g npm@latest

WORKDIR /app
COPY package.json package-lock.json* ./
COPY client/package.json client/
COPY server/package.json server/
COPY shared/package.json shared/

# Install for all workspaces (no root)
RUN npm ci --workspaces --include-workspace-root=false --install-strategy=shallow

# -------- Build --------
FROM base AS build
COPY client/ client/
COPY server/ server/
COPY shared/ shared/
RUN npm run --workspace shared build
RUN npm run --workspace server build
RUN npm run --workspace client build

# -------- Runtime: Server --------
FROM node:20-alpine AS server

# npm latest
RUN npm install -g npm@latest

WORKDIR /app
ENV NODE_ENV=production \
    KID=wallet-ed25519-key-1 \
    ISSUER_ID=did:example:wallet-1
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/shared/dist ./shared/dist
RUN npm prune --omit=dev
EXPOSE 3210
CMD ["node", "server/dist/server.js"]

# -------- Runtime: Client --------
FROM node:20-alpine AS client

# npm latest
RUN npm install -g npm@latest

WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/client/dist ./client/dist
RUN npm prune --omit=dev
EXPOSE 5173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"]
