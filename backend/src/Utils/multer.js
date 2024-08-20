const multer = require('multer');
const path = require('path');
const appRoot = require('app-root-path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, appRoot + '\\public\\upload');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + file.originalname);
    }
});

module.exports = storage;