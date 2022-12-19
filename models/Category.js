const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
