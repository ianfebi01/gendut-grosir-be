const express = require("express");
const {
  postProduct,
  getProduct,
  getProductById,
  updateProduct,
  updateProductStockByBarcode,
  deleteProduct,
  getProductByBarcode,
} = require("../controllers/product");
const { authUser } = require("../middlewares/authUser");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/product", authUser, isAdmin, postProduct);
router.get("/product", authUser, getProduct);
router.get("/product/:id", authUser, getProductById);
router.get("/productByBarcode/:barcode", authUser, getProductByBarcode);
router.put("/product/:id", authUser, isAdmin, updateProduct);
router.put(
  "/product/stockbarcode/:barcode",
  authUser,
  isAdmin,
  updateProductStockByBarcode
);
router.delete("/product/:id", authUser, isAdmin, deleteProduct);

module.exports = router;
