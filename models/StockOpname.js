const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const monggoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const stockOpnameSchema = new mongoose.Schema(
  {
    opnameId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
    },
    product: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
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
);

stockOpnameSchema.plugin(monggoosePaginate);
stockOpnameSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("StockOpname", stockOpnameSchema);
