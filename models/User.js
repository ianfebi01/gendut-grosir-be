const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    role: {
      type: String,
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

module.exports = mongoose.model("User", userSchema);
