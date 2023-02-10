const express = require("express");
const { postOrder, getOrder } = require("../conrollers/order");
const { authUser } = require("../middlewares/authUser");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/order", authUser, postOrder);
router.get("/order", authUser, isAdmin, getOrder);

module.exports = router;
