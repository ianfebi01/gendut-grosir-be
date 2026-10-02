import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import status from 'http-status'
import { env } from '../config'
import { getBearerToken } from '../helpers/decode'
import type { TokenPayload } from '../types/express'

export const authUser: RequestHandler = (req, res, next) => {
  const token = getBearerToken(req)

  if (!token) {
    return res.status(status.UNAUTHORIZED).json({ message: status[status.UNAUTHORIZED] })
  }

  jwt.verify(token, env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(status.UNAUTHORIZED).json({ message: status[status.UNAUTHORIZED] })
    }
    req.user = user as TokenPayload
    next()
  })
}
