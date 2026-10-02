import mongoose, {
  type AggregatePaginateModel,
  type InferSchemaType,
  type PaginateModel,
} from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const { ObjectId } = mongoose.Schema.Types

const stockOpnameSchema = new mongoose.Schema(
  {
    opnameId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      index: true,
      required: true,
    },
    product: [
      {
        product: {
          type: ObjectId,
          ref: 'Product',
          required: true,
        },
        systemQty: {
          type: Number,
          required: true,
        },
        realQty: {
          type: Number,
          required: true,
        },
        difference: {
          type: Number,
          required: true,
        },
      },
    ],
    apply: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

stockOpnameSchema.plugin(mongoosePaginate)
stockOpnameSchema.plugin(aggregatePaginate)

export type StockOpnameDoc = InferSchemaType<typeof stockOpnameSchema>

export const StockOpname = mongoose.model<
  StockOpnameDoc,
  PaginateModel<StockOpnameDoc> & AggregatePaginateModel<StockOpnameDoc>
>('StockOpname', stockOpnameSchema)
