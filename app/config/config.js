const dotenv = require("dotenv").config();

module.exports = {
  PORT: process.env.PORT | 3000,
  DB: process.env.DB,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  JWT_EXP: process.env.JWT_EXP,
  JWT_ALGORITM: process.env.JWT_ALGORITM,
};
