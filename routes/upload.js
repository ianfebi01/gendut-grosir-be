const express = require("express");
const { uploadImages, deleteImage } = require("../conrollers/upload");
const { authUser } = require("../middlewares/authUser");
const imageUpload = require("../middlewares/imageUpload");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/uploadImages", authUser, isAdmin, imageUpload, uploadImages);
router.post("/deleteImage", authUser, isAdmin, deleteImage);

module.exports = router;
