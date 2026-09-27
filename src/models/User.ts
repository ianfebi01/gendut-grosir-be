import mongoose, { type InferSchemaType, type PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema(
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

export type UserDoc = InferSchemaType<typeof userSchema>

export const User = mongoose.model<UserDoc, PaginateModel<UserDoc>>('User', userSchema)
