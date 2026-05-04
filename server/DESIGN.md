# Design notes

## Architecture

The server keeps a thin **controller → DAO** flow for the assignment scope:

- **Interfaces** – `IDogDAO` describes persistence for breed records.
- **Infrastructure** – `JsonDogDAO` reads and writes `data/dogs.json` (or `DOGS_DATA_PATH`) with synchronous I/O, suitable for a single-process API.
- **API** – Express routes under `/api/dogs` map HTTP to the controller.

## Data model

Storage matches the provided dataset: a JSON object whose keys are breed identifiers and whose values are arrays of sub-breed names. The API exposes each row as `{ breed, subBreeds }`.

## Validation

HTTP shapes are checked with **Joi** in route middleware (`validation/schemas`, `validation/middleware`). List queries use `limit`/`offset` after **reversing** the key order as stored in the JSON file (last-in-file first).

Business rules that depend on stored state (e.g. duplicate breed) stay in the DAO.

## Persistence & concurrency

File writes are synchronous and atomic enough for one Node process. For multiple instances or high traffic, replace `JsonDogDAO` with a database-backed implementation of the same interface.

## Client

The React app uses relative `/api` paths in development (Vite proxy) or `VITE_API_URL` when the UI and API are on different origins.
