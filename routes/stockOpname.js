const express = require("express");
const {
  postStockOpname,
  getStockOpname,
  applyStockOpname,
} = require("../controllers/stockOpname");
const { authUser } = require("../middlewares/authUser");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/stockOpname", authUser, isAdmin, postStockOpname);
router.put("/stockOpname/:id", authUser, isAdmin, applyStockOpname);
router.get("/stockOpname", authUser, isAdmin, getStockOpname);

module.exports = router;
