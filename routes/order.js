const express = require("express");
const { postOrder } = require("../conrollers/order");
const { authUser } = require("../middlewares/authUser");

const router = express.Router();

router.post("/order", authUser, postOrder);

module.exports = router;
