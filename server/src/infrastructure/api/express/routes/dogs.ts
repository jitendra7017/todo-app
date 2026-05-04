import express, { NextFunction, Request, Response, Router } from 'express'
import DogController from '../../../../controllers/dog'
import { services } from '../../../../config'
import { validateRequest } from '../../../../validation/middleware/validateRequest'
import {
  breedParamsSchema,
  createDogBodySchema,
  listDogsQuerySchema,
  updateDogBodySchema,
} from '../../../../validation/schemas/dog'

const controller = new DogController(services.dog.dao)

const router: Router = express.Router()

function toRequest(req: Request) {
  return {
    params: req.params as Record<string, string>,
    query: req.query as Record<string, string | string[] | undefined>,
    headers: req.headers as Record<string, string | string[] | undefined>,
    body: req.body,
  }
}

router.get(
  '/',
  validateRequest({ query: listDogsQuerySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.list(toRequest(req))
      res.json(result)
    } catch (err) {
      next(err)
    }
  },
)

router.post(
  '/',
  validateRequest({ body: createDogBodySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.create(toRequest(req))
      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  },
)

router.get(
  '/:breed',
  validateRequest({ params: breedParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.get(toRequest(req))
      res.json(result)
    } catch (err) {
      next(err)
    }
  },
)

router.put(
  '/:breed',
  validateRequest({ params: breedParamsSchema, body: updateDogBodySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.update(toRequest(req))
      res.json(result)
    } catch (err) {
      next(err)
    }
  },
)

router.delete(
  '/:breed',
  validateRequest({ params: breedParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller.remove(toRequest(req))
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
)

export default router
