# Dogs Web API (Express)

JSON-file–backed REST API for dog **breeds** and optional **sub-breeds**, matching the assignment `dogs.json` shape: each key is a breed identifier; the value is an array of sub-breed names.

## Setup

```bash
npm install
cp .env.example .env
```

## Run

```bash
npm run dev          # development (nodemon + ts-node)
npm run build && npm start   # production (compiled to dist/)
```

## Data & persistence

- Default storage: `data/dogs.json` (repo includes the starter dataset).
- Override with `DOGS_DATA_PATH` in `.env` (path relative to the server’s working directory unless absolute).

## Breed keys

API breed identifiers are **normalized** (trim, lowercase, spaces removed, `[a-z0-9]+`). Examples: `pug`, `germanshepherd`, `stbernard`.

## Request validation

Incoming JSON bodies, path parameters, and list **query** parameters (`limit`, `offset`) are validated with **Joi** (`src/validation/`) before they reach controllers. Failed validation responds with `422` and a `details` array of field-level messages.

Domain rules still enforced in the DAO layer include duplicate breed keys and missing breeds on update/delete.

## Pagination

`GET /api/dogs` returns breeds in **reverse order of the JSON file** (last key in `dogs.json` first), then paginated. Query params (validated with Joi):

- Defaults: `limit=20`, `offset=0`.
- Maximum `limit`: **100**.

Example: `GET /api/dogs?limit=15&offset=30`.

Response includes:

```json
{
  "dogs": [...],
  "total": 120,
  "limit": 15,
  "offset": 30,
  "hasMore": true
}
```

## Errors

Structured JSON with `error`, `message`, and optional `details`. Typical status codes: `404` (unknown breed), `422` (validation / duplicate breed).

## Postman

Use `API.postman_collection.json` in this folder; adjust the `baseUrl` collection variable to match your host and port.
