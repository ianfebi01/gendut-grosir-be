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
      select: ['roleName', 'allows', 'title'],
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
exports.postDefaultRole = async (req, res) => {
  try {
    // const body = [
    //   {
    //     roleName: 'super_admin',
    //     title: 'Super Admin',
    //     allows: [
    //       'login',
    //       'pos',
    //       'orders',
    //       'library',
    //       'category',
    //       'product',
    //       'stockOpname',
    //       'dashboard',
    //       'customers',
    //       'role',
    //     ],
    //   },
    //   {
    //     roleName: 'admin',
    //     title: 'Admin',
    //     allows: [
    //       'pos',
    //       'orders',
    //       'stockOpname',
    //       'category',
    //       'product',
    //       'library',
    //     ],
    //   },
    //   {
    //     roleName: 'user',
    //     title: 'User',
    //     allows: ['pos'],
    //   },
    // ]

    const body = req.body
    const isRole = await Role.find()
    if(isRole?.length)  return res.status(400).json({ message: "Role available" })
    const role = await Role.insertMany(body)

   return res.json({
      message: 'Successfully get data',
      data: role,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params
    const { allows } = req.body

    const isPos = allows.findIndex((item) => item === 'pos')

    if (isPos !== -1) {
      const role = await Role.findOneAndUpdate(
        {
          _id: id,
          roleName: { $ne: 'super_admin' },
        },
        {
          allows,
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
    } else {
      return res
        .status(404)
        .json({ message: 'Tidak bisa menghapus Point of Sales' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
