const express = require("express");
const router = express.Router();
const {
  getCommunityList,
  createCommunity,
  getCommunityDetail,
  getBasicTestFromCommunity,
  submitBasicTestToCommunity,
  getDocumentsFromCommunity,
  getChatRooms,
  getChatHistory,
  createBasicTest,
  createDocument,
} = require("../controllers/communityController");
const { verifyToken } = require("../middlewares/verifyToken");

router.use(verifyToken); // protect all routes in this file

router.route("/").get(getCommunityList).post(createCommunity);

router.route("/:id/detail").get(getCommunityDetail);

router
  .route("/:comId/basic-test")
  .get(getBasicTestFromCommunity)
  .post(submitBasicTestToCommunity);

router.route("/:comId/basic-test/create").post(createBasicTest);

router
  .route("/:comId/documents")
  .get(getDocumentsFromCommunity)
  .post(createDocument);

router.route("/:comId/chats").get(getChatRooms);

router.route("/:comId/chats/:roomId").get(getChatHistory);

module.exports = router;
