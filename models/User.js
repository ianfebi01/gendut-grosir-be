const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate-v2')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: ObjectId,
      // enum: ["super_admin", "admin", "customer"],
      ref: 'Role',
      required: true,
    },
    status: {
      type: String,
    },
    activate: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      trim: true,
      default:
        'https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png',
    },
  },
  { timestamps: true }
)
userSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('User', userSchema)
