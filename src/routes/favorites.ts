import { Request, Response, Router } from "express"
import authRequired from "../middlewares/authRequired"
import { PrismaClient } from "@prisma/client"
import { getOmdbMovie } from "../services/omdb"

const prisma = new PrismaClient()

const r = Router()

r.get('/', [authRequired],  async (req: Request, res: Response) => {
  const user = res.locals.user
  const favorites = await prisma.favorite.findMany({ where: { userId: user.id }, select: { imdbID: true }})
  return res.status(200).json({
    favorites
  })
})

r.post('/', [authRequired],  async (req: Request, res: Response) => {
  const user = res.locals.user

  const { imdbID } = req.body
  
  const omdbMovie = await getOmdbMovie(imdbID);

  if (! omdbMovie) {
    return res.status(422).json({
      msg: 'Filme não existe no OMDB'
    })
  }

  const existingFavorite = await prisma.favorite.findFirst({ where: {
    imdbID,
    userId: user.id
  }})

  if (existingFavorite) return res.status(422).json({ msg: 'Filme já adicionado na sua lista'});

  const movie = await prisma.favorite.create({ data: {
    imdbID,
    user: { connect: { id: user.id } }
  }})

  res.status(200).json({ msg: 'Filme adicionado na sua lista'})
})

r.delete('/:imdbID', [authRequired],  async (req: Request, res: Response) => {
  const user = res.locals.user
  const { imdbID } = req.params
  const r = await prisma.favorite.deleteMany({ where: { userId: user.id, imdbID: imdbID }})
  if (r.count === 0)  return res.status(422).json({ msg: 'Filme não existe na sua lista'});
  return res.status(200).json({
    msg: 'Removido com sucesso'
  })
})

export default r