const util = require("util");
const jwt = require("jsonwebtoken");
const cfg = require("./config/config");
const randToken = require("rand-token");

const jwtSign = util.promisify(jwt.sign);

const UIDs = {};

const sec = {
  async generateToken(payload) {
    try {
      console.log("Init token...");
      UIDs;
      const refreshToken = randToken.uid(256);
      payload.refreshToken = refreshToken;
      UIDs[payload.email] = refreshToken;
      const token = await jwtSign(payload, cfg.PRIVATE_KEY, {
        expiresIn: cfg.JWT_EXP,
        algorithm: cfg.JWT_ALGORITM,
      });
      console.log(token);
      return token;
    } catch (err) {
      console.log(err);
    }
  },

  validateToken(req, res, next) {
    const { token } = req.body;
    // if (token) {
    jwt.verify(
      token,
      cfg.PRIVATE_KEY,
      { algorithms: [cfg.JWT_ALGORITM] },
      (err, payload) => {
        const { email, refreshToken } = req.body.payload ?? "";
        if (!err && email in UIDs && UIDs[email] == refreshToken) {
          req.body.jwtPayload = payload;
          next();
        } else {
          res.status(401).send("401 Unauthorized");
        }
      }
    );
    // }
  },

  async refreshTokenService(req, res) {
    const { email, refreshToken } = req.body.jwtPayload ?? "";
    delete req.body.jwtPayload.iat;
    delete req.body.jwtPayload.exp;
    if (email in UIDs && UIDs[email] == refreshToken) {
      const token = await jwtSign(req.body.jwtPayload, cfg.PRIVATE_KEY, {
        expiresIn: cfg.JWT_EXP,
        algorithm: cfg.JWT_ALGORITM,
      });
      res.status(200).json(token);
    } else {
      res.status(401).send("<h1>401 - Unauthorized</h1>");
    }
  },

  async rejectTokenService(req, res) {
    const { email, refreshToken } = req.body.jwtPayload ?? "";
    if (email in UIDs && UIDs[email] == refreshToken) {
      delete UIDs[email];
      res.status(204).json({ message: "user logout" });
    } else {
      res.status(401).send("<h1>401 - Unauthorized</h1>");
    }
  },
};

module.exports = sec;
