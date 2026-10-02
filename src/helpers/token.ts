import jwt from 'jsonwebtoken'
import { env } from '../config'

export const generateToken = (payload: object, expired: string | number): string => {
  return jwt.sign(payload, env.TOKEN_SECRET, {
    expiresIn: expired,
  })
}
