const { decode } = require("../helpers/decode");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const orderid = require("order-id")("key");
const html_to_pdf = require("html-pdf-node");
const { readdirSync, readFileSync, writeFileSync, readFile } = require("fs");
const { invoice } = require("../assets/html/invoice");
const moment = require("moment");

exports.postOrder = async (req, res) => {
  try {
    const orderId = orderid.generate();

    let payload = {
      ...req.body,
      orderId,
    };
    if (!payload.user) {
      const user = await decode(req);
      payload.user = user.id;
    }
    if (!payload.status) {
      payload.status = "process";
    }

    const total = payload?.details.reduce((a, c) => a + c.price * c.qty, 0);
    const totalBuyPrice = payload?.details.reduce(
      (a, c) => a + c.buyPrice * c.qty,
      0
    );

    const totalQty = payload?.details.reduce((a, c) => a + c.qty, 0);
    payload = {
      ...payload,
      totalBuyPrice,
      total,
      totalQty,
    };

    let update = [];
    for (item of payload.details) {
      let tmp = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.qty } },
        {
          $inc: { stock: -item.qty },
        },
        { new: true }
      );
      if (tmp) {
        update.push(tmp._id.toString());
      }
    }

    payload.details = await payload.details.filter((item) =>
      update.includes(item.product)
    );

    // Save Order details
    const order = await new Order({ ...payload }).save();

    const orderPopulate = await Order.findOne({ _id: order._id })
      .populate("user", "name email status role activate profilePicture")
      .populate("details.product");

    res.json({
      message: "Successfully post data",
      data: orderPopulate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { q, limit, page } = req.query;
    const myCustomLabels = {
      totalDocs: "itemCount",
      docs: "data",
      meta: "paginator",
    };

    const options = {
      limit: limit || 25,
      page: page || 1,
      sort: {
        createdAt: -1,
      },
      populate: {
        path: "user details.product",
        select:
          "name status category buyPrice retailPrice wholesalerPrice stock image",
      },
      customLabels: myCustomLabels,
    };

    const order = await Order.paginate(
      {
        orderId: { $regex: q || "", $options: "i" },
      },
      options
    );

    res.json({
      message: "Successfully get data",
      data: { ...order },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.download = async (req, res) => {
  try {
    const { orderId } = req.query;

    const myCustomLabels = {
      totalDocs: "itemCount",
      docs: "data",
      meta: "paginator",
    };

    const options = {
      populate: {
        path: "user details.product",
        select:
          "name status category buyPrice retailPrice wholesalerPrice stock image",
      },
      customLabels: myCustomLabels,
    };

    const order = await Order.findOne({
      orderId: { $regex: orderId || "", $options: "i" },
    })
      .populate("user", "name email status role activate profilePicture")
      .populate("details.product");

    let optionsPdf = { format: "A4" };
    let file = { content: invoice(order) };

    const pdfBuffer = await html_to_pdf.generatePdf(file, optionsPdf);
    await writeFileSync("assets/pdf/invoice.pdf", pdfBuffer);

    res.download("assets/pdf/invoice.pdf");

    // res.json({ order: pdfBuffer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changeStatusOrder = async (req, res) => {
  const orderId = req.params.orderId;

  const order = await Order.findOneAndUpdate(
    { orderId: orderId },
    { status: "complete" },
    { new: true }
  )
    .populate("user", "name status")
    .populate(
      "details.product",
      "category buyPrice retailPrice wholesalerPrice stock image"
    );

  res.json({ message: "Sukses update data order", data: order });
};
