const express = require('express');
const router = express.Router();
const {loginUser, 
    requestRefreshToken, 
    logoutUser, 
    oauthGoogle,
    verifyEmail, 
    forgetPassword, 
    resetPassword,
    registerUser
} = require("../controllers/auth.controller");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh", requestRefreshToken);
router.post("/logout", logoutUser);
router.post("/email/verify", verifyEmail);
router.post("/password/forget", forgetPassword);
router.post("/password/reset", resetPassword);
router.get("/oauth/google", oauthGoogle);

module.exports = router;
