import mongoose, { type InferSchemaType, type PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['retail', 'wholesaler'],
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
customerSchema.plugin(mongoosePaginate)

export type CustomerDoc = InferSchemaType<typeof customerSchema>

export const Customer = mongoose.model<CustomerDoc, PaginateModel<CustomerDoc>>(
  'Customer',
  customerSchema
)
