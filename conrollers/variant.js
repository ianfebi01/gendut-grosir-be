const Variant = require("../models/Variant");

exports.postVariant = async (req, res) => {
  try {
    const { name } = req.body;
    const duplicate = await Variant.findOne({
      name: { $regex: new RegExp("^" + name.toLowerCase(), "i") },
    });
    if (duplicate) {
      return res.status(400).json({
        message: "Category name already exists",
      });
    }

    const variant = await new Variant({ ...req.body }).save();
    res.json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
