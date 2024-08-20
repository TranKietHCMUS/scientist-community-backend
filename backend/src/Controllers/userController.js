require("dotenv").config();

const appRootPath = require("app-root-path");
const db = require("../Models/db");
const Users = db.users;
const fs = require('fs');

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
};

const updateAvatarUser = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            data: {},
            status: 400,
            message: "No file uploaded!"
        });
    }

    const user = await Users.findByPk(req.user.id);

    if (!user)
        return res.status(404).json({
            data: {},
            status: 404,
            message: "User not found!"
        });

    // const oldAvatarPath = appRootPath + "\\public\\upload\\" + user.avatar;
    
    // fs.unlink(oldAvatarPath, (err) => {
    //     if (err) console.error(err);
    // });

    user.avatar = req.file.filename;
    await user.save();
    
    return res.status(200).json({
        data: {},
        status: 200,
        message: "Update avatar successfully.!"
    });
};

const getAvatarUser = async (req, res) => {
    const user = await Users.findByPk(req.user.id);

    if (!user)
        return res.status(404).json({
            data: {},
            status: 404,
            message: "User not found!"
        });
    
    const imagePath = appRootPath + "\\public\\upload\\" + user.avatar;
    
    fs.readFile(imagePath, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                data: {},
                status: 500,
                message: "Fail to read file!"
            });
        }

        const base64Image = data.toString('base64');
        const imageData = 'data:image/jpeg;base64,' + base64Image;
        
        return res.status(200).json({
            data: {
                base64Image: imageData
            },
            status: 200,
            message: "Get avatar successfully!"
        });
    });
}

module.exports = {
    updateProfileUser,
    getProfileUser,
    updateAvatarUser,
    getAvatarUser
}