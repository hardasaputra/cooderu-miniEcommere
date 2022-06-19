const jwt = require("jsonwebtoken");
const privateKey = "hello123";

const verify = (req, res, next) => {
  const token = req.headers["authenctication"];
  jwt.verify(token, privateKey, (err, decode) => {
    if (err) {
      return res.status(402).send({
        message: "User is not authorize",
      });
    }
    req.id = decode.id;
    req.email = decode.email;
    next();
  });
};

const generateToken = (payload) => {
  const token = jwt.sign(payload, privateKey, {
    algorithm: "HS256",
    expiresIn: "1H",
  });
  return token;
};

module.exports = {
  generateToken,
  verify,
};
