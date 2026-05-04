# Dogs UI (React + Vite)

Single-page app to **list, add, edit, and delete** dog breeds. It talks to the Express API under `/api/dogs`.

## Source layout

- `src/pages/` — route-level views (`DogsPage`)
- `src/components/` — presentational pieces (`PageHeader`, `ErrorBanner`, `DogForm`, `DogList`, `DogCard`, `Pagination`)
- `src/services/` — HTTP client (`dogsApi.js`)
- `src/utils/` — small helpers (`parseSubBreeds.js`)
- `src/styles/` — app-level styles (`app.css`); `index.css` remains global tokens in the entry

## Development

```bash
npm install
npm run dev
```

Ensure the backend is running. Configure `client/.env` (see `.env.example`):

- **`VITE_API_URL`** — API origin (no trailing slash). The dev server proxies `/api` here, and the client uses it as the fetch base when set.
- **`CLIENT_PORT`** — port for `npm run dev` (default `5173` if unset or invalid).

Copy `.env.example` to `.env` and adjust as needed.

## Production build

```bash
npm run build
npm run preview   # local preview of dist/
```

Set `VITE_API_URL` when building if the API is on another origin (e.g. `VITE_API_URL=https://api.example.com`).

## Lint

```bash
npm run lint
```
