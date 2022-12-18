const { decode } = require("../helpers/decode");
const User = require("../models/User");

exports.isAdmin = async (req, res, next) => {
  try {
    const decoded = decode(req);
    const user = await User.findOne({ _id: decoded.id });
    const admin = user.role === "admin" || user.role === "super_admin";
    if (!admin) {
      return res.status(401).json({
        message: "Permission denied",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
