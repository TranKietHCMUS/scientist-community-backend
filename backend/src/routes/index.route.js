const express = require('express');
const router = express.Router();

const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const communityRoute = require("./community.route");

router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/communities", communityRoute);

module.exports = router;
