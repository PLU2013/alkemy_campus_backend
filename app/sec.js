const util = require("util");
const jwt = require("jsonwebtoken");
const cfg = require("./config/config");
const randToken = require("rand-token");

const jwtSign = util.promisify(jwt.sign);

const UIDs = {};

const sec = {
  async generateToken(payload) {
    try {
      const refreshToken = randToken.uid(256);
      payload.refreshToken = refreshToken;
      UIDs[payload.email] = refreshToken;
      const variablePrivateKey = refreshToken.substring(48, 97);
      const token = await jwtSign(
        payload,
        cfg.PRIVATE_KEY + variablePrivateKey,
        {
          expiresIn: cfg.JWT_EXP,
          algorithm: cfg.JWT_ALGORITM,
        }
      );
      return token;
    } catch (err) {
      console.log("ERROR: generateToken function");
      console.log(err);
    }
  },

  validateToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const token = bearerHeader.split(" ")[1];
      const variablePrivateKey = parseJwt(token).refreshToken.substring(48, 97);
      jwt.verify(
        token,
        cfg.PRIVATE_KEY + variablePrivateKey,
        { algorithms: [cfg.JWT_ALGORITM] },
        (err, payload) => {
          const { email, refreshToken } = payload ?? "";
          if (!err && email in UIDs && UIDs[email] == refreshToken) {
            req.body.jwtPayload = payload;
            next();
          } else {
            res.status(401).json({ message: "401 Unauthorized" });
          }
        }
      );
    } else {
      res.status(403).json({ message: "403 Forbidden" });
    }
  },

  async refreshTokenService(req, res) {
    const { email, refreshToken } = req.body.jwtPayload ?? "";
    delete req.body.jwtPayload.iat;
    delete req.body.jwtPayload.exp;
    if (email in UIDs && UIDs[email] == refreshToken) {
      console.log(`User Token Refreshed => ${email} - ${new Date()}\n`);
      const refreshToken = randToken.uid(256);
      const variablePrivateKey = refreshToken.substring(48, 97);
      UIDs[email] = refreshToken;
      req.body.jwtPayload.refreshToken = refreshToken;
      const token = await jwtSign(
        req.body.jwtPayload,
        cfg.PRIVATE_KEY + variablePrivateKey,
        {
          expiresIn: cfg.JWT_EXP,
          algorithm: cfg.JWT_ALGORITM,
        }
      );
      res.status(200).json(token);
    } else {
      res.status(401).json({ message: "401 Unauthorized" });
    }
  },

  async rejectTokenService(req, res) {
    const { email, refreshToken } = req.body.jwtPayload ?? "";
    console.log(`User Logout => ${email} - ${new Date()}\n`);
    if (email in UIDs && UIDs[email] == refreshToken) {
      delete UIDs[email];
      res.status(204).json({ message: "User logout" });
    } else {
      res.status(401).json({ message: "401 Unauthorized" });
    }
  },
};

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(Buffer.from(base64, "base64").toString());
}

module.exports = sec;
