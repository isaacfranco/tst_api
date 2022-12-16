import { Request, Response, Router } from "express"
import bcrypt from 'bcrypt'
import { Prisma, PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken"
import authRequired from "../middlewares/authRequired"
const prisma = new PrismaClient()


const r = Router()

r.post('/signup', async (req, res) => {
  const { email, password, name } = req.body

  const existingUser = await prisma.user.findFirst({ where: { email } })

  console.log('existingUser', existingUser)
  if (existingUser !== null) {
    return res.status(422).json({
      msg: 'E-mail já existe'
    })
  }

  const hash = await bcrypt.hash(password, 8)

  const user = await prisma.user.create({ data: {
    email, password: hash, name
  }, select: {
    name: true, email: true
  }})

  console.log('user', user)

  return res.status(200).json({ user })
})

r.post('/signin', async (req, res) => {
  const { email, password } = req.body

  const existingUser = await prisma.user.findFirst({ where: { email } })

  console.log('existingUser', existingUser)
  if (existingUser !== null) {

    const val = await bcrypt.compare(password, existingUser.password)

    if (val) {
      const payload = {
        id: existingUser.id
      }
      const token = jwt.sign(payload, process.env.JWT_KEY || '123123', {
        expiresIn: '365d'
      })

      return res.status(200).json({ 
        user: {
          name: existingUser.name,
          email: existingUser.email,
          token
        }
       })
  
    } else {
      return res.status(401).json({ msg: 'E-mail/senha inválidos' })
    }
  } else {
    return res.status(401).json({ msg: 'E-mail/senha inválidos' })
  }
})

r.get('/me', [authRequired], async (req:Request, res: Response) => {
  const user = res.locals.user
  return res.status(200).json({
    name: user.name,
    email: user.email
  })
})


export default r