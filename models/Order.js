const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const orderSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
  total: {
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
});

orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", orderSchema);
