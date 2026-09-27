import type { Request } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config'
import type { TokenPayload } from '../types/express'

export const getBearerToken = (req: Pick<Request, 'header'>): string => {
  const header = req.header('Authorization')
  return header ? header.slice(7) : ''
}

export const decode = (req: Pick<Request, 'header'>): TokenPayload => {
  return jwt.verify(getBearerToken(req), env.TOKEN_SECRET) as TokenPayload
}
