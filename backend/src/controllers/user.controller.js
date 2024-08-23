require("dotenv").config();

const appRootPath = require("app-root-path");
const db = require("../configs/db");
const Users = db.users;
const fs = require('fs');
const {formatFilePath, readAndTransformImageToBase64} = require("../utils/services");

const updateUser = async (req, res) => {
    const user = await Users.findByPk(req.user.id);
    if (!user)
        return res.status(404).json({
            data: {},
            status: 404,
            message: "User not found!"
        });

    user.name = req.body.name;
    user.about_me = req.body.about_me;
    user.day_of_birth = req.body.day_of_birth;
    user.avatar = req.file ? formatFilePath(req.file.filename) : user.avatar;

    console.log(user.avatar);

    await user.save();
    const {password, refresh_token, verify_code,...others} = user.dataValues;

    others.avatar = req.file ? await readAndTransformImageToBase64(user.avatar) : null;

    return res.status(200).json({
        data: others,
        status: 200,
        message: "Update profile successfully!"
    });
};

const getUser = async (req, res) => {
    const user = await Users.findByPk(req.user.id);
    if (!user)
        return res.status(404).json({
            data: {},
            status: 404,
            message: "User not found!"
        });

    const {password, refresh_token, verify_code,...others} = user.dataValues;

    others.avatar = await readAndTransformImageToBase64(user.avatar);

    return res.status(200).json({
        data: others,
        status: 200,
        message: "Get profile successfully!"
    });
};

module.exports = {
    updateUser,
    getUser,
}