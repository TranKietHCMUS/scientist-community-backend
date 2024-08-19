const express = require('express');
const router = express.Router();
const {updateProfileUser, getProfileUser} = require("../Controllers/userController");
const {verifyToken} = require("../Middlewares/verifyToken");

router.patch("/:id", verifyToken, updateProfileUser);
router.get("/:id", verifyToken, getProfileUser);

module.exports = router;