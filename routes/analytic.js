const express = require("express");
const { getAnalytic } = require("../conrollers/analytic");
const { authUser } = require("../middlewares/authUser");

const router = express.Router();

router.get("/analytic", authUser, getAnalytic);

module.exports = router;
