const db = require("../Models/db");
const Community = db.community;

const getCommunityList = async (req, res) => {
    const communities = await Community.findAll({ attributes: ['id', 'name', 'owner'], order: [['createdAt']]});
    const owner_communities = communities.filter(community => community.owner === req.user.id);
    const not_owner_communities = communities.filter(community => community.owner !== req.user.id);

    const data = [...owner_communities, ...not_owner_communities];

    return res.status(200).json({
        data: data,
        status: 200,
        message: "Success!"
    });
};

const createCommunity = async (req, res) => {
    const newCommunity = {
        name: req.body.name,
        owner: req.user.id,
    }

    await Community.create(newCommunity);
    return res.status(200).json({
        data: newCommunity,
        status: 200,
        message: "Success!"
    });
};

const getCommunityDetail = async (req, res) => {
    const community = await Community.findOne({where: {id: req.params.id}});

    if (!community)
        return res.status(404).json({
            data: {},
            status: 404,
            message: "Community not found!"
        });
    
    return res.status(200).json({
        data: community,
        status: 200,
        message: "Get detail successfully!"
    });
}

module.exports = {
    getCommunityList,
    createCommunity,
    getCommunityDetail
}
