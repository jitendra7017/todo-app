import { Application } from 'express'
import dogs from './dogs'

export default {
  attach(app: Application): void {
    app.use('/api/dogs', dogs)
  },
}
