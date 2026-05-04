const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

function dogsPath(suffix = '') {
  const path = `/api/dogs${suffix}`
  return base ? `${base}${path}` : path
}

async function handleResponse(res) {
  if (res.status === 204) return null
  const text = await res.text()
  if (!text) {
    if (!res.ok) throw new Error(res.statusText || 'Request failed')
    return null
  }
  const data = JSON.parse(text)
  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText
    throw new Error(typeof msg === 'string' ? msg : 'Request failed')
  }
  return data
}

/**
 * @param {{ limit?: number; offset?: number }} [params]
 */
export async function listDogs(params = {}) {
  const { limit = 20, offset = 0 } = params
  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })
  const res = await fetch(`${dogsPath()}?${qs}`, {
    headers: { Accept: 'application/json' },
  })
  return handleResponse(res)
}

export async function getDog(breed) {
  const res = await fetch(dogsPath(`/${encodeURIComponent(breed)}`), {
    headers: { Accept: 'application/json' },
  })
  return handleResponse(res)
}

export async function createDog({ breed, subBreeds }) {
  const res = await fetch(dogsPath(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ breed, subBreeds }),
  })
  return handleResponse(res)
}

export async function updateDog(breed, { breed: nextBreed, subBreeds }) {
  const body = {}
  if (nextBreed !== undefined) body.breed = nextBreed
  if (subBreeds !== undefined) body.subBreeds = subBreeds
  const res = await fetch(dogsPath(`/${encodeURIComponent(breed)}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  return handleResponse(res)
}

export async function deleteDog(breed) {
  const res = await fetch(dogsPath(`/${encodeURIComponent(breed)}`), {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  })
  return handleResponse(res)
}
