const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') 
          return res.status(401).json({
            data: {},
            status: 401,
            message: "Token has expired!"
          });
        else return res.status(403).json({
          data: {},
          status: 403,
          message: "Token is not valid!"
        });
      }
      req.user = user;
      next();
    });
  } 
  else {
    return res.status(401).json({
      data: {},
      status: 401,
      message: "You are not authenticated!"
    });
  }
};

module.exports = {
  verifyToken
};