import { NextFunction, Request, RequestHandler, Response } from 'express'
import Joi from 'joi'
import ValidationError from '../../errors/validationError'

export interface ValidateRequestOptions {
  body?: Joi.ObjectSchema
  params?: Joi.ObjectSchema
  query?: Joi.ObjectSchema
}

function mapJoiError(error: Joi.ValidationError): ValidationError {
  const details = error.details.map((d) => ({
    field: d.path.length ? d.path.join('.') : 'request',
    message: d.message.replace(/"/g, ''),
  }))
  return new ValidationError('Validation failed', details)
}

/**
 * Validates `req.body`, `req.params`, and/or `req.query` and replaces them with Joi-stripped values.
 */
export function validateRequest(options: ValidateRequestOptions): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const opts = { abortEarly: false, stripUnknown: true }

      if (options.body) {
        const { error, value } = options.body.validate(req.body, opts)
        if (error) throw mapJoiError(error)
        req.body = value
      }
      if (options.params) {
        const { error, value } = options.params.validate(req.params, opts)
        if (error) throw mapJoiError(error)
        Object.assign(req.params, value)
      }
      if (options.query) {
        const { error, value } = options.query.validate(req.query, opts)
        if (error) throw mapJoiError(error)
        req.query = value as typeof req.query
      }
      next()
    } catch (e) {
      next(e)
    }
  }
}
