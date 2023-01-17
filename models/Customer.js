const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["retail", "wholesaler"],
    },
    activate: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png",
    },
  },
  { timestamps: true }
);
customerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Customer", customerSchema);
