import type { RequestHandler } from 'express'
import { decode } from '../helpers/decode'
import { User } from '../models/User'
import type { RoleDoc } from '../models/Role'

export const isAdmin: RequestHandler = async (req, res, next) => {
  try {
    const decoded = decode(req)
    const user = await User.findOne({ _id: decoded.id }).populate<{ role: RoleDoc }>(
      'role',
      'roleName allow'
    )

    const admin = user?.role.roleName === 'admin' || user?.role.roleName === 'super_admin'
    if (!admin) {
      return res.status(401).json({
        message: 'Permission denied',
      })
    }
    next()
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message })
  }
}
