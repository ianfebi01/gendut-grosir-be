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
      required: false,
      index: true,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/djyp9rr7s/image/upload/v1671439956/Pngtree_no_image_vector_illustration_isolated_4979075_ncvayj.png",
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
