const express = require("express");

const {
  postCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} = require("../conrollers/category");
const { authUser } = require("../middlewares/authUser");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/category", authUser, postCategory);
router.get("/category", authUser, isAdmin, getCategory);
router.delete("/category/:id", authUser, deleteCategory);
router.put("/category/:id", authUser, updateCategory);

module.exports = router;
