import type { Request, Response } from 'express'
import { Role, type RoleDoc } from '../models/Role'
import { errorMessage, pageOptions, paginationLabels, type ListQuery } from '../helpers/http'

export const getRole = async (req: Request<unknown, unknown, unknown, ListQuery>, res: Response) => {
  try {
    const { q } = req.query

    const role = await Role.paginate(
      { roleName: { $regex: q || '', $options: 'i' } },
      {
        ...pageOptions(req.query),
        sort: { createdAt: 1 },
        customLabels: paginationLabels,
        select: ['roleName', 'allows', 'title'],
      }
    )

    res.json({
      message: 'Successfully get data',
      ...role,
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

/**
 * Seeds the roles collection. Expected body, e.g.:
 * `[{ roleName: 'super_admin', title: 'Super Admin', allows: [...] }, ...]`
 */
export const postDefaultRole = async (req: Request<unknown, unknown, RoleDoc[]>, res: Response) => {
  try {
    const existing = await Role.find()
    if (existing.length) return res.status(400).json({ message: 'Role available' })
    const role = await Role.insertMany(req.body)

    return res.json({
      message: 'Successfully get data',
      data: role,
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const updateRole = async (
  req: Request<{ id: string }, unknown, { allows: string[] }>,
  res: Response
) => {
  try {
    const { id } = req.params
    const { allows } = req.body

    if (!allows.includes('pos')) {
      return res.status(404).json({ message: 'Tidak bisa menghapus Point of Sales' })
    }

    const role = await Role.findOneAndUpdate(
      { _id: id, roleName: { $ne: 'super_admin' } },
      { allows },
      { new: true }
    )

    if (role) {
      return res.send({
        message: 'Sukses update role',
        data: role,
      })
    }
    return res.status(404).json({ message: 'Update role gagal' })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}
