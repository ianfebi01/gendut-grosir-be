const express = require("express");
const { postVariant } = require("../conrollers/variant");
const { authUser } = require("../middlewares/authUser");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/variant", authUser, isAdmin, postVariant);

module.exports = router;
