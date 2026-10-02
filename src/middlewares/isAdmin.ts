import type { RequestHandler } from 'express'
import { decode } from '../helpers/decode'
import { isAdminUser } from '../helpers/auth'

export const isAdmin: RequestHandler = async (req, res, next) => {
  try {
    if (!(await isAdminUser(decode(req).id))) {
      return res.status(401).json({
        message: 'Permission denied',
      })
    }
    next()
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message })
  }
}
