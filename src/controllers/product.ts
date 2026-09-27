import type { Request, Response } from 'express'
import { Product, type ProductDoc } from '../models/Product'
import { errorMessage, pageOptions, paginationLabels, type ListQuery } from '../helpers/http'
import { ImageValidationError, uploadSingleImage } from './upload'

type ProductInput = Partial<ProductDoc>
type IdParams = { id: string }

const handleError = (res: Response, error: unknown) =>
  res.status(error instanceof ImageValidationError ? 400 : 500).json({ message: errorMessage(error) })

export const postProduct = async (req: Request<unknown, unknown, ProductInput>, res: Response) => {
  try {
    const payload = req.body

    const duplicate = await Product.findOne({ name: payload.name })
    if (duplicate) {
      return res.status(400).json({
        message: 'Product name already exists',
      })
    }
    if (!payload.stock) {
      payload.stock = 0
    }
    const uploadImage = await uploadSingleImage(req)
    if (uploadImage) {
      payload.image = uploadImage
    }

    const product = await new Product({ ...payload }).save()

    const productPopulate = await Product.findOne({ _id: product._id }).populate('category', 'name')
    res.json({
      message: 'Successfully post data',
      data: productPopulate,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getProduct = async (
  req: Request<unknown, unknown, unknown, ListQuery & { category?: string }>,
  res: Response
) => {
  try {
    const { q, category } = req.query

    const product = await Product.paginate(
      {
        name: { $regex: q || '', $options: 'i' },
        ...(category ? { category } : {}),
      },
      {
        ...pageOptions(req.query),
        populate: { path: 'category', select: 'name' },
        sort: { createdAt: 1 },
        customLabels: paginationLabels,
      }
    )

    res.json({
      message: 'Successfully get data',
      data: product,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getProductById = async (req: Request<IdParams>, res: Response) => {
  try {
    const product = await Product.findOne({ _id: req.params.id }).populate('category', 'name')
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({
      message: 'Successfully get data',
      data: product,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getProductByBarcode = async (req: Request<{ barcode: string }>, res: Response) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode }).populate('category', 'name')
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' })
    }

    res.json({
      message: 'Successfully get data',
      data: product,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const updateProduct = async (req: Request<IdParams, unknown, ProductInput>, res: Response) => {
  try {
    const payload = req.body

    const uploadImage = await uploadSingleImage(req)
    if (uploadImage) {
      payload.image = uploadImage
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { ...payload },
      { new: true }
    ).populate('category', 'name')
    if (product) {
      return res.json({
        message: 'Successfully updated product',
        data: product,
      })
    }
    return res.status(404).json({ message: 'Data not found' })
  } catch (error) {
    handleError(res, error)
  }
}

export const updateProductStockByBarcode = async (req: Request<{ barcode: string }>, res: Response) => {
  try {
    const product = await Product.findOneAndUpdate(
      { barcode: req.params.barcode },
      { $inc: { stock: 1 } },
      { new: true }
    ).populate('category', 'name')
    if (product) {
      return res.json({
        message: 'Successfully updated stock',
        data: product,
      })
    }
    return res.status(404).json({ message: 'Produk tidak ditemukan' })
  } catch (error) {
    handleError(res, error)
  }
}

export const deleteProduct = async (req: Request<IdParams>, res: Response) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id)
    if (product) {
      return res.json({
        message: 'Successfully delete data',
        data: product,
      })
    }
    return res.status(404).json({ message: 'Data not found' })
  } catch (error) {
    handleError(res, error)
  }
}
