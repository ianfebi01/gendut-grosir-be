const { decode } = require("../helpers/decode");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

exports.postOrder = async (req, res) => {
  try {
    const payload = {
      ...req.body,
    };
    if (!payload.user) {
      const user = await decode(req);
      payload.user = user.id;
    }
    const total = payload?.details.reduce((a, c) => a + c.price * c.qty, 0);
    payload.total = total;

    const order = await new Order({ ...payload }).save();

    for (item of payload.details) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: { stock: -item.qty },
        },
        { new: true }
      );
    }

    const orderPopulate = await Order.findOne({ _id: order._id })
      .populate("user")
      .populate("details");

    res.json({
      message: "Successfully post data",
      data: orderPopulate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
