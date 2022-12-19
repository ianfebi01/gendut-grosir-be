const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

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
    variant: [
      {
        type: ObjectId,
        ref: "Variant",
      },
    ],
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
