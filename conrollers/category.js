const Category = require("../models/Category");

exports.postCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const duplicate = await Category.findOne({
      name: { $regex: new RegExp("^" + name.toLowerCase(), "i") },
    });
    if (duplicate) {
      return res.status(400).json({
        message: "Category name already exists",
      });
    }
    const category = await new Category({
      name,
    }).save();

    res.json({ message: "Successfully created new category", data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.find().sort({ createdAt: -1 });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id });
    res.json({ message: "Successfully deleted category", data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { name: req.body.name },
      {
        new: true,
      }
    );
    if (category) {
      return res.json({
        message: "Successfully edited category",
        data: category,
      });
    } else {
      return res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
