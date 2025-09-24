# Mini VC Wallet Example

This project is an example of a Verifiable Credentials Wallet consisting of a Client (React/Vite) and a Server (Express/TypeScript).
The setup is fully containerized using Docker Compose and supports both Development (with hot-reload) and Production.

## 🚀 Features

- Client: React + Vite
- Server: Node.js + Express + TypeScript
- Swagger API Docs available under /api-docs
- Docker Compose Setup for Dev & Prod
- Environment Variables for configuration

## 📦 Requirements

- Docker
- Docker Compose

## ⚙️ Development

Start the development environment (with hot-reload for client & server):

```bash
docker compose -f docker-compose.dev.yml up
```

- Client: http://localhost:5173
- Server API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api-docs

View logs:

```bash
docker compose -f docker-compose.dev.yml logs -f
```

## 🏗️ Production

Build and start the production containers:

```bash
docker compose up --build
```

- Frontend: http://localhost:5173 (served via Nginx)
- API: http://localhost:3000

## 🔑 Environment Variables

| Variable | Default     | Description                               |
| -------- | ----------- | ----------------------------------------- |
| PORT     | 3000        | Port for the server                       |
| NODE_ENV | development | Node environment (development/production) |

👉 In Docker Compose these variables are automatically injected (see docker-compose.dev.yml and docker-compose.yml).

## 📜 Useful Commands

Rebuild dependencies from scratch

```bash
docker compose -f docker-compose.dev.yml build --no-cache
```

Follow logs

```bash
docker compose logs -f
```

Stop and remove containers

```bash
docker compose down
```

## 🛠️ Troubleshooting

- npm warn config production Use --omit=dev instead
  → Suppressed in development by setting npm_config_production=false.
- ERR_MODULE_NOT_FOUND
  → Usually caused by copying local node_modules into the container.
  Fix: let the container run npm ci so dependencies are installed correctly for Linux.
