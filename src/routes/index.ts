import { Router } from "express"
import authRouter from './auth'
import favoritesRouter from './favorites'
import reviewsRouter from './reviews'

const r = Router()

r.use('/auth', authRouter)
r.use('/favorites', favoritesRouter)
r.use('/reviews', reviewsRouter)

export default r