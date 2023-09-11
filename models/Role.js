const mongoose = require('mongoose')

const mongoosePaginate = require('mongoose-paginate-v2')

const roleSchema = mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
    },
    allows: [
      {
        type: String,
        required: true,
        default: [
          'login',
          'pos',
          'orders',
          'library',
          'category',
          'product',
          'stockOpname',
          'dashboard',
        ],
      },
    ],
  },
  { timestamp: true }
)
roleSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Role', roleSchema)
