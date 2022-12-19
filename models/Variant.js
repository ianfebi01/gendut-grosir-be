const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      trim: true,
      required: false,
      default:
        "https://asset.cloudinary.com/djyp9rr7s/0b8a7198d84eca5d1ad40d8112a10e36",
    },
    product: {
      type: ObjectId,
      ref: "Product",
      required: true,
    },
    stock: [{ type: Number, index: true }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Variant", variantSchema);
