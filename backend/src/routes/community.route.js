const express = require('express');
const router = express.Router();
const {getCommunityList, createCommunity, getCommunityDetail} = require("../controllers/community.controller");
const {verifyToken} = require("../middlewares/verify-token");

router.use(verifyToken);

router.route("/")
    .get(getCommunityList)
    .post(createCommunity);

router.get("/detail/:id", verifyToken, getCommunityDetail);

module.exports = router;