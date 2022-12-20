const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      index: true,
      required: true,
    },
    details: {
      type: String,
    },
    buyPrice: {
      type: Number,
      required: true,
    },
    wholesalerPrice: {
      type: Number,
      required: true,
    },
    retailPrice: {
      type: Number,
    },
    barcode: {
      type: Number,
      required: true,
      index: true,
    },
    image: {
      type: String,
      default:
        "https://asset.cloudinary.com/djyp9rr7s/0b8a7198d84eca5d1ad40d8112a10e36",
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", productSchema);
