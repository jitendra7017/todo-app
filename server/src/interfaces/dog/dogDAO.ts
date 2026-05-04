export interface DogRecord {
  breed: string
  subBreeds: string[]
}

export default interface IDogDAO {
  listPaged(params: { limit: number; offset: number }): Promise<{
    dogs: DogRecord[]
    total: number
  }>
  find(breedKey: string): Promise<DogRecord | null>
  create(payload: { breed: string; subBreeds: string[] }): Promise<DogRecord>
  update(breedKey: string, payload: { breed?: string; subBreeds?: string[] }): Promise<DogRecord>
  delete(breedKey: string): Promise<void>
}
