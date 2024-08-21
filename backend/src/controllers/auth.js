const axios = require('axios');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../configs/nodemailer");
require("dotenv").config();

const db = require("../configs/db");
const Users = db.users;

const generateToken = (user, secret_key, expire) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
        name: user.name,
    }, secret_key, {expiresIn: expire});
};

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

const loginUser = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
    const user = await Users.findOne({ where: { username: req.body.username }});
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

    console.log(user.created_at);

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

    const user = await Users.findOne({ where: { refresh_token: refreshToken }});
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
        if (err) 
            return res.status(401).json({
                data: {},
                status: 401,
                message: "You're not authenticated!"
            });
        
        const userDB = await Users.findByPk(user.id);

        if (!userDB || refreshToken !== userDB.dataValues.refresh_token)
            return res.status(401).json({
                data: {},
                status: 401,
                message: "You're not authenticated!"
            });
        
            const newAccessToken = generateToken(user, process.env.JWT_ACCESS_KEY, "15m");
            const newRefreshToken = generateToken(user, process.env.JWT_REFRESH_KEY, "3d");

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "strict"
            });
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
                data: {},
                status: 200,
                message: "Refresh token successfully."
            });
    });
}

const getOauthGooleToken = async (code) => {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post(
      'https://oauth2.googleapis.com/token',
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    return data
  }
  
  const getGoogleUser = async ({ id_token, access_token }) => {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo',
      {
        params: {
          access_token,
          alt: 'json'
        },
        headers: {
          Authorization: `Bearer ${id_token}`
        }
      }
    )
    return data
  }
  
const oauthGoogle = async (req, res, next) => {
    try {
      const { code } = req.query
      const data = await getOauthGooleToken(code)
      const { id_token, access_token } = data
      const googleUser = await getGoogleUser({ id_token, access_token })
  
      if (!googleUser.verified_email) {
        return res.status(403).json({
          message: 'Google email not verified'
        })
      }
  
      const manual_access_token = jwt.sign(
        { email: googleUser.email, type: 'access_token' },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: '15m' }
      )
      const manual_refresh_token = jwt.sign(
        { email: googleUser.email, type: 'refresh_token' },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: '100d' }
      )
  
      console.log(googleUser)

      res.cookie("refreshToken", manual_refresh_token, {
        httpOnly: true, 
        sameSite: "strict",
    });
  
      return res.status(200).json({
        data: {},
        status: 200,
        message: "Successfully!"
      })
    } catch (error) {
      next(error)
    }
  };

module.exports = {
    loginUser,
    requestRefreshToken,
    logoutUser,
    oauthGoogle,
    registerUser,
    verifyUser,
    forgetPassword,
    resetPassword
  };