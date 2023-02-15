const express = require("express");
const { postMenu, getMenu } = require("../conrollers/Menu");
const { authUser } = require("../middlewares/authUser");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/menu", authUser, isAdmin, postMenu);
router.get("/menu", authUser, getMenu);

module.exports = router;
