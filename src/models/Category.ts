import mongoose, { type AggregatePaginateModel, type InferSchemaType } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  { timestamps: true }
)
categorySchema.plugin(aggregatePaginate)

export type CategoryDoc = InferSchemaType<typeof categorySchema>

export const Category = mongoose.model<CategoryDoc, AggregatePaginateModel<CategoryDoc>>(
  'Category',
  categorySchema
)
