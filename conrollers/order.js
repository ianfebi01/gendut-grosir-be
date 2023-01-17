const { decode } = require("../helpers/decode");
const Order = require("../models/Order");

exports.postOrder = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      total: 12000,
    };
    if (!payload.user) {
      const user = await decode(req);
      payload.user = user.id;
      console.log(user);
    }
    const order = await new Order({ ...payload }).save();
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
