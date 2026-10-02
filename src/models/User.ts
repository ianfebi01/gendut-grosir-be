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
    /** Set only on the account created on a fresh database; see `register`. */
    isBootstrap: {
      type: Boolean,
      select: false,
    },
  },
  { timestamps: true }
)
// At most one bootstrap user, so two simultaneous first sign-ups can't both become super admin.
userSchema.index(
  { isBootstrap: 1 },
  { unique: true, partialFilterExpression: { isBootstrap: true } }
)
userSchema.plugin(mongoosePaginate)

export type UserDoc = InferSchemaType<typeof userSchema>

export const User = mongoose.model<UserDoc, PaginateModel<UserDoc>>('User', userSchema)
