const Role = require('../models/Role')

exports.getRole = async (req, res) => {
  try {
    const myCustomLabels = {
      totalDocs: 'itemCount',
      docs: 'data',
      meta: 'paginator',
    }

    const { q, limit, page } = req.query

    const options = {
      limit: limit || 25,
      page: page || 1,
      sort: {
        createdAt: 1,
      },
      customLabels: myCustomLabels,
      select: ['roleName'],
    }
    const role = await Role.paginate(
      {
        roleName: { $regex: q || '', $options: 'i' },
      },
      options
    )

    res.json({
      message: 'Successfully get data',
      ...role,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params
    const { allow } = req.body
    const role = await Role.findOneAndUpdate(
      {
        _id: id,
      },
      {
        allow,
      },
      { new: true }
    )

    if (role) {
      return res.send({
        message: 'Sukses update role',
        data: role,
      })
    } else {
      return res.status(404).json({ message: 'Update role gagal' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
