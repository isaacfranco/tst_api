import { Request, Response, Router } from "express"
import authRequired from "../middlewares/authRequired"
import { PrismaClient } from "@prisma/client"
import { getOmdbMovie } from '../services/omdb'

const prisma = new PrismaClient()

const r = Router()

r.get('/my', [authRequired], async (req: Request, res: Response) => {
  const user = res.locals.user
  const reviews = await prisma.review.findMany({ where: { userId: user.id }, select: { imdbID: true, comment: true, stars:true, user: {
    select: {
      name: true
    }
  } }})
  return res.status(200).json({
    reviews
  })
})

r.get('/:imdbID', async (req: Request, res: Response) => {
  
  const reviews = await prisma.review.findMany({ where: { imdbID: req.params.imdbID }, select: { imdbID: true, comment: true, user: {
    select: { name: true }
  } }})
  return res.status(200).json({
    reviews
  })
})


r.post('/:imdbID', [authRequired],  async (req: Request, res: Response) => {
  const user = res.locals.user

  const { comment, stars } = req.body
  const { imdbID } = req.params

  const omdbMovie = await getOmdbMovie(imdbID);

  if (! omdbMovie) {
    return res.status(422).json({
      msg: 'Filme não existe no OMDB'
    })
  }

  let starsLimited = parseInt(stars)

  // limiting stars to a value between 1 and 5
  if (starsLimited > 5) {
    starsLimited = 5
  } else if (starsLimited < 1) {
    starsLimited = 1
  }

  const existingreview = await prisma.review.findFirst({ where: {
    imdbID,
    userId: user.id
  }})

  if (existingreview) return res.status(422).json({ msg: 'Review para esse filme já foi criado por você'});

  const review = await prisma.review.create({ data: {
    imdbID,
    comment,
    stars: starsLimited,
    user: { connect: { id: user.id } }
  }})

  res.status(200).json({ msg: 'Review criado'})
})

r.delete('/:imdbID', [authRequired],  async (req: Request, res: Response) => {
  const user = res.locals.user
  const { imdbID } = req.params
  const r = await prisma.review.deleteMany({ where: { userId: user.id, imdbID: imdbID }})
  if (r.count === 0)  return res.status(401).json({ msg: 'Review não existe'});
  return res.status(200).json({
    msg: 'Removido com sucesso'
  })
})

export default r