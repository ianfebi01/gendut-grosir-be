const mongoose = require("mongoose");
const findOrCreate = require("mongoose-find-or-create");
const { ObjectId } = mongoose.Schema;

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  { timestamps: true }
);
categorySchema.plugin(findOrCreate);

module.exports = mongoose.model("Category", categorySchema);
