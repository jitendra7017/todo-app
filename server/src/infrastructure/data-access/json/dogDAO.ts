import * as fs from 'fs'
import * as path from 'path'
import IDogDAO, { DogRecord } from '../../../interfaces/dog/dogDAO'
import NotFoundError from '../../../errors/notFoundError'
import ValidationError from '../../../errors/validationError'

/** Stored shape matches assignment dogs.json: breed key → sub-breed names */
export type DogsJsonShape = Record<string, string[]>

const DATA_DIR = path.join(process.cwd(), 'data')
const DEFAULT_FILE = path.join(DATA_DIR, 'dogs.json')

function dogsFilePath(): string {
  return process.env.DOGS_DATA_PATH
    ? path.resolve(process.cwd(), process.env.DOGS_DATA_PATH)
    : DEFAULT_FILE
}

function ensureDataDir(): void {
  const file = dogsFilePath()
  const dir = path.dirname(file)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function readData(): DogsJsonShape {
  ensureDataDir()
  const file = dogsFilePath()
  if (!fs.existsSync(file)) {
    return {}
  }
  const raw = fs.readFileSync(file, 'utf-8')
  return JSON.parse(raw) as DogsJsonShape
}

function writeData(data: DogsJsonShape): void {
  ensureDataDir()
  fs.writeFileSync(dogsFilePath(), JSON.stringify(data, null, 4), 'utf-8')
}

export function normalizeBreedKey(input: string): string {
  const n = input.trim().toLowerCase().replace(/\s+/g, '')
  if (!n || !/^[a-z0-9]+$/.test(n)) {
    throw new ValidationError(
      'Breed must be a non-empty letters/numbers label (e.g. pug, germanshepherd).',
    )
  }
  return n
}

function normalizeSubBreeds(raw: unknown): string[] {
  if (raw === undefined || raw === null) return []
  if (!Array.isArray(raw)) {
    throw new ValidationError('subBreeds must be an array of strings.')
  }
  const out: string[] = []
  for (const item of raw) {
    if (typeof item !== 'string') {
      throw new ValidationError('Each sub-breed must be a string.')
    }
    const t = item.trim()
    if (t) out.push(t)
  }
  return out
}

/**
 * Breeds listed from the **end** of the stored object order (same order as keys in `dogs.json`).
 * `JSON.parse` preserves key order; we reverse so the last entries in the file appear first.
 */
function keysInReverseFileOrder(data: DogsJsonShape): string[] {
  return Object.keys(data).reverse()
}

export default class JsonDogDAO implements IDogDAO {
  async listPaged(params: { limit: number; offset: number }): Promise<{
    dogs: DogRecord[]
    total: number
  }> {
    const { limit, offset } = params
    const data = readData()
    const keys = keysInReverseFileOrder(data)
    const total = keys.length
    const dogs = keys.slice(offset, offset + limit).map((breed) => ({
      breed,
      subBreeds: [...(data[breed] ?? [])],
    }))
    return { dogs, total }
  }

  async find(breedKey: string): Promise<DogRecord | null> {
    const key = normalizeBreedKey(breedKey)
    const data = readData()
    if (!(key in data)) return null
    return { breed: key, subBreeds: [...(data[key] ?? [])] }
  }

  async create(payload: { breed: string; subBreeds: string[] }): Promise<DogRecord> {
    const breed = normalizeBreedKey(payload.breed)
    const subBreeds = normalizeSubBreeds(payload.subBreeds)
    const data = readData()
    if (breed in data) {
      throw new ValidationError(`Breed "${breed}" already exists.`)
    }
    data[breed] = subBreeds
    writeData(data)
    return { breed, subBreeds }
  }

  async update(
    breedKey: string,
    payload: { breed?: string; subBreeds?: string[] },
  ): Promise<DogRecord> {
    const key = normalizeBreedKey(breedKey)
    const data = readData()
    if (!(key in data)) {
      throw new NotFoundError(`Breed "${key}" not found.`)
    }

    let newKey = key
    if (payload.breed !== undefined) {
      newKey = normalizeBreedKey(payload.breed)
      if (newKey !== key && newKey in data) {
        throw new ValidationError(`Breed "${newKey}" already exists.`)
      }
    }

    const subBreeds =
      payload.subBreeds !== undefined
        ? normalizeSubBreeds(payload.subBreeds)
        : [...(data[key] ?? [])]

    if (newKey !== key) {
      delete data[key]
    }
    data[newKey] = subBreeds
    writeData(data)
    return { breed: newKey, subBreeds }
  }

  async delete(breedKey: string): Promise<void> {
    const key = normalizeBreedKey(breedKey)
    const data = readData()
    if (!(key in data)) {
      throw new NotFoundError(`Breed "${key}" not found.`)
    }
    delete data[key]
    writeData(data)
  }
}
