import type { Request, Response } from 'express'
import { Menu, type MenuDoc } from '../models/Menu'
import { errorMessage } from '../helpers/http'

export const postDefaultMenu = async (req: Request<unknown, unknown, MenuDoc[]>, res: Response) => {
  try {
    const menu = await Menu.insertMany(req.body)
    res.json({
      message: 'Successfully post data',
      data: menu,
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const postMenu = async (req: Request<unknown, unknown, MenuDoc>, res: Response) => {
  try {
    const menu = await new Menu({ ...req.body }).save()
    res.json({
      message: 'Successfully post data',
      data: menu,
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const getMenu = async (_req: Request, res: Response) => {
  try {
    const menu = await Menu.find()
    res.json({
      message: 'Successfully post data',
      data: menu,
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}
