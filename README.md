# Dogs Web API (assignment)

Full-stack app to **view and edit a dog breed list** over HTTP: an Express (TypeScript) API persists data to `server/data/dogs.json`, and a React (Vite) client in `client/` provides the UI. Changes survive server restarts and new browser sessions.

## Prerequisites

- Node.js (see `.nvmrc` in the repo root)
- npm

## Quick start

Run the API and the UI in two terminals from the repository root.

**1. Backend** (`server/`)

```bash
cd server
cp .env.example .env   # optional; adjust PORT if needed
npm install
npm run dev
```

Default API URL: `http://localhost:3001` (override with `PORT` in `server/.env`).

**2. Frontend** (`client/`)

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints (port from `CLIENT_PORT` in `client/.env`, default 5173). In development, `/api` is **proxied** to `VITE_API_URL` (see `client/vite.config.js` and `client/.env.example`).

## Environment variables

| Location | Variable | Purpose |
|----------|----------|---------|
| `server/.env` | `PORT` | HTTP port (default `3000` in code, `3001` in `.env.example`) |
| `server/.env` | `DOGS_DATA_PATH` | Optional path to the JSON file (default `data/dogs.json` under the server) |
| `client/.env` | `VITE_API_URL` | API origin (no trailing slash). Drives the Vite dev proxy and `dogsApi` fetch base. Leave empty only if the UI and API share the same origin without a prefix. |
| `client/.env` | `CLIENT_PORT` | Port for `npm run dev` (see `client/.env.example`; default `5173`). |

## API overview

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Short JSON description |
| `GET` | `/api/dogs` | Paginated list in **reverse file order** (last breed in `dogs.json` first). Query: `limit` (default 20, max 100), `offset` (default 0). Response includes `dogs`, `total`, `limit`, `offset`, `hasMore`. |
| `GET` | `/api/dogs/:breed` | Single breed (breed is normalized: lowercase, no spaces) |
| `POST` | `/api/dogs` | Body: `{ "breed": string, "subBreeds": string[] }` |
| `PUT` | `/api/dogs/:breed` | Body: at least one of `breed`, `subBreeds` (rename or replace sub-breeds) |
| `DELETE` | `/api/dogs/:breed` | Remove breed (`204` on success) |

Import `server/API.postman_collection.json` into Postman; set the `baseUrl` variable if your port differs.

## Production-style run

```bash
cd server && npm run build && npm start
cd client && npm run build && npm run preview
```

For a single public URL you typically place the built client (`client/dist`) behind the same host as the API or set `VITE_API_URL` at build time to your API’s public origin.

## Public hosting

The original assignment asks for a **public GitHub repo** and a **publicly reachable deployment**. After you push this repo, deploy the server (e.g. Railway, Render, Fly.io) and the static client (e.g. Netlify, Vercel, or the same host as the API), then set `VITE_API_URL` when building the client if the API lives on another domain.

## License

See `LICENSE`.
