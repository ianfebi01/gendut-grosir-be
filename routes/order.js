const express = require("express");
const {
  postOrder,
  getOrder,
  download,
  changeStatusOrder,
  cancelOrder,
  updateTime,
} = require("../controllers/order");
const { authUser } = require("../middlewares/authUser");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/order", authUser, postOrder);
router.put("/changeStatusOrder/:orderId", authUser, changeStatusOrder);
router.put("/cancelOrder/:orderId", authUser, cancelOrder);
router.get("/order", authUser, isAdmin, getOrder);
router.get("/order/download", download);
router.get("/order/updateTime", updateTime);

module.exports = router;
