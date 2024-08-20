const express = require('express');
const router = express.Router();
const multer = require('multer');
const {updateProfileUser, getProfileUser, updateAvatarUser, getAvatarUser} = require("../Controllers/User/userController");
const {verifyToken} = require("../Middlewares/verifyToken");
const storage = require("../Utils/multer");
  
const upload = multer({ storage });

router.patch("/", verifyToken, updateProfileUser);
router.get("/", verifyToken, getProfileUser);
router.post("/avatar", verifyToken, upload.single('file'), updateAvatarUser);
router.get("/avatar", verifyToken, getAvatarUser);

module.exports = router;