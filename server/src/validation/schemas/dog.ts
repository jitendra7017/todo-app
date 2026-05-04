import Joi from 'joi'
import { normalizeBreedKey } from '../../infrastructure/data-access/json/dogDAO'

function normalizedBreedMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Invalid breed'
}

/** POST /api/dogs */
export const createDogBodySchema = Joi.object({
  breed: Joi.string()
    .trim()
    .required()
    .custom((value, helpers) => {
      try {
        return normalizeBreedKey(value)
      } catch (err) {
        return helpers.message({ custom: normalizedBreedMessage(err) })
      }
    }),
  subBreeds: Joi.array().items(Joi.string().trim().min(1)).default([]),
}).unknown(false)

/** PUT /api/dogs/:breed */
export const updateDogBodySchema = Joi.object({
  breed: Joi.string()
    .trim()
    .optional()
    .custom((value, helpers) => {
      if (value === undefined) return undefined
      try {
        return normalizeBreedKey(value)
      } catch (err) {
        return helpers.message({ custom: normalizedBreedMessage(err) })
      }
    }),
  subBreeds: Joi.array().items(Joi.string().trim().min(1)).optional(),
})
  .or('breed', 'subBreeds')
  .unknown(false)

/** GET /api/dogs */
export const listDogsQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
}).unknown(false)

/** :breed in path */
export const breedParamsSchema = Joi.object({
  breed: Joi.string()
    .required()
    .custom((value, helpers) => {
      try {
        return normalizeBreedKey(decodeURIComponent(value))
      } catch (err) {
        return helpers.message({ custom: normalizedBreedMessage(err) })
      }
    }),
}).unknown(false)
