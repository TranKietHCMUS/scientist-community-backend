const express = require('express');
const router = express.Router();
const multer = require('multer');
const {updateUser, 
    getUser,
    useWallet,
    createWallet} = require("../controllers/user.controller");
const {verifyToken} = require("../middlewares/verify-token");
const storage = require("../configs/multer");
  
const upload = multer({ storage });

router.use(verifyToken);

router.patch("/me", upload.single('file'), updateUser);
router.get("/:user_id", getUser);
router.post("/wallet", useWallet);
router.post("/wallet/create-new", createWallet);

module.exports = router;