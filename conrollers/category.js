const Category = require("../models/Category");

exports.postCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (name) {
      // : { $regex: new RegExp("^" + name.toLowerCase(), "i") }
      const duplicate = await Category.findOne({
        name,
      });
      if (duplicate) {
        return res.status(400).json({
          message: "Category name already exists",
        });
      }
      const category = await new Category({
        name,
      }).save();

      res.json({
        message: "Successfully created new category",
        data: category,
      });
    }
    res.status(500).json({ message: "Name can't blank" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategory = async (req, res) => {
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
      customLabels: myCustomLabels,
    };
    const agregate = Category.aggregate([
      { $match: { name: { $regex: q || "", $options: "i" } } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          _id: 1,
          category: 1,
          totalProducts: { $size: "$products" },
          name: "$name",
        },
      },
    ]);
    const category = await Category.aggregatePaginate(agregate, options);
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
