const { decode } = require('../helpers/decode')
const Order = require('../models/Order')
const Product = require('../models/Product')
const orderid = require('order-id')('key')
const { invoice } = require('../assets/html/invoice')
const { default: puppeteer } = require('puppeteer')

exports.postOrder = async (req, res) => {
  try {
    const orderId = orderid.generate()

    let payload = {
      ...req.body,
      orderId,
    }
    if (!payload.user) {
      const user = await decode(req)
      payload.user = user.id
    }
    if (!payload.status) {
      payload.status = 'process'
    }

    const total = payload?.details.reduce((a, c) => a + c.price * c.qty, 0)
    const totalBuyPrice = payload?.details.reduce(
      (a, c) => a + c.buyPrice * c.qty,
      0
    )

    const totalQty = payload?.details.reduce((a, c) => a + c.qty, 0)
    payload = {
      ...payload,
      totalBuyPrice,
      total,
      totalQty,
    }

    let update = []
    for (item of payload.details) {
      let tmp = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.qty } },
        {
          $inc: { stock: -item.qty },
        },
        { new: true }
      )
      if (tmp) {
        update.push(tmp._id.toString())
      }
    }

    payload.details = await payload.details.filter((item) =>
      update.includes(item.product)
    )

    // Save Order details
    const order = await new Order({ ...payload }).save()

    const orderPopulate = await Order.findOne({ _id: order._id })
      .populate('user', 'name email status role activate profilePicture')
      .populate('details.product')

    res.json({
      message: 'Successfully post data',
      data: orderPopulate,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getOrder = async (req, res) => {
  try {
    const { q, limit, page } = req.query
    const myCustomLabels = {
      totalDocs: 'itemCount',
      docs: 'data',
      meta: 'paginator',
    }

    const options = {
      limit: limit || 25,
      page: page || 1,
      sort: {
        createdAt: -1,
      },
      populate: {
        path: 'user details.product',
        select:
          'name status category buyPrice retailPrice wholesalerPrice stock image',
      },
      customLabels: myCustomLabels,
    }

    const order = await Order.paginate(
      {
        orderId: { $regex: q || '', $options: 'i' },
      },
      options
    )

    res.json({
      message: 'Successfully get data',
      data: { ...order },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.download = async (req, res) => {
  try {
    const { orderId } = req.query

    const myCustomLabels = {
      totalDocs: 'itemCount',
      docs: 'data',
      meta: 'paginator',
    }

    const options = {
      populate: {
        path: 'user details.product',
        select:
          'name status category buyPrice retailPrice wholesalerPrice stock image',
      },
      customLabels: myCustomLabels,
    }

    const order = await Order.findOne({
      orderId: { $regex: orderId || '', $options: 'i' },
    })
      .populate('user', 'name email status role activate profilePicture')
      .populate('details.product')

    const browser = await puppeteer.launch({
      // headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath:
        process.env.NODE_ENV === 'production'
          ? '/usr/bin/google-chrome-stable'
          : null,
    })
    const page = await browser.newPage()
    await page.setContent(invoice(order), { waitUntil: 'domcontentloaded' })
    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen')

    const pdf = await page.pdf({
      path: 'assets/pdf/invoice.pdf',
      // margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
      printBackground: true,
      format: 'A4',
    })

    // Close the browser instance
    await browser.close()

    res.download('assets/pdf/invoice.pdf')

    // res.json({ order: pdfBuffer });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.changeStatusOrder = async (req, res) => {
  const orderId = req.params.orderId

  const order = await Order.findOneAndUpdate(
    { orderId: orderId },
    { status: 'complete' },
    { new: true }
  )
    .populate('user', 'name status')
    .populate(
      'details.product',
      'category buyPrice retailPrice wholesalerPrice stock image'
    )

  res.json({ message: 'Sukses update data order', data: order })
}
exports.cancelOrder = async (req, res) => {
  const orderId = req.params.orderId

  const order = await Order.findOneAndUpdate(
    { orderId: orderId },
    { status: 'cancel' },
    { new: true }
  )
    .populate('user', 'name status')
    .populate(
      'details.product',
      'category buyPrice retailPrice wholesalerPrice stock image'
    )

  for (item of order.details) {
    await Product.findOneAndUpdate(
      { _id: item.product },
      {
        $inc: { stock: +item.qty },
      },
      { new: true }
    )
  }

  res.json({ message: 'Sukses update data order', data: order })
}
