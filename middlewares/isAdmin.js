const { decode } = require('../helpers/decode')
const User = require('../models/User')

exports.isAdmin = async (req, res, next) => {
  try {
    const decoded = decode(req)
    const user = await User.findOne({ _id: decoded.id }).populate(
      'role',
      'roleName allow'
    )

    const admin =
      user.role.roleName === 'admin' || user.role.roleName === 'super_admin'
    if (!admin) {
      return res.status(401).json({
        message: 'Permission denied',
      })
    }
    next()
  } catch (error) {
    console.log('error')
    return res.status(500).json({ message: error.message })
  }
}
