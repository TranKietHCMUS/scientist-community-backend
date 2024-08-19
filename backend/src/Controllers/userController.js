require("dotenv").config();

const db = require("../Models/db")
const Users = db.users

const updateProfileUser = async (req, res) => {
    const user = Users.findByPk(req.user.id);
    if (!user)
        return res.status(404).json({
            data: {},
            status: 404,
            message: "User not found!"
        });

    user.name = req.body.name;
    user.about_me = req.body.about_me;
    user.day_of_birth = req.body.day_of_birth;

    await user.save();
    const {password, refresh_token, verify_code,...others} = user.dataValues;

    return res.status(200).json({
        data: others,
        status: 200,
        message: "Update profile successfully!"
    });
};

const getProfileUser = async (req, res) => {
    const user = Users.findByPk(req.user.id);
    if (!user)
        return res.status(404).json({
            data: {},
            status: 404,
            message: "User not found!"
        });

    const {password, refresh_token, verify_code,...others} = user.dataValues;

    return res.status(200).json({
        data: others,
        status: 200,
        message: "Update profile successfully!"
    });
}

module.exports = {
    updateProfileUser,
    getProfileUser
}