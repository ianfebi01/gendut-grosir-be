const { decode } = require('../helpers/decode')

const Product = require('../models/Product')
const StockOpname = require('../models/StockOpname')
const orderid = require('order-id')('key')

// Post
exports.postStockOpname = async (req, res) => {
  try {
    const opnameId = orderid.generate()

    let payload = {
      ...req.body,
      opnameId,
    }
    const user = await decode(req)
    payload.user = user.id
    console.log(payload)

    const stockOpname = await new StockOpname({ ...payload }).save()
    const resultData = await StockOpname.findOne({
      _id: stockOpname._id,
    }).populate('product.product', 'name')
    if (payload.apply) {
      for (item of payload.product) {
        await Product.updateOne(item.product, {
          $inc: { stock: -item.difference },
        })
      }
    }

    res.json({
      message: 'Successfully post data',
      data: resultData,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.applyStockOpname = async (req, res) => {
  try {
    const id = req.params.id

    const opnameData = await StockOpname.findOne({ _id: id })

    if (opnameData.apply)
      return res
        .status(403)
        .json({ message: 'This stock opname is already applied' })

    const query = await opnameData.product.map((item) => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: { stock: item.realQty },
      },
    }))

    await Product.bulkWrite(query)

    const stockOpname = await StockOpname.findOneAndUpdate(
      { _id: opnameData._id },
      { apply: true },
      { new: true }
    ).populate('product.product', 'name')
    res.json({ message: 'Successfully update', data: stockOpname })
    // res.json({ message: "Successfully update", data: "tes" });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get
exports.getStockOpname = async (req, res) => {
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
      populate: {
        path: 'product.product',
        select: 'name',
      },
      sort: {
        createdAt: 1,
      },
      customLabels: myCustomLabels,
    }
    const stockOpname = await StockOpname.paginate(
      {
        opnameId: {
          $regex: q || '',
          $options: 'i',
        },
      },
      options
    )
    res.json({
      message: 'Successfully get data',
      data: { ...stockOpname },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
