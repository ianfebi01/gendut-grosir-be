const express = require("express");
const {
  postOrder,
  getOrder,
  download,
  changeStatusOrder,
  cancelOrder,
} = require("../controllers/order");
const { authUser } = require("../middlewares/authUser");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/order", authUser, postOrder);
router.put("/changeStatusOrder/:orderId", authUser, changeStatusOrder);
router.put("/cancelOrder/:orderId", authUser, cancelOrder);
router.get("/order", authUser, isAdmin, getOrder);
router.get("/order/download", download);

module.exports = router;
