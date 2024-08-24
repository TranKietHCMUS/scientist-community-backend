const express = require('express');
const router = express.Router();
const multer = require('multer');
const {updateUser, 
    getUser,
    useGlobalID,
    createGlobalID,
    myCertificateList} = require("../controllers/user.controller");
const {verifyToken} = require("../middlewares/verify-token");
const storage = require("../configs/multer");
  
const upload = multer({ storage });

router.use(verifyToken);

router.patch("/me", upload.single('file'), updateUser);
router.get("/:id", getUser);
router.post("/globalid", useGlobalID);
router.post("/globalid/create-new", createGlobalID);
router.get("/me/certificates", myCertificateList);

module.exports = router;