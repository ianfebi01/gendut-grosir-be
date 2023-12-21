const express = require("express");
const { postMenu, getMenu } = require("../controllers/menu");
const { authUser } = require("../middlewares/authUser");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/menu", authUser, isAdmin, postMenu);
router.post("/default-menu", authUser, isAdmin, postDefaultMenu);
router.get("/menu", authUser, getMenu);

module.exports = router;
