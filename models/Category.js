const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  { timestamps: true }
);
categorySchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Category", categorySchema);
