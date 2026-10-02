import mongoose, { type InferSchemaType, type PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const roleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
    },
    title: {
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
  }
)
roleSchema.plugin(mongoosePaginate)

export type RoleDoc = InferSchemaType<typeof roleSchema>

export const Role = mongoose.model<RoleDoc, PaginateModel<RoleDoc>>('Role', roleSchema)
