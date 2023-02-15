const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  access: {
    type: Array,
    required: true,
  },
  children: [
    {
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      access: {
        type: Array,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Menu", menuSchema);
