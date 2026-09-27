import type { Request, Response } from 'express'
import moment from 'moment'
import orderIdFactory from 'order-id'
import type { Types } from 'mongoose'
import { decode } from '../helpers/decode'
import { errorMessage, pageOptions, paginationLabels, type ListQuery } from '../helpers/http'
import { Order } from '../models/Order'
import { Product } from '../models/Product'

const orderid = orderIdFactory('key')

interface OrderDetailInput {
  product: string
  qty: number
  price: number
  buyPrice: number
}

interface OrderInput {
  user?: string
  status?: string
  details: OrderDetailInput[]
  [key: string]: unknown
}

type OrderIdParams = { orderId: string }

export const postOrder = async (req: Request<unknown, unknown, OrderInput>, res: Response) => {
  try {
    const orderId = orderid.generate()

    const payload = {
      ...req.body,
      orderId,
    }
    if (!payload.user) {
      payload.user = decode(req).id
    }
    if (!payload.status) {
      payload.status = 'process'
    }

    const total = payload.details.reduce((a, c) => a + c.price * c.qty, 0)
    const totalBuyPrice = payload.details.reduce((a, c) => a + c.buyPrice * c.qty, 0)
    const totalQty = payload.details.reduce((a, c) => a + c.qty, 0)

    // Decrement stock only for products that have enough; the rest are dropped from the order.
    const updated: string[] = []
    for (const item of payload.details) {
      const product = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.qty } },
        { $inc: { stock: -item.qty } },
        { new: true }
      )
      if (product) {
        updated.push(product._id.toString())
      }
    }

    const order = await new Order({
      ...payload,
      totalBuyPrice,
      total,
      totalQty,
      details: payload.details.filter((item) => updated.includes(item.product)),
      date: moment(new Date()).toISOString(),
    }).save()

    const orderPopulate = await Order.findOne({ _id: order._id })
      .populate('user', 'name email status role activate profilePicture')
      .populate('details.product')

    res.json({
      message: 'Successfully post data',
      data: orderPopulate,
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const getOrder = async (req: Request<unknown, unknown, unknown, ListQuery>, res: Response) => {
  try {
    const { q } = req.query

    const order = await Order.paginate(
      { orderId: { $regex: q || '', $options: 'i' } },
      {
        ...pageOptions(req.query),
        sort: { date: -1 },
        populate: {
          path: 'user details.product',
          select: 'name status category buyPrice retailPrice wholesalerPrice stock image',
        },
        customLabels: paginationLabels,
      }
    )

    res.json({
      message: 'Successfully get data',
      data: { ...order },
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const changeStatusOrder = async (req: Request<OrderIdParams>, res: Response) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status: 'complete' },
      { new: true }
    )
      .populate('user', 'name status')
      .populate('details.product', 'category buyPrice retailPrice wholesalerPrice stock image')

    res.json({ message: 'Sukses update data order', data: order })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const cancelOrder = async (req: Request<OrderIdParams>, res: Response) => {
  try {
    // `cancel` is not in the schema enum; this works because update validators are off.
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status: 'cancel' },
      { new: true }
    )
      .populate('user', 'name status')
      .populate<{ details: { product: { _id: Types.ObjectId }; qty: number }[] }>(
        'details.product',
        'category buyPrice retailPrice wholesalerPrice stock image'
      )

    if (!order) {
      return res.status(404).json({ message: 'Data not found' })
    }

    for (const item of order.details) {
      await Product.findOneAndUpdate({ _id: item.product }, { $inc: { stock: +item.qty } })
    }

    res.json({ message: 'Sukses update data order', data: order })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

/**
 * Dev/seed utility: rewrites every order's `date` to a random time up to 30 days
 * before its `createdAt`.
 */
export const updateTime = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find()

    const minus = orders.map(() => random(0, 30))
    let i = 0
    for (const item of orders) {
      try {
        const date = shiftTime(item.createdAt, minus[i]).toISOString()
        console.log(date)
        console.log(i)
        await Order.findOneAndUpdate({ _id: item._id }, { date }, { timestamps: false })
        i++
      } catch (error) {
        console.log(error)
      }
    }

    return res.json({ minus: await Order.find() })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

const shiftTime = (time: Date | string | number, minus: number) => {
  const source = new Date(time)
  let year = source.getFullYear()
  let month = source.getMonth()
  let date = source.getDate()

  if (date - minus < 1) {
    if (month - 1 < 1) {
      year = year - 1
    } else {
      month = month - 1
    }
  } else {
    date = date - minus
  }

  const hour = random(7, 19)
  const minute = random(0, 59)

  return new Date(year, month, date, hour, minute, source.getSeconds(), source.getMilliseconds())
}

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min
