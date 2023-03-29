const { decode } = require("../helpers/decode");
const Product = require("../models/Product");
const StockOpname = require("../models/StockOpname");
const orderid = require("order-id")("key");

exports.postStockOpname = async (req, res) => {
  try {
    const opnameId = orderid.generate();

    let payload = {
      ...req.body,
      opnameId,
    };
    const user = await decode(req);
    payload.user = user.id;

    const stockOpname = await new StockOpname({ ...payload }).save();
    if (payload.apply) {
      for (item of payload.product) {
        await Product.updateOne(item.product, {
          $inc: { stock: -item.difference },
        });
      }
    }

    res.json({
      message: "Successfully post data",
      data: stockOpname,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getStockOpname = async (req, res) => {
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
      populate: {
        path: "product.product",
        select:
          "name status category buyPrice retailPrice wholesalerPrice stock image",
      },
      sort: {
        createdAt: 1,
      },
      customLabels: myCustomLabels,
    };
    const stockOpname = await StockOpname.paginate(
      {
        opnameId: {
          $regex: q || "",
          $options: "i",
        },
      },
      options
    );
    res.json({
      message: "Successfully get data",
      data: { ...stockOpname },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
