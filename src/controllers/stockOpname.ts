import type { Request, Response } from 'express'
import orderIdFactory from 'order-id'
import { decode } from '../helpers/decode'
import { errorMessage, pageOptions, paginationLabels, type ListQuery } from '../helpers/http'
import { Product } from '../models/Product'
import { StockOpname, type StockOpnameDoc } from '../models/StockOpname'

const orderid = orderIdFactory('key')

type StockOpnameInput = Partial<Omit<StockOpnameDoc, 'user' | 'opnameId'>>

/** Sets each counted product's stock to the physically counted quantity. */
const applyCounts = async (products: StockOpnameDoc['product']) => {
  await Product.bulkWrite(
    products.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { stock: item.realQty },
      },
    }))
  )
}

export const postStockOpname = async (req: Request<unknown, unknown, StockOpnameInput>, res: Response) => {
  try {
    const stockOpname = await new StockOpname({
      ...req.body,
      opnameId: orderid.generate(),
      user: decode(req).id,
    }).save()

    if (stockOpname.apply) {
      await applyCounts(stockOpname.product)
    }

    const resultData = await StockOpname.findOne({ _id: stockOpname._id }).populate(
      'product.product user',
      'name'
    )

    res.json({
      message: 'Successfully post data',
      data: resultData,
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const applyStockOpname = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const opnameData = await StockOpname.findOne({ _id: req.params.id })

    if (!opnameData) {
      return res.status(404).json({ message: 'Data not found' })
    }
    if (opnameData.apply) {
      return res.status(403).json({ message: 'This stock opname is already applied' })
    }

    await applyCounts(opnameData.product)

    const stockOpname = await StockOpname.findOneAndUpdate(
      { _id: opnameData._id },
      { apply: true },
      { new: true }
    ).populate('product.product user', 'name')
    res.json({ message: 'Successfully update', data: stockOpname })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const getStockOpname = async (req: Request<unknown, unknown, unknown, ListQuery>, res: Response) => {
  try {
    const { q } = req.query

    const stockOpname = await StockOpname.paginate(
      { opnameId: { $regex: q || '', $options: 'i' } },
      {
        ...pageOptions(req.query),
        populate: { path: 'user product.product', select: 'name' },
        sort: { createdAt: -1 },
        customLabels: paginationLabels,
      }
    )
    res.json({
      message: 'Successfully get data',
      data: { ...stockOpname },
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}
