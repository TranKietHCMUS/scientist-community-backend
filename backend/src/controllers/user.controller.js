require("dotenv").config();

const db = require("../configs/db");
const User = db.user;
const Wallet = db.wallet;

const {formatFilePath, readAndTransformImageToBase64} = require("../utils/services");

const updateUser = async (req, res) => {
    const user = await User.findByPk(req.user.user_id);
    if (!user)
        return res.status(404).json({
            data: {},
            status: 404,
            message: "User not found!"
        });

    user.full_name = req.body.full_name ? req.body.full_name : user.full_name;
    user.description = req.body.description ? req.body.description : user.description;
    user.day_of_birth = req.body.day_of_birth ? req.body.day_of_birth : user.day_of_birth;
    user.phone = req.body.phone ? req.body.phone : user.phone;
    user.avatar = req.file ? formatFilePath(req.file.filename) : user.avatar;

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
    const user = await User.findByPk(req.params.user_id);
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

const useWallet = async (req, res) => {  
    const wallet = await Wallet.findOne({where: {id: req.body.global_id}});
    if (wallet)
        return res.status(400).json({
            data: {},
            status: 400,
            message: "You have already used this wallet!"
        });

    await Wallet.create({
        global_id: req.body.global_id,
        created_by: req.user.user_id
    });

    return res.status(200).json({
        data: {},
        status: 200,
        message: "Successfully!"
    });
};

const createWallet = async (req, res) => {
    const id = Math.floor(Math.random() * (100000 - 1 + 1)) + 1;
    await Wallet.create({
        global_id: id,
        created_by: req.user.user_id
    });

    return res.status(200).json({
        data: {
            wallet: {
                global_id: id,
                created_by: req.user.user_id
            }
        },
        status: 200,
        message: "Successfully!"
    });
};

module.exports = {
    updateUser,
    getUser,
    useWallet,
    createWallet,
}