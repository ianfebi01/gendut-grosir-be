import type { Request } from 'express'
import { decode } from './decode'
import { User } from '../models/User'
import type { RoleDoc } from '../models/Role'

const ADMIN_ROLES = ['admin', 'super_admin']

export const isAdminUser = async (userId: string): Promise<boolean> => {
  const user = await User.findOne({ _id: userId }).populate<{ role: RoleDoc | null }>('role', 'roleName')
  return ADMIN_ROLES.includes(user?.role?.roleName ?? '')
}

/** True when the request carries a valid token belonging to an admin; never throws. */
export const isAdminRequest = async (req: Pick<Request, 'header'>): Promise<boolean> => {
  try {
    return await isAdminUser(decode(req).id)
  } catch {
    return false
  }
}
