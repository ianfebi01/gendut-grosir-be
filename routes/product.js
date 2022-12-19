const express = require("express");
const { postProduct, getProduct } = require("../conrollers/product");
const { authUser } = require("../middlewares/authUser");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/product", authUser, isAdmin, postProduct);
router.get("/product", authUser, isAdmin, getProduct);

module.exports = router;
