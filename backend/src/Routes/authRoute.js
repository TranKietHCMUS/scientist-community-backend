const express = require('express');
const router = express.Router();
const {loginUser, registerUser, requestRefreshToken, logoutUser, verifyUser, forgetPassword, resetPassword} = require("../Controllers/authController");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh", requestRefreshToken);
router.post("/logout", logoutUser);
router.post("/verify", verifyUser);
router.post("/password/forget", forgetPassword);
router.post("/password/reset", resetPassword);

module.exports = router;