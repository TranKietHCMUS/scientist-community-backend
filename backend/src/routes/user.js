const express = require('express');
const router = express.Router();
const multer = require('multer');
const {updateProfileUser, 
    getProfileUser, 
    updateAvatarUser, 
    getAvatarUser} = require("../controllers/user");
const {verifyToken} = require("../middlewares/verify-token");
const storage = require("../configs/multer");
  
const upload = multer({ storage });

router.use(verifyToken);

router.route("/")
    .get(getProfileUser)
    .patch(updateProfileUser);

router.route("/avatar")
    .get(getAvatarUser)
    .post(upload.single('file'), updateAvatarUser);

module.exports = router;