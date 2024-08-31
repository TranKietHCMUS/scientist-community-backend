const axios = require('axios');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../configs/nodemailer");
require("dotenv").config();

const db = require("../configs/db");
const User = db.user;

const {readAndTransformImageToBase64, 
    generageVerifyCode, 
    generateRandomPassword, 
    generateToken} = require("../utils/services");

const registerUser = async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username}});
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
        full_name: req.body.full_name,
        password: hashedPassword,
        verify_code: verifyCode
    }
     
    await User.create(newUser)
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

const verifyEmail = async (req, res) => {
    const verifyCode = req.body.verify_code;
    const username = verifyCode.slice(0, verifyCode.length - 7)
    const user = await User.findOne({ where: { username: username}});
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
    const user = await User.findOne({ where: { email: req.body.email }});
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
    const user = await User.findOne({ where: { username: username}});
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

const loginUser = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
    const user = await User.findOne({ where: { username: req.body.username }});
    if (!user)
        return res.status(404).json({
            data: {},
            status: 404,
            message: "User does not exists!"
        });
    
    if (!user.is_verify)
        return res.status(401).json({
            data: {},
            status: 401,
            message: "You must verify your email!"
        });

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match)
        return res.status(400).json({
            data: {},
            status: 400,
            message: "Incorrect password!"
        });
    
    const accessToken = generateToken(user, process.env.JWT_ACCESS_KEY, process.env.ACCESS_TIME);
    const refreshToken = generateToken(user, process.env.JWT_REFRESH_KEY, process.env.REFRESH_TIME);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, 
        path: "/api/auth/refresh",
        sameSite: "strict",
    });

    res.cookie("refreshLogout", refreshToken, {
        httpOnly: true, 
        path: "/api/auth/logout",
        sameSite: "strict",
    });

    const {password, refresh_token, verify_code,...others} = user.dataValues;

    user.refresh_token = refreshToken;
    await user.save() ;

    if (user.avatar)
        others.avatar = await readAndTransformImageToBase64(user.avatar);

    return res.status(200).json({
        data: {
            user: others,
            access_token: accessToken
        },
        status: 200,
        message: "Logged in successfully!"
    });
}

const logoutUser = async (req, res) => {
    const refreshToken = req.cookies.refreshLogout;

    res.clearCookie("refreshToken");
    res.clearCookie("refreshLogout");

    const user = await User.findOne({ where: { refresh_token: refreshToken }});
    if (!user)
        return res.status(404).json({
                data: {},
                status: 404,
                message: "Unauthorized!"
            });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') 
                return res.status(401).json({
                    data: {},
                    status: 401,
                    message: "Token has expired!"
                });
            else 
                return res.status(403).json({
                    data: {},
                    status: 403,
                    message: "Token is not valid!"
                });
        }
    });

    user.refresh_token = null;
    await user.save();

    return res.status(200).json({
        data: {},
        status: 200,
        message: "User has been logged out."}
    );
}

const requestRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.status(401).json({
            data: {},
            status: 401,
            message: "You're not authenticated!"
        });
    
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
        const userDB = await User.findByPk(user.user_id);
        
        if (err || !userDB || refreshToken !== userDB.dataValues.refresh_token) {
            res.clearCookie("refreshToken");
            res.clearCookie("refreshLogout");
            return res.status(401).json({
                data: {},
                status: 401,
                message: "You're not authenticated!"
            });
        }
        
        const newAccessToken = generateToken(user, process.env.JWT_ACCESS_KEY, process.env.ACCESS_TIME);
        const newRefreshToken = generateToken(user, process.env.JWT_REFRESH_KEY, process.env.REFRESH_TIME);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            path: "/api/auth/refresh",
            sameSite: "strict",
        });
        res.cookie("refreshLogout", newRefreshToken, {
            httpOnly: true, 
            path: "/api/auth/logout",
            sameSite: "strict",
        });

        userDB.refresh_token = newRefreshToken;
        await userDB.save();

        return res.status(200).json({
            data: {
                access_token: newAccessToken
            },
            status: 200,
            message: "Refresh token successfully."
        });
    });
};

const oauthGoogle = async (req, res) => {
    let user = await User.findOne({where: {email: req.body.email}});
    if (!user) {
        const newUser = {
            username: req.body.email,
            email: req.body.email,
            full_name: req.body.full_name,
            password: generateRandomPassword(20),
            is_verify: true
        }

        await User.create(newUser)
        
        user = await User.findOne({where: {email: req.body.email}});
    }

    const accessToken = generateToken(user, process.env.JWT_ACCESS_KEY, process.env.ACCESS_TIME);
    const refreshToken = generateToken(user, process.env.JWT_REFRESH_KEY, process.env.REFRESH_TIME);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, 
        path: "/api/auth/refresh",
        sameSite: "strict",
    });

    res.cookie("refreshLogout", refreshToken, {
        httpOnly: true, 
        path: "/api/auth/logout",
        sameSite: "strict",
    });

    const {password, refresh_token, verify_code,...others} = user.dataValues;

    user.refresh_token = refreshToken;
    await user.save() ;

    if (user.avatar)
        others.avatar = await readAndTransformImageToBase64(user.avatar);

    return res.status(200).json({
        data: {
            user: others,
            access_token: accessToken
        },
        status: 200,
        message: "Logged in successfully!"
    });
}

module.exports = {
    loginUser,
    requestRefreshToken,
    logoutUser,
    oauthGoogle,
    registerUser,
    verifyEmail,
    forgetPassword,
    resetPassword
  };