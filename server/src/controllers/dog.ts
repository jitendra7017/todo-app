import { DogRecord } from '../interfaces/dog/dogDAO'
import IDogDAO from '../interfaces/dog/dogDAO'
import { IRequest } from '../interfaces'
import NotFoundError from '../errors/notFoundError'

export default class DogController {
  constructor(private readonly dogDAO: IDogDAO) {}

  async list(req: IRequest): Promise<{
    dogs: DogRecord[]
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }> {
    const q = req.query as unknown as { limit: number; offset: number }
    const { dogs, total } = await this.dogDAO.listPaged(q)
    const hasMore = q.offset + dogs.length < total
    return {
      dogs,
      total,
      limit: q.limit,
      offset: q.offset,
      hasMore,
    }
  }

  async get(req: IRequest): Promise<DogRecord> {
    const breedKey = (req.params as { breed: string }).breed
    const dog = await this.dogDAO.find(breedKey)
    if (!dog) {
      throw new NotFoundError('Breed not found.')
    }
    return dog
  }

  async create(req: IRequest): Promise<DogRecord> {
    const body = req.body as { breed: string; subBreeds: string[] }
    return this.dogDAO.create(body)
  }

  async update(req: IRequest): Promise<DogRecord> {
    const breedKey = (req.params as { breed: string }).breed
    const body = req.body as { breed?: string; subBreeds?: string[] }
    return this.dogDAO.update(breedKey, body)
  }

  async remove(req: IRequest): Promise<void> {
    const breedKey = (req.params as { breed: string }).breed
    await this.dogDAO.delete(breedKey)
  }
}
