const express = require('express');
const router = express.Router();
const {loginUser, 
    requestRefreshToken, 
    logoutUser, 
    oauthGoogle,
    verifyUser, 
    forgetPassword, 
    resetPassword,
    registerUser
} = require("../controllers/auth");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh", requestRefreshToken);
router.post("/logout", logoutUser);
router.post("/verify", verifyUser);
router.post("/password/forget", forgetPassword);
router.post("/password/reset", resetPassword);
router.get("/oauth/google", oauthGoogle);

module.exports = router;
