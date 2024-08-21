const express = require('express');
const router = express.Router();
const {getCommunityList, createCommunity, getCommunityDetail} = require("../controllers/community");
const {verifyToken} = require("../middlewares/verify-token")

router.get("/", verifyToken, getCommunityList);
router.post("/", verifyToken, createCommunity);
router.get("/detail/:id", verifyToken, getCommunityDetail);

module.exports = router;