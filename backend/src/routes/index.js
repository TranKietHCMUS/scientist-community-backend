const express = require('express');
const router = express.Router();

const userRoute = require("./user");
const authRoute = require("./auth");
const communityRoute = require("./community");

router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/communities", communityRoute);

module.exports = router;
