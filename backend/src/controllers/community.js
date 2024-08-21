const { get } = require("../Routes/userRoute");
const { STATUS_CODE, formatResponse } = require("../Utils/formatResponse");
const db = require("../configs/db");
const Community = db.community;
const BasicTest = db.basic_test;
const Document = db.document;

const getCommunityList = async (req, res) => {
  const communities = await Community.findAll({
    attributes: ["id", "name", "owner"],
    order: [["createdAt"]],
  });
  const owner_communities = communities.filter(
    (community) => community.owner === req.user.id
  );
  const not_owner_communities = communities.filter(
    (community) => community.owner !== req.user.id
  );

  const data = [...owner_communities, ...not_owner_communities];

  return res.status(200).json({
    data: data,
    status: 200,
    message: "Success!",
  });
};

const createCommunity = async (req, res) => {
  const newCommunity = {
    name: req.body.name,
    owner: req.user.id,
  };

  await Community.create(newCommunity);
  return res.status(200).json({
    data: newCommunity,
    status: 200,
    message: "Success!",
  });
};

const getCommunityDetail = async (req, res) => {
  const community = await Community.findOne({ where: { id: req.params.id } });

  if (!community)
    return res.status(404).json({
      data: {},
      status: 404,
      message: "Community not found!",
    });

  return res.status(200).json({
    data: community,
    status: 200,
    message: "Get detail successfully!",
  });
};

const getBasicTestFromCommunity = async (req, res) => {
  const communityId = req.params.comId;
  const basicTest = await BasicTest.findOne({
    where: { community: communityId },
  });
  if (!basicTest) {
    return formatResponse(
      res,
      {},
      STATUS_CODE.NOT_FOUND,
      "Basic test not found!"
    );
  }
  return formatResponse(res, basicTest, STATUS_CODE.OK, "Success!");
};

const submitBasicTestToCommunity = async (req, res) => {
  return formatResponse(res, {}, STATUS_CODE.OK, "Success!");
};

const createBasicTest = async (req, res) => {
  const communityId = req.params.comId;
  const content = req.body.content;
  const newBasicTest = {
    content: content,
    community_id: communityId,
  };
  await BasicTest.create(newBasicTest);
  return formatResponse(res, newBasicTest, STATUS_CODE.CREATED, "Success!");
};

const getDocumentsFromCommunity = async (req, res) => {
  const communityId = req.params.comId;
  const documents = await Document.findAll({
    where: { community_id: communityId },
  });
  return formatResponse(res, documents, STATUS_CODE.OK, "Success!");
};

const createDocument = async (req, res) => {
  const newDocument = {
    title: req.body.title,
    content: req.body.content,
    owner: req.user.id,
    community_id: req.params.comId,
    price: req.body.price,
  };
  await Document.create(newDocument);
  return formatResponse(res, newDocument, STATUS_CODE.CREATED, "Success!");
};

const getChatRooms = async (req, res) => {
  return formatResponse(res, {}, STATUS_CODE.OK, "Success!");
};

const getChatHistory = async (req, res) => {
  return formatResponse(res, {}, STATUS_CODE.OK, "Success!");
};

module.exports = {
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
};
