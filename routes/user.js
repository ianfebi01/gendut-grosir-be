const express = require("express");
const {
  auth,
  loginSuccess,
  getMe,
  getAllUser,
  register,
  login,
  deleteUser,
  getUserById,
  editUser,
} = require("../conrollers/user");
const passport = require("passport");
const User = require("../models/User");
const { authUser } = require("../middlewares/authUser");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  loginSuccess
);
router.get("/me", authUser, getMe);
router.get("/getUserById/:id", authUser, getUserById);
router.put("/editUser/:id", authUser, isAdmin, editUser);
router.get("/getAllUser", authUser, isAdmin, getAllUser);
router.post("/register", register);
router.post("/login", login);
router.delete("/deleteUser/:id", authUser, isAdmin, deleteUser);

module.exports = router;
