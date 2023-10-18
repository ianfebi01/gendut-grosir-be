const Category = require('../models/Category')
const status = require('http-status')

exports.postCategory = async (req, res) => {
  try {
    const { name } = req.body
    if (name) {
      // : { $regex: new RegExp("^" + name.toLowerCase(), "i") }
      const duplicate = await Category.findOne({
        name,
      })
      if (duplicate) {
        return res.status(status.BAD_REQUEST).json({
          message: 'Category name already exists',
        })
      }
      const category = await new Category({
        name,
      }).save()

      return res.status(status.CREATED).json({
        message: 'Successfully created new category',
        data: category,
      })
    }
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Name can't blank" })
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

exports.getCategory = async (req, res) => {
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
      customLabels: myCustomLabels,
    }
    const agregate = Category.aggregate([
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
    const category = await Category.aggregatePaginate(agregate, options)
    return res.status(status.OK).json(category)
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id })
    return res.json({
      message: 'Successfully deleted category',
      data: category,
    })
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { name: req.body.name },
      {
        new: true,
      }
    )
    if (category) {
      return res.json({
        message: 'Successfully edited category',
        data: category,
      })
    } else {
      return res.status(status.NOT_FOUND).json({ message: 'Data not found' })
    }
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}
