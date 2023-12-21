const Menu = require("../models/Menu");

exports.postDefaultMenu = async (req, res) => {
  try {
    const menu = await  Menu.insertMany(
      req.body,
    );
    res.json({
      message: "Successfully post data",
      data: menu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.postMenu = async (req, res) => {
  try {
    const menu = await new Menu({
      ...req.body,
    }).save();
    res.json({
      message: "Successfully post data",
      data: menu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json({
      message: "Successfully post data",
      data: menu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
