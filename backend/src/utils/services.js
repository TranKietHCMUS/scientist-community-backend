const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const appRootPath = require("app-root-path");
const fs = require('fs').promises;

const formatFilePath = (fileName) => {
    const path = appRootPath + "\\public\\upload\\" + fileName;
    console.log(path);
    console.log(fileName);
    return path;
};

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
};

const generateRandomPassword = (email, name) => {
    const password = email + name;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
};

const readAndTransformImageToBase64 = async (imagePath) => {
    try {
        const data = await fs.readFile(imagePath);
        const base64Image = data.toString('base64');
        const imageData = 'data:image/jpeg;base64,' + base64Image;
        return imageData;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

module.exports = {
    generateToken,
    generageVerifyCode,
    generateRandomPassword,
    formatFilePath,
    readAndTransformImageToBase64
}