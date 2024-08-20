const express = require('express');
const router = express.Router();
const {getCommunityList, createCommunity, getCommunityDetail} = require("../Controllers/communityController");
const {verifyToken} = require("../Middlewares/verifyToken")

router.get("/", verifyToken, getCommunityList);
router.post("/", verifyToken, createCommunity);
router.get("/detail/:id", verifyToken, getCommunityDetail);

module.exports = router;