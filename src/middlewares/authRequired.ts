import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient()

export default async function (req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if(!token) return res.status(401).json({ msg: "Sem autorização"} )

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY || '123123') as JwtPayload
    console.log('decoded', decoded)
    if (!decoded) return res.status(401).json({ msg: "Sem autorização"} )
    
    const id:number = decoded.id

    console.log('procurando ', id)
    const user = await prisma.user.findFirst({ where: { id }, select: { id:true, name: true, email: true }})
    res.locals.user = user
    next()
  } catch(error) {
    return res.status(401).json({ msg: "Sem autorização"} )
  }
}