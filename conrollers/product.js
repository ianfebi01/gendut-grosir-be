const Product = require("../models/Product");

exports.postProduct = async (req, res) => {
  try {
    const { name } = req.body;
    const duplicate = await Product.findOne({
      name: { $regex: new RegExp("^" + name.toLowerCase(), "i") },
    });
    if (duplicate) {
      return res.status(400).json({
        message: "Product name already exists",
      });
    }

    const product = await new Product({ ...req.body }).save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.find().populate("category", "name");
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProductVariant = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { variant: req.body.variant },
      {
        new: true,
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
