const { find } = require("../models/Product");
const Product = require("../models/Product");

exports.postProduct = async (req, res) => {
  try {
    const { name } = req.body;
    // name: { $regex: new RegExp("^" + name.toLowerCase(), "i") },
    const duplicate = await Product.findOne({
      name,
    });
    if (duplicate) {
      return res.status(400).json({
        message: "Product name already exists",
      });
    }

    const product = await new Product({ ...req.body }).save();
    console.log(product);
    const productPopulate = await Product.findOne({
      _id: product._id,
    }).populate("category", "name");
    res.json({
      message: "Successfully post data",
      data: productPopulate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { q, limit, page, category } = req.query;
    const myCustomLabels = {
      totalDocs: "itemCount",
      docs: "data",
      meta: "paginator",
    };

    const options = {
      limit: limit || 25,
      page: page || 1,
      populate: { path: "category", select: "name" },
      sort: {
        createdAt: 1,
      },
      customLabels: myCustomLabels,
    };
    let product = null;
    if (category) {
      // filter by category
      product = await Product.paginate(
        {
          name: { $regex: q || "", $options: "i" },
          category,
        },
        options
      );
    } else {
      // no filter category
      product = await Product.paginate(
        {
          name: { $regex: q || "", $options: "i" },
        },
        options
      );
    }

    res.json({
      message: "Successfully get data",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id }).populate(
      "category",
      "name"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      message: "Successfully get data",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    ).populate("category", "name");
    if (product) {
      return res.json({
        message: "Successfully updated product",
        data: product,
      });
    } else {
      return res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProductStockByBarcode = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { barcode: req.params.barcode },
      {
        $inc: {
          stock: 1,
        },
      },
      { new: true }
    ).populate("category", "name");
    if (product) {
      return res.json({
        message: "Successfully updated stock",
        data: product,
      });
    } else {
      return res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (product) {
      return res.json({
        message: "Successfully delete data",
        data: product,
      });
    } else {
      return res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
