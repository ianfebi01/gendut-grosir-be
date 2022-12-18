const express = require("express");
const { auth, loginSuccess, getMe } = require("../conrollers/user");
const passport = require("passport");
const User = require("../models/User");
const { authUser } = require("../middlewares/authUser");

const router = express.Router();

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  loginSuccess
);
router.get("/me", authUser, getMe);

module.exports = router;
