import type { Request, Response } from 'express'
import status from 'http-status'
import { Category } from '../models/Category'
import { errorMessage, pageOptions, paginationLabels, type ListQuery } from '../helpers/http'

type IdParams = { id: string }

export const postCategory = async (req: Request<unknown, unknown, { name?: string }>, res: Response) => {
  try {
    const { name } = req.body
    if (name) {
      const duplicate = await Category.findOne({ name })
      if (duplicate) {
        return res.status(status.BAD_REQUEST).json({
          message: 'Category name already exists',
        })
      }
      const category = await new Category({ name }).save()

      return res.status(status.CREATED).json({
        message: 'Successfully created new category',
        data: category,
      })
    }
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: "Name can't blank" })
  } catch (error) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: errorMessage(error) })
  }
}

export const getCategory = async (req: Request<unknown, unknown, unknown, ListQuery>, res: Response) => {
  try {
    const { q } = req.query

    const aggregate = Category.aggregate([
      { $match: { name: { $regex: q || '', $options: 'i' } } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products',
        },
      },
      {
        $project: {
          _id: 1,
          category: 1,
          totalProducts: { $size: '$products' },
          name: '$name',
        },
      },
    ])
    const category = await Category.aggregatePaginate(aggregate, {
      ...pageOptions(req.query),
      sort: { createdAt: -1 },
      customLabels: paginationLabels,
    })
    return res.status(status.OK).json(category)
  } catch (error) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: errorMessage(error) })
  }
}

export const deleteCategory = async (req: Request<IdParams>, res: Response) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id })
    return res.json({
      message: 'Successfully deleted category',
      data: category,
    })
  } catch (error) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: errorMessage(error) })
  }
}

export const updateCategory = async (req: Request<IdParams, unknown, { name?: string }>, res: Response) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { name: req.body.name },
      { new: true }
    )
    if (category) {
      return res.json({
        message: 'Successfully edited category',
        data: category,
      })
    }
    return res.status(status.NOT_FOUND).json({ message: 'Data not found' })
  } catch (error) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: errorMessage(error) })
  }
}
