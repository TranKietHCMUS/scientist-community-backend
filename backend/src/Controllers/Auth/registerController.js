const bcrypt = require("bcrypt");
const sendEmail = require("../../Utils/nodemailer");
require("dotenv").config();

const db = require("../../Models/db");
const Users = db.users;

const generageVerifyCode = (username) => {
    const min = Math.pow(10, 6 - 1);
    const max = Math.pow(10, 6) - 1;
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return username + "-" + num.toString();
}

const registerUser = async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password || !req.body.name)
        return res.status(400).json({
            data: {},
            status: 400,
            message: "All fields are required!"
        });
    const user = await Users.findOne({ where: { username: req.body.username}});
    if (user)
        return res.status(400).json({
            data: {},
            status: 400,
            message: "User already exists!"
        });
    
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const verifyCode = generageVerifyCode(req.body.username);

    const newUser = {
        email: req.body.email,
        username: req.body.username,
        name: req.body.name,
        password: hashedPassword,
        verify_code: verifyCode
    }
     
    Users.create(newUser)
    .then(user => {
        sendEmail(user.email, verifyCode);
        return res.status(200).json({
                data: {},
                status: 200,
                message: "Let's verify your email!"
            });
    })
    .catch(err => {
        return res.status(500).json({
                data: {},
                status: 500,
                message: err
            });
    });
}

const verifyUser = async (req, res) => {
    const verifyCode = req.body.verify_code;
    const username = verifyCode.slice(0, verifyCode.length - 7)
    const user = await Users.findOne({ where: { username: username}});
    if (!user || user.verify_code !== verifyCode) {
        await user.destroy();
        return res.status(204).json({
            data: {},
            status: 204,
            message: "Wrong verify code. Can not create account!"
        });
    }

    user.is_verify = true;
    user.verify_code = null;
    await user.save();

    const {password, refresh_token, verify_code,...others} = user.dataValues;
    return res.status(201).json({
        data: others,
        status: 201,
        message: "Created account!"
    });
};

const forgetPassword = async (req, res) => {
    email = req.body.email;
    const user = await Users.findOne({ where: { email: req.body.email }});
    if (!user)
        return res.status(404).json({
            data: {},
            status: 404,
            message: "Email not found!"
        });
    const verifyCode = generageVerifyCode(user.username);

    user.verify_code = verifyCode;
    await user.save();
    
    sendEmail(user.email, verifyCode);

    return res.status(200).json({
        data: {},
        status: 200,
        message: "Let's verify your email!"
    });
};

const resetPassword = async (req, res) => {
    const verifyCode = req.body.verify_code;
    const username = verifyCode.slice(0, verifyCode.length - 7)
    const user = await Users.findOne({ where: { username: username}});
    if (user.verify_code !== verifyCode) {
        return res.status(400).json({
            data: {},
            status: 400,
            message: "Wrong verify code. Can not change password!"
        });
    }
    
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    user.password = hashedPassword;
    user.verify_code = null;
    await user.save();

    return res.status(200).json({
        data: {},
        status: 200,
        message: "Change password successfully!"
    });
};

module.exports = {
    registerUser,
    verifyUser,
    resetPassword,
    forgetPassword,
};