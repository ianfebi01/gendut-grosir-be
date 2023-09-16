const jwt = require('jsonwebtoken')
const status = require('http-status')

exports.authUser = async (req, res, next) => {
  try {
    let tmp = req.header('Authorization')
    const token = tmp ? tmp.slice(7, tmp.length) : ''

    if (!token) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ message: status[status.UNAUTHORIZED] })
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res
          .status(status.UNAUTHORIZED)
          .json({ message: status[status.UNAUTHORIZED] })
      }
      require.user = user
      next()
    })
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: status[status.INTERNAL_SERVER_ERROR] })
  }
}
