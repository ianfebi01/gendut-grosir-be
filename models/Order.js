const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      index: true,
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
    details: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
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
      enum: ["process", "complete"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(mongoosePaginate);
orderSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Order", orderSchema);
