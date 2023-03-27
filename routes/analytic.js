const express = require("express");
const { getAnalytic } = require("../controllers/analytic");
const { authUser } = require("../middlewares/authUser");

const router = express.Router();

router.get("/analytic", authUser, getAnalytic);

module.exports = router;
