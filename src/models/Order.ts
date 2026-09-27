import mongoose, {
  type AggregatePaginateModel,
  type InferSchemaType,
  type PaginateModel,
} from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const { ObjectId } = mongoose.Schema.Types

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      index: true,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    orderId: {
      type: String,
      index: true,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    totalQty: {
      type: Number,
      required: true,
    },
    totalBuyPrice: {
      type: Number,
      required: true,
    },
    details: [
      {
        product: {
          type: ObjectId,
          ref: 'Product',
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['process', 'complete'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

orderSchema.plugin(mongoosePaginate)
orderSchema.plugin(aggregatePaginate)

export type OrderDoc = InferSchemaType<typeof orderSchema>

export const Order = mongoose.model<
  OrderDoc,
  PaginateModel<OrderDoc> & AggregatePaginateModel<OrderDoc>
>('Order', orderSchema)
